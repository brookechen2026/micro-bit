import { Link } from "react-router";
import { lessons, activities } from "../data/lessons";
import { BookOpen, Target, Trophy, Clock, ArrowRight, Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { useProgress } from "../hooks/useProgress";

export function Home() {
  const { getProgress, getActivityCompletion } = useProgress();

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

  const totalLessons = lessons.length;
  const completedLessons = lessons.filter((lesson) =>
    getProgress(lesson.id)
  ).length;
  const totalActivities = activities.length;
  const completedActivities = activities.filter((activity) =>
    getActivityCompletion(activity.id)
  ).length;

  const overallProgress =
    ((completedLessons + completedActivities) / (totalLessons + totalActivities)) * 100;

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl p-8 text-white">
        <div className="max-w-3xl">
          <h2 className="text-3xl font-bold mb-3">Physical Computing with micro:bit</h2>
          <p className="text-lg text-red-50 mb-2">
            An 8-week course exploring computer programming using the BBC micro:bit, ending with a final project!
          </p>
          <p className="text-base text-red-100 mb-6">
            Learn through structured lessons covering algorithms, variables, conditionals, loops, sensors, and radio communication. Complete hands-on activities and build your skills progressively, then design your own micro:bit solution to a real-world problem.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <BookOpen className="w-5 h-5" />
                <span className="text-sm font-medium">Lessons</span>
              </div>
              <p className="text-2xl font-bold">
                {completedLessons}/{totalLessons}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <Target className="w-5 h-5" />
                <span className="text-sm font-medium">Activities</span>
              </div>
              <p className="text-2xl font-bold">
                {completedActivities}/{totalActivities}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <Trophy className="w-5 h-5" />
                <span className="text-sm font-medium">Progress</span>
              </div>
              <p className="text-2xl font-bold">{Math.round(overallProgress)}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      {overallProgress > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Learning Journey</CardTitle>
            <CardDescription>Keep up the great work!</CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={overallProgress} className="h-3" />
            <p className="text-sm text-gray-600 mt-2">
              {Math.round(overallProgress)}% complete
            </p>
          </CardContent>
        </Card>
      )}

      {/* Course Info */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-900">About This Course</CardTitle>
          <CardDescription className="text-blue-700">
            Physical Computing with micro:bit - 8 weeks of interactive learning
          </CardDescription>
        </CardHeader>
        <CardContent className="text-blue-900">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-semibold mb-2">What You'll Learn:</p>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li>Algorithms and computational thinking</li>
                <li>Variables and data management</li>
                <li>Conditionals and decision-making</li>
                <li>Loops and iteration patterns</li>
                <li>Sensor integration (accelerometer, compass, temperature)</li>
                <li>Wireless communication with radio</li>
                <li>Design and build your own final project</li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold mb-2">Course Structure:</p>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li>7 weekly lessons with multi-page content</li>
                <li>Final project week with real-world challenges</li>
                <li>15+ hands-on coding activities</li>
                <li>Progressive difficulty levels</li>
                <li>Live block-based coding environment</li>
                <li>Real-time micro:bit simulator</li>
                <li>Self-paced learning with hints and guidance</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lessons Section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-6 h-6 text-red-500" />
          <h3 className="text-2xl font-semibold text-gray-900">Course Curriculum</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lessons.map((lesson) => {
            const isCompleted = getProgress(lesson.id);
            return (
              <Card
                key={lesson.id}
                className="hover:shadow-lg transition-shadow border-2 hover:border-red-200"
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center text-red-600 font-bold">
                        W{lesson.week}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        <Calendar className="w-3 h-3 mr-1" />
                        Week {lesson.week}
                      </Badge>
                    </div>
                    {isCompleted && (
                      <Badge className="bg-green-100 text-green-700 border-green-200">
                        ✓ Done
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg">{lesson.title}</CardTitle>
                  <CardDescription>{lesson.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>{lesson.pages.length} pages</span>
                    </div>
                    <Link to={`/lesson/${lesson.id}`}>
                      <Button size="sm" className="gap-2">
                        {isCompleted ? "Review" : "Start"}
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Activities Section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-6 h-6 text-red-500" />
          <h3 className="text-2xl font-semibold text-gray-900">Practice Activities</h3>
          <Badge variant="outline" className="ml-2">{activities.length} Challenges</Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map((activity) => {
            const isCompleted = getActivityCompletion(activity.id);
            return (
              <Card
                key={activity.id}
                className="hover:shadow-lg transition-shadow border-2 hover:border-red-200"
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex gap-2">
                      <Badge className={getDifficultyColor(activity.difficulty)}>
                        {activity.difficulty}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        Week {activity.week}
                      </Badge>
                    </div>
                    {isCompleted && (
                      <Badge className="bg-green-100 text-green-700 border-green-200">
                        ✓ Done
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg">{activity.title}</CardTitle>
                  <CardDescription>{activity.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link to={`/activity/${activity.id}`}>
                    <Button size="sm" className="w-full gap-2" variant="outline">
                      {isCompleted ? "Try Again" : "Start Challenge"}
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}