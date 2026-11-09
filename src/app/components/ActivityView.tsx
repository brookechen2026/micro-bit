import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { activities, blockTypes } from "../data/lessons";
import { BlockPalette } from "./BlockPalette";
import { CodeWorkspace } from "./CodeWorkspace";
import { MicrobitSimulator } from "./MicrobitSimulator";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Target, Lightbulb, Trophy, Home, CheckCircle } from "lucide-react";
import { useProgress } from "../hooks/useProgress";
import { toast } from "sonner";

export function ActivityView() {
  const { activityId } = useParams();
  const navigate = useNavigate();
  const { markActivityComplete } = useProgress();

  const activity = activities.find((a) => a.id === activityId);
  const [showHints, setShowHints] = useState(false);
  const [hintIndex, setHintIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [simulatorState, setSimulatorState] = useState<any>({});
  const [completedCode, setCompletedCode] = useState(false);
  const [currentBlocks, setCurrentBlocks] = useState<any[]>([]);

  useEffect(() => {
    if (!activity) {
      navigate("/");
    }
  }, [activity, navigate]);

  if (!activity) {
    return null;
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-700 border-green-200";
      case "intermediate":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "advanced":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const handleRunCode = (blocks: any[]) => {
    // Store current blocks for event handling
    setCurrentBlocks(blocks);

    // Check if activity is completed
    const hasRequiredBlocks = activity.requiredBlocks.every((reqBlock) =>
      blocks.some((block) => block.id === reqBlock)
    );

    if (hasRequiredBlocks && !completedCode) {
      setCompletedCode(true);
      markActivityComplete(activity.id);
      toast.success("Challenge Complete! 🎉", {
        description: "Excellent work! You've mastered this concept.",
      });
    }

    // Execute code
    setTimeout(() => {
      executeBlocks(blocks);
    }, 100);
  };

  const groupBlocksByEvents = (blocks: any[]) => {
    const groups: Record<string, any[]> = {};
    let currentEvent: string | null = null;

    for (const block of blocks) {
      if (block.id.startsWith("on-")) {
        // This is an event block, start a new group
        currentEvent = block.id;
        groups[currentEvent] = [];
      } else if (currentEvent) {
        // This is an action block, add it to the current event group
        groups[currentEvent].push(block);
      }
    }

    return groups;
  };

  const executeBlocks = async (blocks: any[]) => {
    const eventGroups = groupBlocksByEvents(blocks);

    // Only execute "on start" blocks when Run Code is pressed
    setIsRunning(true);
    if (eventGroups["on-start"] && eventGroups["on-start"].length > 0) {
      await executeBlockSequence(eventGroups["on-start"]);
    } else {
      toast.info("Program running. Add 'on start' to run code immediately, or use event blocks");
    }
    setIsRunning(false);
  };

  const executeBlockSequence = async (blocks: any[]) => {
    for (const block of blocks) {
      if (block.id === "show-string") {
        const text = block.userParams?.text || block.params?.[0]?.default || "";
        setSimulatorState({ currentDisplay: text });
        await delay(text.length * 600); // Scroll time based on length (400ms display + 200ms blank)
      } else if (block.id === "show-number") {
        const num = block.userParams?.value ?? block.params?.[0]?.default ?? 0;
        setSimulatorState({ currentDisplay: num });
        await delay(1000);
      } else if (block.id === "show-icon") {
        const icon = block.userParams?.icon || block.params?.[0]?.default || "Heart";
        setSimulatorState({ currentIcon: icon });
        await delay(1000);
      } else if (block.id === "clear-screen") {
        setSimulatorState({});
        await delay(500);
      } else if (block.id === "pause") {
        const ms = block.userParams?.ms ?? block.params?.[0]?.default ?? 100;
        await delay(ms);
      } else if (block.id === "forever") {
        // Simulate 3 iterations
        for (let i = 0; i < 3; i++) {
          // In real implementation, would loop forever
          // For demo, just loop a few times
        }
      }
    }
  };

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const handleButtonPress = async (button: "A" | "B") => {
    if (currentBlocks.length === 0) {
      toast.info(`Button ${button} pressed - Add code blocks to respond`);
      return;
    }

    // Group blocks by their event handlers
    const eventGroups = groupBlocksByEvents(currentBlocks);
    const eventId = button === "A" ? "on-button-a" : "on-button-b";

    if (!eventGroups[eventId] || eventGroups[eventId].length === 0) {
      toast.info(`Button ${button} pressed - Add 'on button ${button} pressed' event block with action blocks`);
      return;
    }

    // Show button feedback
    toast.success(`Button ${button} pressed!`);
    setIsRunning(true);

    // Execute the blocks for this button event
    await executeBlockSequence(eventGroups[eventId]);

    // Don't stop running - keep the simulator active
  };

  const handlePinPress = (pin: 0 | 1 | 2) => {
    toast.info(`Pin ${pin} pressed`);
  };

  const showNextHint = () => {
    if (hintIndex < activity.hints.length - 1) {
      setHintIndex(hintIndex + 1);
    }
    setShowHints(true);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <Home className="w-4 h-4" />
                Home
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{activity.title}</h1>
              <p className="text-sm text-gray-600">{activity.description}</p>
            </div>
          </div>
          <Badge className={getDifficultyColor(activity.difficulty)}>
            {activity.difficulty}
          </Badge>
        </div>

        {/* Challenge Card */}
        <Card className="border-2 border-red-200 bg-red-50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-red-600" />
              <CardTitle>Challenge Objective</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-900 font-medium">{activity.objective}</p>
            {completedCode && (
              <div className="mt-4 flex items-center gap-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span className="font-semibold">Completed!</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Hints */}
          <div className="lg:col-span-1">
            <Card className="border-yellow-200 bg-yellow-50">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-600" />
                  <CardTitle className="text-sm">Hints</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {!showHints ? (
                  <div className="text-center py-4">
                    <p className="text-sm text-yellow-800 mb-3">
                      Try solving the challenge first!
                    </p>
                    <Button onClick={() => setShowHints(true)} variant="outline" size="sm">
                      Show First Hint
                    </Button>
                  </div>
                ) : (
                  <>
                    <ul className="space-y-3">
                      {activity.hints.slice(0, hintIndex + 1).map((hint, index) => (
                        <li key={index} className="text-sm text-yellow-900 flex gap-2">
                          <span className="font-semibold">{index + 1}.</span>
                          <span>{hint}</span>
                        </li>
                      ))}
                    </ul>
                    {hintIndex < activity.hints.length - 1 && (
                      <Button
                        onClick={showNextHint}
                        variant="outline"
                        size="sm"
                        className="w-full"
                      >
                        Show Next Hint ({hintIndex + 1}/{activity.hints.length})
                      </Button>
                    )}
                  </>
                )}
              </CardContent>
            </Card>

            {completedCode && (
              <Card className="border-green-200 bg-green-50 mt-4">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-green-600" />
                    <CardTitle className="text-sm">Well Done!</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-green-900 mb-3">
                    You've successfully completed this challenge! Try exploring different
                    solutions or move on to the next activity.
                  </p>
                  <Link to="/">
                    <Button size="sm" className="w-full">
                      Back to Home
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Middle & Right Columns - Coding Environment */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Block Palette */}
              <div className="md:col-span-1">
                <BlockPalette blocks={blockTypes} />
              </div>

              {/* Code Workspace */}
              <div className="md:col-span-2 space-y-6">
                <CodeWorkspace onRun={handleRunCode} />

                {/* Simulator */}
                <MicrobitSimulator
                  isRunning={isRunning}
                  currentDisplay={simulatorState.currentDisplay}
                  currentIcon={simulatorState.currentIcon}
                  onButtonPress={handleButtonPress}
                  onPinPress={handlePinPress}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
}
