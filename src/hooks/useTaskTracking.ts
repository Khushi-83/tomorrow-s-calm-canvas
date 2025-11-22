import { useState, useEffect } from "react";
import { Task } from "@/components/TaskCard";

interface CompletionData {
  [date: string]: number; // date -> count of completed tasks
}

export const useTaskTracking = (routineTasks: Task[], tomorrowTasks: Task[]) => {
  const [completionData, setCompletionData] = useState<CompletionData>({});

  // Load completion data from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("taskCompletionData");
    if (stored) {
      try {
        setCompletionData(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse completion data:", e);
      }
    }
  }, []);

  // Save completion data to localStorage
  useEffect(() => {
    localStorage.setItem("taskCompletionData", JSON.stringify(completionData));
  }, [completionData]);

  // Track task completions
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const allTasks = [...routineTasks, ...tomorrowTasks];
    const completedCount = allTasks.filter(task => task.completed).length;
    
    // Update today's completion count
    setCompletionData(prev => ({
      ...prev,
      [today]: completedCount,
    }));
  }, [routineTasks, tomorrowTasks]);

  const getTodayStats = () => {
    const allTasks = [...routineTasks, ...tomorrowTasks];
    const completedToday = allTasks.filter(task => task.completed).length;
    const totalToday = allTasks.length;
    
    return { completedToday, totalToday };
  };

  return { completionData, getTodayStats };
};
