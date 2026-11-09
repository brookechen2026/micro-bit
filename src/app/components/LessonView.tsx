import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { lessons, blockTypes } from "../data/lessons";
import { BlockPalette } from "./BlockPalette";
import { CodeWorkspace } from "./CodeWorkspace";
import { MicrobitSimulator } from "./MicrobitSimulator";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Textarea } from "./ui/textarea";
import {
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  BookOpen,
  CheckCircle,
  Home,
  Calendar,
  MessageSquare,
} from "lucide-react";
import { useProgress } from "../hooks/useProgress";
import { toast } from "sonner";

export function LessonView() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const { markLessonComplete } = useProgress();

  const lesson = lessons.find((l) => l.id === lessonId);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [showHints, setShowHints] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [simulatorState, setSimulatorState] = useState<any>({});
  const [currentBlocks, setCurrentBlocks] = useState<any[]>([]);
  const [variables, setVariables] = useState<Record<string, number>>({});
  const [reflectionAnswer, setReflectionAnswer] = useState("");
  const [deviceDescription, setDeviceDescription] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const [stepCompleted, setStepCompleted] = useState(false);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [selectedAnswer2, setSelectedAnswer2] = useState<string | null>(null);

  useEffect(() => {
    if (!lesson) {
      navigate("/");
    }
  }, [lesson, navigate]);

  // Reset simulator state when changing pages
  useEffect(() => {
    setSimulatorState({});
    setIsRunning(false);
    setVariables({});

    // Special case: For Week 2 page 3, preserve blocks from page 2
    const isWeek2Page3 = lesson?.id === "week2-algorithms" && currentPageIndex === 2;
    if (!isWeek2Page3) {
      setCurrentBlocks([]);
    }

    setSelectedCard(null);
    setSelectedAnswer(null);
    setSelectedAnswer2(null);

    // Load saved reflection answer for this page
    if (lesson) {
      const savedAnswer = localStorage.getItem(`reflection-${lesson.id}-page-${currentPageIndex}`);
      setReflectionAnswer(savedAnswer || "");
    }
  }, [currentPageIndex, lesson]);

  // Save reflection answer to localStorage
  useEffect(() => {
    if (lesson && reflectionAnswer.trim()) {
      localStorage.setItem(`reflection-${lesson.id}-page-${currentPageIndex}`, reflectionAnswer);
    }
  }, [reflectionAnswer, lesson, currentPageIndex]);

  if (!lesson) {
    return null;
  }

  const currentPage = lesson.pages[currentPageIndex];
  const isLastPage = currentPageIndex === lesson.pages.length - 1;
  const isFirstPage = currentPageIndex === 0;
  const isGuidedMode = currentPage?.guided && currentPage?.steps;
  const currentStepData = isGuidedMode ? currentPage.steps[currentStep] : null;
  const isLastStep = isGuidedMode && currentStep === currentPage.steps.length - 1;

  const handleNextPage = () => {
    if (isLastPage) {
      markLessonComplete(lesson.id);
      toast.success("Lesson completed! 🎉", {
        description: "Great job! Keep learning.",
      });
      navigate("/");
    } else {
      // Show fun completion message for challenge page
      if (currentPage.id === "page-4") {
        toast.success("Challenge Complete! 🏆", {
          description: "You're becoming a micro:bit master!",
          duration: 3000,
        });
      }
      setCurrentPageIndex((prev) => prev + 1);
      setShowHints(false);
      setCurrentStep(0);
      setStepCompleted(false);
    }
  };

  const handleCheckStep = () => {
    if (!currentStepData) return;

    // Special check for page 3 last step: must run code first
    const isPage3LastStep = currentPage.id === "page-3" && isLastStep;
    if (isPage3LastStep && !isRunning) {
      toast.error("Click 'Run Code' first, then test the buttons!", {
        duration: 2000,
      });
      return;
    }

    // Count occurrences of each required block type (including all blocks, not just events)
    const blockCounts: Record<string, number> = {};

    // Count all blocks in the workspace (both event blocks and action blocks)
    currentBlocks.forEach(block => {
      blockCounts[block.id] = (blockCounts[block.id] || 0) + 1;
    });

    // For steps requiring multiple show-icon blocks (like step 4 of page 3)
    const requiredCounts: Record<string, number> = {};
    currentStepData.requiredBlocks.forEach(reqBlock => {
      requiredCounts[reqBlock] = (requiredCounts[reqBlock] || 0) + 1;
    });

    const hasRequiredBlocks = Object.entries(requiredCounts).every(
      ([blockId, count]) => (blockCounts[blockId] || 0) >= count
    );

    if (hasRequiredBlocks) {
      setStepCompleted(true);
      toast.success(currentStepData.validationMessage || "Step complete!", {
        duration: 2000,
      });

      // Auto-advance to next step after a delay
      setTimeout(() => {
        if (!isLastStep) {
          setCurrentStep((prev) => prev + 1);
          setStepCompleted(false);
        }
      }, 1500);
    } else {
      toast.error("Not quite! Follow the instruction above.", {
        duration: 2000,
      });
    }
  };

  const handlePreviousPage = () => {
    if (!isFirstPage) {
      setCurrentPageIndex((prev) => prev - 1);
      setShowHints(false);
    }
  };

  const handleRunCode = async (blocks: any[]) => {
    // Store the blocks for event handling and validation
    setCurrentBlocks(blocks);

    // Group blocks by their event handlers
    const eventGroups = groupBlocksByEvents(blocks);

    // Only execute "on start" event blocks when Run Code is pressed
    if (eventGroups["on-start"] && eventGroups["on-start"].length > 0) {
      setIsRunning(true);
      await executeBlocks(eventGroups["on-start"]);
    } else {
      setIsRunning(true);
      toast.info("Program running. Add 'on start' to run code immediately, or use event blocks like 'on button A pressed'");
    }
  };

  // Group blocks by their parent event handlers
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
    // Use a local copy of variables that updates immediately within this execution
    let localVars = { ...variables };

    for (const block of blocks) {
      // Skip event blocks during execution
      if (block.id.startsWith("on-")) {
        continue;
      }

      if (block.id === "show-string") {
        const text = block.userParams?.text || block.params?.[0]?.default || "";
        setSimulatorState({ currentDisplay: text, currentIcon: undefined });
        await delay(text.length * 600); // Scroll time based on length (400ms display + 200ms blank)
      } else if (block.id === "show-number") {
        const num = block.userParams?.value ?? block.params?.[0]?.default ?? 0;
        setSimulatorState({ currentDisplay: num, currentIcon: undefined });
        await delay(1000);
      } else if (block.id === "show-icon") {
        const icon = block.userParams?.icon || block.params?.[0]?.default || "Heart";
        setSimulatorState({ currentIcon: icon, currentDisplay: undefined });
        await delay(1000);
      } else if (block.id === "clear-screen") {
        setSimulatorState({});
        await delay(300);
      } else if (block.id === "pause") {
        const ms = block.userParams?.ms ?? block.params?.[0]?.default ?? 100;
        await delay(ms);
      } else if (block.id === "set-variable") {
        const varName = block.userParams?.variable || block.params?.[0]?.default || "count";
        const value = block.userParams?.value ?? block.params?.[1]?.default ?? 0;
        localVars[varName] = value;
        setVariables({ ...localVars });
      } else if (block.id === "change-variable") {
        const varName = block.userParams?.variable || block.params?.[0]?.default || "count";
        const by = block.userParams?.by ?? block.params?.[1]?.default ?? 1;
        localVars[varName] = (localVars[varName] || 0) + by;
        setVariables({ ...localVars });
      } else if (block.id === "show-variable") {
        const varName = block.userParams?.variable || block.params?.[0]?.default || "total";
        const value = localVars[varName] || 0;
        setSimulatorState({ currentDisplay: value, currentIcon: undefined });
        await delay(1000);
      }
    }

    // Keep running state active - don't automatically stop
    // This simulates the micro:bit staying on
  };

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const handlePinPress = (pin: 0 | 1 | 2) => {
    toast.info(`Pin ${pin} pressed`);
  };

  const handleButtonPress = async (button: "A" | "B") => {
    if (currentBlocks.length === 0) {
      toast.info(`Button ${button} pressed`, {
        description: "Add code blocks to make it respond",
      });
      return;
    }

    // Group blocks by their event handlers
    const eventGroups = groupBlocksByEvents(currentBlocks);
    const eventId = button === "A" ? "on-button-a" : "on-button-b";

    if (!eventGroups[eventId] || eventGroups[eventId].length === 0) {
      toast.info(`Button ${button} pressed`, {
        description: `Add 'on button ${button} pressed' to respond`,
      });
      return;
    }

    // Show immediate visual feedback for page 3 (input/output teaching)
    if (currentPage.id === "page-3") {
      toast.success(`YOU: Pressed button ${button}`, {
        description: "Watch the micro:bit respond! ✨",
        duration: 1500,
      });
    } else {
      toast.success(`Button ${button} pressed!`);
    }

    setIsRunning(true);

    // Execute the blocks for this button event
    await executeBlocks(eventGroups[eventId]);

    // Don't stop running - keep the simulator active
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
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="text-xs">
                  <Calendar className="w-3 h-3 mr-1" />
                  Week {lesson.week}
                </Badge>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">{lesson.title}</h1>
              <p className="text-sm text-gray-600">
                Page {currentPageIndex + 1} of {lesson.pages.length}
              </p>
            </div>
          </div>
          <Badge className="bg-blue-100 text-blue-700 border-blue-200">
            <BookOpen className="w-3 h-3 mr-1" />
            {currentPage.concept}
          </Badge>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-red-500 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${((currentPageIndex + 1) / lesson.pages.length) * 100}%`,
            }}
          />
        </div>

        {/* Main Content Grid */}
        {currentPageIndex === 0 && lesson.id === "week1-intro-to-microbit" ? (
          // Special intro page layout
          <div className="max-w-3xl mx-auto">
            <Card className="border-2 border-red-200 shadow-lg">
              <CardContent className="p-8 md:p-12 space-y-8">
                {/* Hero Section */}
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">What is the micro:bit?</h2>
                  <p className="text-lg text-gray-700 max-w-xl mx-auto">
                    The micro:bit is a tiny computer you can program to do amazing things! It has buttons, lights, and sensors.
                  </p>
                </div>

                {/* Input/Output Diagram */}
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-blue-200">
                  <h3 className="text-center font-semibold text-gray-900 mb-6">How the micro:bit works</h3>
                  <div className="flex items-center justify-center gap-4 md:gap-8">
                    {/* Input */}
                    <div className="flex-1 max-w-[140px] text-center space-y-3">
                      <div className="bg-white rounded-lg p-4 shadow-md border border-blue-300">
                        <div className="text-3xl mb-2">👆</div>
                        <div className="text-sm font-semibold text-gray-900">INPUT</div>
                      </div>
                      <div className="text-xs text-gray-600 space-y-1">
                        <div>• Press buttons</div>
                        <div>• Touch pins</div>
                        <div>• Tilt device</div>
                      </div>
                    </div>

                    {/* Arrow */}
                    <div className="flex-shrink-0">
                      <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>

                    {/* Output */}
                    <div className="flex-1 max-w-[140px] text-center space-y-3">
                      <div className="bg-white rounded-lg p-4 shadow-md border border-purple-300">
                        <div className="text-3xl mb-2">✨</div>
                        <div className="text-sm font-semibold text-gray-900">OUTPUT</div>
                      </div>
                      <div className="text-xs text-gray-600 space-y-1">
                        <div>• Show lights</div>
                        <div>• Display images</div>
                        <div>• Send signals</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* What You'll Learn */}
                <div className="text-center space-y-3">
                  <h3 className="font-semibold text-gray-900">What will you learn?</h3>
                  <p className="text-gray-700">
                    You'll create programs by dragging and connecting code blocks. Make the micro:bit light up, show pictures, and respond to buttons.
                  </p>
                </div>

                {/* Start Lesson Button */}
                <div className="text-center pt-4">
                  <Button
                    onClick={handleNextPage}
                    size="lg"
                    className="text-lg px-8 py-6 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg"
                  >
                    Start Lesson
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : currentPage.id === "page-5" ? (
          /* Page 5 - Peer Activity with Code Workspace */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Activity Instructions */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="border-2 border-purple-400 bg-gradient-to-br from-purple-50 to-pink-50 shadow-lg">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="text-2xl">👥</div>
                    <CardTitle className="text-xl">{currentPage.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {currentPage.content.split("\n\n").map((section, index) => {
                    // Parse content sections
                    const lines = section.split("\n");
                    if (section.startsWith("**") && section.includes("**")) {
                      const title = section.match(/\*\*(.*?)\*\*/)?.[1];
                      const rest = section.replace(/\*\*.*?\*\*/, "").trim();
                      return (
                        <div key={index} className="space-y-2">
                          {title && <div className="font-bold text-gray-900">{title}</div>}
                          {rest && <div className="text-sm text-gray-700 whitespace-pre-line">{rest}</div>}
                        </div>
                      );
                    }
                    return (
                      <div key={index} className="text-sm text-gray-700 whitespace-pre-line">
                        {section}
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </div>

            {/* Right Columns - Coding Environment */}
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Block Palette */}
                <div className="md:col-span-1">
                  <BlockPalette blocks={blockTypes} allowedBlocks={undefined} />
                </div>

                {/* Code Workspace */}
                <div className="md:col-span-2 space-y-6">
                  <CodeWorkspace
                    key={currentPageIndex}
                    onRun={handleRunCode}
                    onBlocksChange={setCurrentBlocks}
                    guidedMode={false}
                    initialBlocks={[]}
                  />

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

              {/* Navigation Buttons */}
              <div className="flex justify-between gap-3">
                <Button
                  onClick={handlePreviousPage}
                  disabled={isFirstPage}
                  variant="outline"
                  className="gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>

                <Button onClick={handleNextPage} className="gap-2">
                  {isLastPage ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Complete Lesson
                    </>
                  ) : (
                    <>
                      Next Page
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        ) : currentPage.id === "page-6" ? (
          /* Page 6 - Full Width Review */
          <div className="max-w-7xl mx-auto space-y-6 px-4">
            <Card className="border-2 border-green-400 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <div className="text-3xl">🎉</div>
                      <CardTitle className="text-xl">{currentPage.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm font-semibold text-gray-700">Click each card to review what you learned:</p>

                    {/* Review Cards */}
                    <div className="grid grid-cols-1 gap-3">
                      {[
                        { title: "What is the micro:bit?", content: "A tiny computer with buttons, lights, and sensors that you can program!", icon: "💻" },
                        { title: "What is code?", content: "Instructions you give to the micro:bit to tell it what to do.", icon: "🧩" },
                        { title: "What is Input → Output?", content: "When you press a button (input), the micro:bit shows something (output).", icon: "⚡" }
                      ].map((card, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedCard(selectedCard === index ? null : index)}
                          className={`text-left p-4 rounded-lg border-2 transition-all ${
                            selectedCard === index
                              ? "border-green-500 bg-white shadow-lg scale-105"
                              : "border-gray-300 bg-white hover:border-green-300 hover:shadow-md"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="text-2xl">{card.icon}</div>
                            <div className="flex-1">
                              <div className="font-bold text-gray-900 mb-1">{card.title}</div>
                              {selectedCard === index && (
                                <div className="text-sm text-gray-700 mt-2 animate-in fade-in duration-200">
                                  {card.content}
                                </div>
                              )}
                            </div>
                            <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${selectedCard === index ? "rotate-90" : ""}`} />
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Multiple Choice Question 1 */}
                    <div className="mt-6 pt-6 border-t-2 border-gray-200">
                      <p className="font-bold text-gray-900 mb-3">Question 1:</p>
                      <p className="text-sm text-gray-700 mb-4">Which of these is an INPUT to the micro:bit?</p>

                      <div className="space-y-2">
                        {[
                          { id: "A", text: "Showing a heart on the LED display", correct: false },
                          { id: "B", text: "Pressing button A", correct: true },
                          { id: "C", text: "The micro:bit lighting up", correct: false }
                        ].map((option) => (
                          <button
                            key={option.id}
                            onClick={() => setSelectedAnswer(option.id)}
                            className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                              selectedAnswer === option.id
                                ? option.correct
                                  ? "border-green-500 bg-green-100"
                                  : "border-red-500 bg-red-100"
                                : "border-gray-300 bg-white hover:border-blue-300 hover:bg-blue-50"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-bold ${
                                selectedAnswer === option.id
                                  ? option.correct
                                    ? "border-green-500 bg-green-500 text-white"
                                    : "border-red-500 bg-red-500 text-white"
                                  : "border-gray-400 text-gray-600"
                              }`}>
                                {option.id}
                              </div>
                              <span className="text-sm text-gray-700">{option.text}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                      {selectedAnswer && (
                        <div className={`mt-3 p-3 rounded-lg ${
                          selectedAnswer === "B"
                            ? "bg-green-100 border-2 border-green-400"
                            : "bg-red-100 border-2 border-red-400"
                        }`}>
                          <p className={`text-sm font-semibold ${
                            selectedAnswer === "B" ? "text-green-900" : "text-red-900"
                          }`}>
                            {selectedAnswer === "B"
                              ? "✅ Correct! Pressing button A is an input!"
                              : "❌ Not quite! Try again - think about what YOU do."}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Multiple Choice Question 2 */}
                    <div className="mt-6 pt-6 border-t-2 border-gray-200">
                      <p className="font-bold text-gray-900 mb-3">Question 2:</p>
                      <p className="text-sm text-gray-700 mb-4">Which block makes the micro:bit show pictures?</p>

                      <div className="space-y-2">
                        {[
                          { id: "A", text: "on start", correct: false },
                          { id: "B", text: "show icon", correct: true },
                          { id: "C", text: "on button pressed", correct: false }
                        ].map((option) => (
                          <button
                            key={option.id}
                            onClick={() => setSelectedAnswer2(option.id)}
                            className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                              selectedAnswer2 === option.id
                                ? option.correct
                                  ? "border-green-500 bg-green-100"
                                  : "border-red-500 bg-red-100"
                                : "border-gray-300 bg-white hover:border-blue-300 hover:bg-blue-50"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-bold ${
                                selectedAnswer2 === option.id
                                  ? option.correct
                                    ? "border-green-500 bg-green-500 text-white"
                                    : "border-red-500 bg-red-500 text-white"
                                  : "border-gray-400 text-gray-600"
                              }`}>
                                {option.id}
                              </div>
                              <span className="text-sm text-gray-700">{option.text}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                      {selectedAnswer2 && (
                        <div className={`mt-3 p-3 rounded-lg ${
                          selectedAnswer2 === "B"
                            ? "bg-green-100 border-2 border-green-400"
                            : "bg-red-100 border-2 border-red-400"
                        }`}>
                          <p className={`text-sm font-semibold ${
                            selectedAnswer2 === "B" ? "text-green-900" : "text-red-900"
                          }`}>
                            {selectedAnswer2 === "B"
                              ? "✅ Correct! 'show icon' displays pictures on the LEDs!"
                              : "❌ Not quite! Try again - which block shows things?"}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

            {/* Navigation Buttons for Page 5 */}
            <div className="flex justify-between gap-3">
              <Button
                onClick={handlePreviousPage}
                variant="outline"
                className="gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              <Button
                onClick={handleNextPage}
                size="lg"
                disabled={selectedAnswer !== "B" || selectedAnswer2 !== "B"}
                className="gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-lg px-8 py-6 shadow-lg"
              >
                <CheckCircle className="w-5 h-5" />
                {selectedAnswer !== "B" || selectedAnswer2 !== "B"
                  ? "Answer Both Questions Correctly"
                  : "Complete Lesson"}
              </Button>
            </div>
          </div>
        ) : currentPage.id === "page-4" ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Challenge Card */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="border-2 border-yellow-400 bg-gradient-to-br from-yellow-50 to-orange-50 shadow-lg">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="text-2xl">🎮</div>
                    <CardTitle className="text-xl">{currentPage.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {currentPage.content.split("\n\n").map((section, index) => {
                    if (section.includes("**Mission:**")) {
                      return (
                        <div key={index} className="bg-white p-3 rounded-lg border-2 border-yellow-300">
                          <p className="text-sm font-semibold text-gray-900">
                            {section.replace("**Mission:**", "").trim()}
                          </p>
                        </div>
                      );
                    }
                    if (section.includes("**Goals:**")) {
                      const goals = section.split("\n").filter(line => line.includes("- [ ]"));
                      return (
                        <div key={index} className="space-y-2">
                          <div className="text-sm font-bold text-gray-900 mb-2">Goals:</div>
                          {goals.map((goal, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                              <CheckCircle className="w-4 h-4 text-gray-400" />
                              <span>{goal.replace("- [ ]", "").trim()}</span>
                            </div>
                          ))}
                        </div>
                      );
                    }
                    if (section.includes("**Bonus:**")) {
                      return (
                        <div key={index} className="bg-purple-100 p-3 rounded-lg border-2 border-purple-300">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">⭐</span>
                            <p className="text-sm text-purple-900">
                              <span className="font-bold">Bonus: </span>
                              {section.replace("**Bonus:**", "").trim()}
                            </p>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })}
                </CardContent>
              </Card>

              {/* Hints Section for page-4 */}
              {currentPage.hints && currentPage.hints.length > 0 && (
                <Card className="border-2 border-blue-400 bg-blue-50">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Lightbulb className="w-5 h-5 text-blue-600" />
                        <CardTitle className="text-sm">Need Help?</CardTitle>
                      </div>
                      <Button
                        onClick={() => setShowHints(!showHints)}
                        variant="ghost"
                        size="sm"
                        className="text-blue-700 hover:text-blue-900"
                      >
                        {showHints ? "Hide" : "Show Hints"}
                      </Button>
                    </div>
                  </CardHeader>
                  {showHints && (
                    <CardContent>
                      <ul className="space-y-2">
                        {currentPage.hints.map((hint, index) => (
                          <li key={index} className="text-sm flex gap-2 text-blue-900">
                            <span className="font-semibold">{index + 1}.</span>
                            <span>{hint}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  )}
                </Card>
              )}
            </div>

            {/* Right Columns - Coding Environment */}
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Block Palette */}
                <div className="md:col-span-1">
                  <BlockPalette blocks={blockTypes} allowedBlocks={undefined} />
                </div>

                {/* Code Workspace */}
                <div className="md:col-span-2 space-y-6">
                  <CodeWorkspace
                    key={currentPageIndex}
                    onRun={handleRunCode}
                    onBlocksChange={setCurrentBlocks}
                    guidedMode={false}
                    initialBlocks={[]}
                  />

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

              {/* Navigation Buttons */}
              <div className="flex justify-between gap-3">
                <Button
                  onClick={handlePreviousPage}
                  disabled={isFirstPage}
                  variant="outline"
                  className="gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>

                <Button onClick={handleNextPage} className="gap-2">
                  {isLastPage ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Complete Lesson
                    </>
                  ) : (
                    <>
                      Next Page
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        ) : lesson.id === "final-project" && currentPage.id === "page-1" ? (
          /* Final Project Page 1 - Project Selection */
          <div className="max-w-5xl mx-auto space-y-6">
            <Card className="border-2 border-green-500 bg-gradient-to-br from-green-50 to-emerald-50">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="text-3xl">🚀</div>
                  <CardTitle className="text-2xl">{currentPage.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold text-gray-800 mb-4">
                  Choose ONE of these real-world challenges to solve with your team:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Option 1 */}
                  <Card className="border-2 border-yellow-400 hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader className="pb-3">
                      <div className="text-4xl mb-2">💡</div>
                      <CardTitle className="text-lg">Option 1: Safety Wearable Device</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm space-y-2">
                      <p className="font-semibold text-gray-700">After dark, increased outdoor safety is needed.</p>
                      <p className="text-gray-600">Design a wearable device that:</p>
                      <ul className="list-disc list-inside text-gray-600 space-y-1">
                        <li>Is wearable (clothing/accessories)</li>
                        <li>Activated by wearer or environment</li>
                        <li>Increases visibility and safety</li>
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Option 2 */}
                  <Card className="border-2 border-purple-400 hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader className="pb-3">
                      <div className="text-4xl mb-2">🎨</div>
                      <CardTitle className="text-lg">Option 2: Interactive Art Installation</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm space-y-2">
                      <p className="font-semibold text-gray-700">A community center wants interactive art.</p>
                      <p className="text-gray-600">Design a display that:</p>
                      <ul className="list-disc list-inside text-gray-600 space-y-1">
                        <li>Includes lights and movement</li>
                        <li>Accessible for all ages</li>
                        <li>Responds to user interaction</li>
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Option 3 */}
                  <Card className="border-2 border-blue-400 hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader className="pb-3">
                      <div className="text-4xl mb-2">🤖</div>
                      <CardTitle className="text-lg">Option 3: Smart Dispenser Device</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm space-y-2">
                      <p className="font-semibold text-gray-700">People and pets need quick access to items.</p>
                      <p className="text-gray-600">Design a dispenser that:</p>
                      <ul className="list-disc list-inside text-gray-600 space-y-1">
                        <li>Has indicator lights</li>
                        <li>Uses a motor to dispense</li>
                        <li>Responds to environmental triggers</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                <div className="mt-6 p-4 bg-green-100 border-2 border-green-400 rounded-lg">
                  <p className="text-green-900 font-semibold">📋 Next Steps:</p>
                  <p className="text-green-800 text-sm mt-1">Discuss with your team and choose which project you want to build!</p>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between gap-3">
              <Button onClick={handlePreviousPage} disabled={isFirstPage} variant="outline" className="gap-2">
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              <Button onClick={handleNextPage} className="gap-2">
                Next Page
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ) : lesson.id === "final-project" && currentPage.id === "page-2" ? (
          /* Final Project Page 2 - Design Planning with Sketch Space */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Instructions */}
            <Card className="border-2 border-blue-400">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="text-2xl">📐</div>
                  <CardTitle>{currentPage.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div>
                  <p className="font-bold text-gray-900 mb-2">Questions to Answer:</p>
                  <ol className="list-decimal list-inside space-y-2 text-gray-700">
                    <li>What problem does your device solve?</li>
                    <li>How will users interact with it?</li>
                    <li>What micro:bit features will you use? (Buttons, LEDs, Sensors, Radio, Motors?)</li>
                    <li>What will happen when the device is activated?</li>
                    <li>What materials do you need besides the micro:bit?</li>
                  </ol>
                </div>
                <div className="p-3 bg-purple-50 border-2 border-purple-300 rounded-lg">
                  <p className="font-bold text-purple-900 mb-1">👥 Team Roles:</p>
                  <p className="text-purple-800 text-sm">Decide who will work on what part of the project!</p>
                </div>
              </CardContent>
            </Card>

            {/* Right Column - Design Planning & Description Space */}
            <div className="space-y-4">
              <Card className="border-2 border-green-400">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <span>📐</span> Design Planning Notes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Describe your device design here. What will it look like? Where will the micro:bit be placed? How will all parts connect together?"
                    className="min-h-[200px] resize-none text-sm"
                    value={reflectionAnswer}
                    onChange={(e) => setReflectionAnswer(e.target.value)}
                  />
                  {reflectionAnswer.trim() && (
                    <p className="text-xs text-green-600 mt-2">✓ Design saved automatically</p>
                  )}
                </CardContent>
              </Card>

              <Card className="border-2 border-orange-400">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <span>📝</span> Materials & Features List
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="List the materials you'll need and micro:bit features you'll use (buttons, LEDs, sensors, motors, etc.)..."
                    className="min-h-[150px] resize-none text-sm"
                    value={deviceDescription}
                    onChange={(e) => setDeviceDescription(e.target.value)}
                  />
                  {deviceDescription.trim() && (
                    <p className="text-xs text-green-600 mt-2">✓ Materials saved automatically</p>
                  )}
                </CardContent>
              </Card>

              <div className="flex justify-between gap-3">
                <Button onClick={handlePreviousPage} variant="outline" className="gap-2">
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>
                <Button onClick={handleNextPage} className="gap-2">
                  Next: Build Your Project
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ) : lesson.id === "final-project" && currentPage.id === "page-3" ? (
          /* Final Project Page 3 - Build with Workspace */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Tips */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="border-2 border-green-500 bg-gradient-to-br from-green-50 to-emerald-50">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className="text-3xl">🚀</div>
                    <CardTitle className="text-xl">{currentPage.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <p className="text-lg font-semibold text-gray-800">Now Get Started Building!</p>

                  <div className="p-3 bg-blue-50 border-2 border-blue-300 rounded-lg">
                    <p className="font-bold text-blue-900 mb-2">Coding Tips:</p>
                    <ul className="text-blue-800 space-y-1 text-xs">
                      <li>• Start simple - one feature first</li>
                      <li>• Test frequently after each change</li>
                      <li>• Debug together as a team</li>
                      <li>• Add complexity gradually</li>
                    </ul>
                  </div>

                  <div className="p-3 bg-green-50 border-2 border-green-400 rounded-lg">
                    <p className="font-bold text-green-900 text-sm mb-1">💡 Remember:</p>
                    <p className="text-green-800 text-xs">Your project should solve the problem you chose. Make sure it actually works for the intended purpose!</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Columns - Coding Environment */}
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                  <BlockPalette blocks={blockTypes} allowedBlocks={undefined} />
                </div>
                <div className="md:col-span-2 space-y-6">
                  <CodeWorkspace
                    key={currentPageIndex}
                    onRun={handleRunCode}
                    onBlocksChange={setCurrentBlocks}
                    guidedMode={false}
                    initialBlocks={[]}
                  />
                  <MicrobitSimulator
                    isRunning={isRunning}
                    currentDisplay={simulatorState.currentDisplay}
                    currentIcon={simulatorState.currentIcon}
                    onButtonPress={handleButtonPress}
                    onPinPress={handlePinPress}
                  />
                </div>
              </div>

              <div className="flex justify-between gap-3">
                <Button onClick={handlePreviousPage} variant="outline" className="gap-2">
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>
                <Button onClick={handleNextPage} size="lg" className="gap-2 bg-gradient-to-r from-green-500 to-emerald-600">
                  <CheckCircle className="w-5 h-5" />
                  Complete Final Project
                </Button>
              </div>
            </div>
          </div>
        ) : !isGuidedMode ? (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{currentPage.title}</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                {currentPage.content.split("\n\n").map((paragraph, index) => {
                  // Check if this is a numbered list
                  const lines = paragraph.split("\n");
                  const isNumberedList = lines.every(line =>
                    line.trim() === "" || /^\d+\./.test(line.trim())
                  );

                  if (isNumberedList && lines.some(line => /^\d+\./.test(line.trim()))) {
                    return (
                      <ol key={index} className="list-decimal list-inside space-y-2 mb-3">
                        {lines.filter(line => /^\d+\./.test(line.trim())).map((line, i) => {
                          const text = line.replace(/^\d+\.\s*/, "");
                          const parts = text.split("**");
                          return (
                            <li key={i} className="text-sm text-gray-700 leading-relaxed">
                              {parts.map((part, j) =>
                                j % 2 === 1 ? (
                                  <strong key={j} className="font-semibold">{part}</strong>
                                ) : (
                                  <span key={j}>{part}</span>
                                )
                              )}
                            </li>
                          );
                        })}
                      </ol>
                    );
                  }

                  // Check if this is a bullet list
                  const isBulletList = lines.every(line =>
                    line.trim() === "" || line.trim().startsWith("•")
                  );

                  if (isBulletList && lines.some(line => line.trim().startsWith("•"))) {
                    return (
                      <ul key={index} className="list-disc list-inside space-y-2 mb-3">
                        {lines.filter(line => line.trim().startsWith("•")).map((line, i) => {
                          const text = line.replace(/^•\s*/, "");
                          const parts = text.split("**");
                          return (
                            <li key={i} className="text-sm text-gray-700 leading-relaxed">
                              {parts.map((part, j) =>
                                j % 2 === 1 ? (
                                  <strong key={j} className="font-semibold">{part}</strong>
                                ) : (
                                  <span key={j}>{part}</span>
                                )
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    );
                  }

                  // Regular paragraph - parse bold text
                  const parts = paragraph.split("**");
                  return (
                    <p key={index} className="text-sm text-gray-700 leading-relaxed mb-3">
                      {parts.map((part, i) =>
                        i % 2 === 1 ? (
                          <strong key={i} className="font-semibold">{part}</strong>
                        ) : (
                          <span key={i}>{part}</span>
                        )
                      )}
                    </p>
                  );
                })}
              </CardContent>
            </Card>

            {/* Hints Section - Hidden in guided mode, styled for challenges */}
            {!isGuidedMode && currentPage.hints && currentPage.hints.length > 0 && (
              <Card className={`${currentPage.id === "page-4" ? "border-2 border-blue-400 bg-blue-50" : "border-yellow-200 bg-yellow-50"}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Lightbulb className={`w-5 h-5 ${currentPage.id === "page-4" ? "text-blue-600" : "text-yellow-600"}`} />
                      <CardTitle className="text-sm">{currentPage.id === "page-4" ? "Need Help?" : "Hints"}</CardTitle>
                    </div>
                    <Button
                      onClick={() => setShowHints(!showHints)}
                      variant="ghost"
                      size="sm"
                      className={currentPage.id === "page-4" ? "text-blue-700 hover:text-blue-900" : ""}
                    >
                      {showHints ? "Hide" : "Show Hints"}
                    </Button>
                  </div>
                </CardHeader>
                {showHints && (
                  <CardContent>
                    <ul className="space-y-2">
                      {currentPage.hints.map((hint, index) => (
                        <li key={index} className={`text-sm flex gap-2 ${currentPage.id === "page-4" ? "text-blue-900" : "text-yellow-900"}`}>
                          <span className="font-semibold">{index + 1}.</span>
                          <span>{hint}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                )}
              </Card>
            )}

            {/* Reflection Question Input - Hidden in guided mode and page-6 */}
            {!isGuidedMode && currentPage.id !== "page-6" && (currentPage.content.toLowerCase().includes("reflection") ||
              currentPage.content.toLowerCase().includes("exit question") ||
              currentPage.title.toLowerCase().includes("wrap up") ||
              currentPage.concept.toLowerCase().includes("review")) && (
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-blue-600" />
                    <CardTitle className="text-sm">Your Answer</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Type your answer here... Your response will be automatically saved."
                    value={reflectionAnswer}
                    onChange={(e) => setReflectionAnswer(e.target.value)}
                    className="min-h-[120px] resize-none bg-white"
                  />
                  {reflectionAnswer.trim() && (
                    <p className="text-xs text-blue-600 mt-2">
                      ✓ Answer saved automatically
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between gap-3">
              <Button
                onClick={handlePreviousPage}
                disabled={isFirstPage}
                variant="outline"
                className="gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>

              {isGuidedMode && currentStep < (currentPage.steps?.length || 0) - 1 ? (
                <Button
                  onClick={handleCheckStep}
                  className="gap-2 bg-green-600 hover:bg-green-700"
                  disabled={stepCompleted}
                >
                  <CheckCircle className="w-4 h-4" />
                  {stepCompleted ? "Moving to next step..." : "Check Step"}
                </Button>
              ) : isGuidedMode && stepCompleted ? (
                <Button onClick={handleNextPage} className="gap-2">
                  {isLastPage ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Complete Lesson
                    </>
                  ) : (
                    <>
                      Next Page
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              ) : isGuidedMode ? (
                <Button
                  onClick={handleCheckStep}
                  className="gap-2 bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="w-4 h-4" />
                  Check Step
                </Button>
              ) : currentPage.id === "page-6" ? (
                <Button
                  onClick={handleNextPage}
                  size="lg"
                  disabled={selectedAnswer !== "B" || selectedAnswer2 !== "B"}
                  className="gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-lg px-8 py-6 shadow-lg"
                >
                  <CheckCircle className="w-5 h-5" />
                  {selectedAnswer !== "B" || selectedAnswer2 !== "B"
                    ? "Answer Both Questions Correctly"
                    : "Complete Lesson"}
                </Button>
              ) : (
                <Button onClick={handleNextPage} className="gap-2">
                  {isLastPage ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Complete Lesson
                    </>
                  ) : (
                    <>
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Lesson Content */}
          <div className="lg:col-span-1 space-y-6">
            {isGuidedMode ? (
              <>
              <Card className="bg-gradient-to-br from-gray-50 to-gray-100">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    {currentPage.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">{currentPage.content}</p>
                </CardContent>
              </Card>

              {/* Navigation Buttons */}
              <div className="flex justify-between gap-3">
                <Button
                  onClick={handlePreviousPage}
                  disabled={isFirstPage}
                  variant="outline"
                  className="gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>

                {currentStep < (currentPage.steps?.length || 0) - 1 ? (
                  <Button
                    onClick={handleCheckStep}
                    className="gap-2 bg-green-600 hover:bg-green-700"
                    disabled={stepCompleted}
                  >
                    <CheckCircle className="w-4 h-4" />
                    {stepCompleted ? "Moving to next step..." : "Check Step"}
                  </Button>
                ) : stepCompleted ? (
                  <Button onClick={handleNextPage} className="gap-2">
                    {isLastPage ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Complete Lesson
                      </>
                    ) : (
                      <>
                        Next Page
                        <ChevronRight className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    onClick={handleCheckStep}
                    className="gap-2 bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Check Step
                  </Button>
                )}
              </div>
              </>
            ) : (
              <>
              <Card>
                <CardHeader>
                  <CardTitle>{currentPage.title}</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-sm max-w-none">
                {currentPage.content.split("\n\n").map((paragraph, index) => {
                  // Check if this is a numbered list
                  const lines = paragraph.split("\n");
                  const isNumberedList = lines.every(line =>
                    line.trim() === "" || /^\d+\./.test(line.trim())
                  );

                  if (isNumberedList && lines.some(line => /^\d+\./.test(line.trim()))) {
                    return (
                      <ol key={index} className="list-decimal list-inside space-y-2 mb-3">
                        {lines.filter(line => /^\d+\./.test(line.trim())).map((line, i) => {
                          const text = line.replace(/^\d+\.\s*/, "");
                          const parts = text.split("**");
                          return (
                            <li key={i} className="text-sm text-gray-700 leading-relaxed">
                              {parts.map((part, j) =>
                                j % 2 === 1 ? (
                                  <strong key={j} className="font-semibold">{part}</strong>
                                ) : (
                                  <span key={j}>{part}</span>
                                )
                              )}
                            </li>
                          );
                        })}
                      </ol>
                    );
                  }

                  // Check if this is a bullet list
                  const isBulletList = lines.every(line =>
                    line.trim() === "" || line.trim().startsWith("•")
                  );

                  if (isBulletList && lines.some(line => line.trim().startsWith("•"))) {
                    return (
                      <ul key={index} className="list-disc list-inside space-y-2 mb-3">
                        {lines.filter(line => line.trim().startsWith("•")).map((line, i) => {
                          const text = line.replace(/^•\s*/, "");
                          const parts = text.split("**");
                          return (
                            <li key={i} className="text-sm text-gray-700 leading-relaxed">
                              {parts.map((part, j) =>
                                j % 2 === 1 ? (
                                  <strong key={j} className="font-semibold">{part}</strong>
                                ) : (
                                  <span key={j}>{part}</span>
                                )
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    );
                  }

                  // Regular paragraph - parse bold text
                  const parts = paragraph.split("**");
                  return (
                    <p key={index} className="text-sm text-gray-700 leading-relaxed mb-3">
                      {parts.map((part, i) =>
                        i % 2 === 1 ? (
                          <strong key={i} className="font-semibold">{part}</strong>
                        ) : (
                          <span key={i}>{part}</span>
                        )
                      )}
                    </p>
                  );
                })}
              </CardContent>
            </Card>

            {/* Hints Section - Hidden in guided mode, styled for challenges */}
            {!isGuidedMode && currentPage.hints && currentPage.hints.length > 0 && (
              <Card className={`${currentPage.id === "page-4" ? "border-2 border-blue-400 bg-blue-50" : "border-yellow-200 bg-yellow-50"}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Lightbulb className={`w-5 h-5 ${currentPage.id === "page-4" ? "text-blue-600" : "text-yellow-600"}`} />
                      <CardTitle className="text-sm">{currentPage.id === "page-4" ? "Need Help?" : "Hints"}</CardTitle>
                    </div>
                    <Button
                      onClick={() => setShowHints(!showHints)}
                      variant="ghost"
                      size="sm"
                      className={currentPage.id === "page-4" ? "text-blue-700 hover:text-blue-900" : ""}
                    >
                      {showHints ? "Hide" : "Show Hints"}
                    </Button>
                  </div>
                </CardHeader>
                {showHints && (
                  <CardContent>
                    <ul className="space-y-2">
                      {currentPage.hints.map((hint, index) => (
                        <li key={index} className={`text-sm flex gap-2 ${currentPage.id === "page-4" ? "text-blue-900" : "text-yellow-900"}`}>
                          <span className="font-semibold">{index + 1}.</span>
                          <span>{hint}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                )}
              </Card>
            )}

            {/* Reflection Question Input - Hidden in guided mode and page-6 */}
            {!isGuidedMode && currentPage.id !== "page-6" && (currentPage.content.toLowerCase().includes("reflection") ||
              currentPage.content.toLowerCase().includes("exit question") ||
              currentPage.title.toLowerCase().includes("wrap up") ||
              currentPage.concept.toLowerCase().includes("review")) && (
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-blue-600" />
                    <CardTitle className="text-sm">Your Answer</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Type your answer here... Your response will be automatically saved."
                    value={reflectionAnswer}
                    onChange={(e) => setReflectionAnswer(e.target.value)}
                    className="min-h-[120px] resize-none bg-white"
                  />
                  {reflectionAnswer.trim() && (
                    <p className="text-xs text-blue-600 mt-2">
                      ✓ Answer saved automatically
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between gap-3">
              <Button
                onClick={handlePreviousPage}
                disabled={isFirstPage}
                variant="outline"
                className="gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>

              {isGuidedMode && currentStep < (currentPage.steps?.length || 0) - 1 ? (
                <Button
                  onClick={handleCheckStep}
                  className="gap-2 bg-green-600 hover:bg-green-700"
                  disabled={stepCompleted}
                >
                  <CheckCircle className="w-4 h-4" />
                  {stepCompleted ? "Moving to next step..." : "Check Step"}
                </Button>
              ) : isGuidedMode && stepCompleted ? (
                <Button onClick={handleNextPage} className="gap-2">
                  {isLastPage ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Complete Lesson
                    </>
                  ) : (
                    <>
                      Next Page
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              ) : isGuidedMode ? (
                <Button
                  onClick={handleCheckStep}
                  className="gap-2 bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="w-4 h-4" />
                  Check Step
                </Button>
              ) : (
                <Button onClick={handleNextPage} className="gap-2">
                  {isLastPage ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Complete Lesson
                    </>
                  ) : (
                    <>
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              )}
            </div>
            </>
            )}
          </div>

          {/* Middle Column - Coding Environment */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Block Palette */}
              <div className="md:col-span-1">
                <BlockPalette
                  blocks={blockTypes}
                  allowedBlocks={currentStepData?.allowedBlocks}
                />
              </div>

              {/* Code Workspace */}
              <div className="md:col-span-2 space-y-6">
                {/* Guided Mode Instructions */}
                {isGuidedMode && currentStepData && (
                  <div className="space-y-4">
                    <Card className="border-2 border-blue-400 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-md">
                            {currentStep + 1}
                          </div>
                          <div className="flex-1">
                            <div className="text-xs font-semibold text-blue-600 mb-1">
                              STEP {currentStep + 1} OF {currentPage.steps?.length}
                            </div>
                            <p className="text-xl font-bold text-gray-900 mb-2">
                              {currentStepData.instruction}
                            </p>
                            {stepCompleted ? (
                              <p className="text-sm text-green-700 font-semibold mt-3 flex items-center gap-2 bg-green-100 px-3 py-2 rounded-lg">
                                <CheckCircle className="w-5 h-5" />
                                {currentStepData.validationMessage}
                              </p>
                            ) : (
                              <div className="flex gap-2 mt-3">
                                {Array.from({ length: currentPage.steps?.length || 0 }).map((_, i) => (
                                  <div
                                    key={i}
                                    className={`h-2 flex-1 rounded-full ${
                                      i < currentStep ? "bg-green-500" : i === currentStep ? "bg-blue-500" : "bg-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Test Your Buttons reminder */}
                    {currentPage.id === "page-3" && isLastStep && stepCompleted && (
                      <Card className="border-2 border-green-400 bg-green-50 animate-pulse">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="text-2xl">🎮</div>
                            <div>
                              <div className="font-bold text-green-900">Try it now!</div>
                              <div className="text-sm text-green-700">Click buttons A and B on the simulator below</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}

                <CodeWorkspace
                  key={
                    // For Week 2, use same key for pages 2-3 to preserve blocks
                    lesson?.id === "week2-algorithms" && (currentPageIndex === 1 || currentPageIndex === 2)
                      ? "week2-pages-2-3"
                      : currentPageIndex
                  }
                  onRun={handleRunCode}
                  onBlocksChange={setCurrentBlocks}
                  guidedMode={isGuidedMode}
                  initialBlocks={
                    currentPage.starterCode?.map((block, index) => ({
                      ...block,
                      instanceId: `starter-${index}`,
                    })) || []
                  }
                />

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
        )}
      </div>
    </DndProvider>
  );
}