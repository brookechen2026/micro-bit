import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Home } from "./components/Home";
import { LessonView } from "./components/LessonView";
import { ActivityView } from "./components/ActivityView";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "lesson/:lessonId", Component: LessonView },
      { path: "activity/:activityId", Component: ActivityView },
    ],
  },
]);
