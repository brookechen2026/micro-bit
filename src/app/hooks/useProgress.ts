import { useState, useEffect } from "react";

interface ProgressData {
  completedLessons: string[];
  completedActivities: string[];
}

export function useProgress() {
  const [progress, setProgress] = useState<ProgressData>({
    completedLessons: [],
    completedActivities: [],
  });

  useEffect(() => {
    const saved = localStorage.getItem("microbit-progress");
    if (saved) {
      setProgress(JSON.parse(saved));
    }
  }, []);

  const saveProgress = (newProgress: ProgressData) => {
    setProgress(newProgress);
    localStorage.setItem("microbit-progress", JSON.stringify(newProgress));
  };

  const markLessonComplete = (lessonId: string) => {
    if (!progress.completedLessons.includes(lessonId)) {
      const newProgress = {
        ...progress,
        completedLessons: [...progress.completedLessons, lessonId],
      };
      saveProgress(newProgress);
    }
  };

  const markActivityComplete = (activityId: string) => {
    if (!progress.completedActivities.includes(activityId)) {
      const newProgress = {
        ...progress,
        completedActivities: [...progress.completedActivities, activityId],
      };
      saveProgress(newProgress);
    }
  };

  const getProgress = (lessonId: string) => {
    return progress.completedLessons.includes(lessonId);
  };

  const getActivityCompletion = (activityId: string) => {
    return progress.completedActivities.includes(activityId);
  };

  return {
    markLessonComplete,
    markActivityComplete,
    getProgress,
    getActivityCompletion,
  };
}
