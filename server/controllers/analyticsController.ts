import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import Journal from "../models/Journal";
import Goal from "../models/Goal";
import Roadmap from "../models/Roadmap";
import Resource from "../models/Resource";
import Snippet from "../models/Snippet";

// Helper to calculate streaks
function calculateStreaks(dates: Date[]): {
  currentStreak: number;
  longestStreak: number;
} {
  if (dates.length === 0) return { currentStreak: 0, longestStreak: 0 };

  // Remove duplicate dates (only keep unique calendar days YYYY-MM-DD)
  const uniqueDays = Array.from(
    new Set(dates.map((d) => new Date(d).toDateString())),
  ).map((dString) => new Date(dString));

  // Sort dates descending (today or most recent first)
  uniqueDays.sort((a, b) => b.getTime() - a.getTime());

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Check if user has an entry today or yesterday to continue current streak
  const mostRecentEntry = uniqueDays[0];
  if (mostRecentEntry) {
    const mostRecentDate = new Date(mostRecentEntry);
    mostRecentDate.setHours(0, 0, 0, 0);

    if (
      mostRecentDate.getTime() === today.getTime() ||
      mostRecentDate.getTime() === yesterday.getTime()
    ) {
      // Streak is active
      currentStreak = 1;
      let checkDate = new Date(mostRecentDate);

      for (let i = 1; i < uniqueDays.length; i++) {
        const prevExpected = new Date(checkDate);
        prevExpected.setDate(prevExpected.getDate() - 1);

        const currentEntryDate = new Date(uniqueDays[i]);
        currentEntryDate.setHours(0, 0, 0, 0);

        if (currentEntryDate.getTime() === prevExpected.getTime()) {
          currentStreak++;
          checkDate = currentEntryDate;
        } else if (currentEntryDate.getTime() < prevExpected.getTime()) {
          break; // Gap detected in current streak
        }
      }
    }
  }

  // Calculate longest streak across entire history
  if (uniqueDays.length > 0) {
    tempStreak = 1;
    longestStreak = 1;
    let checkDate = new Date(uniqueDays[0]);
    checkDate.setHours(0, 0, 0, 0);

    for (let i = 1; i < uniqueDays.length; i++) {
      const prevExpected = new Date(checkDate);
      prevExpected.setDate(prevExpected.getDate() - 1);

      const currentEntryDate = new Date(uniqueDays[i]);
      currentEntryDate.setHours(0, 0, 0, 0);

      if (currentEntryDate.getTime() === prevExpected.getTime()) {
        tempStreak++;
        checkDate = currentEntryDate;
      } else {
        if (tempStreak > longestStreak) {
          longestStreak = tempStreak;
        }
        tempStreak = 1;
        checkDate = currentEntryDate;
      }
    }
    if (tempStreak > longestStreak) {
      longestStreak = tempStreak;
    }
  }

  return {
    currentStreak,
    longestStreak: Math.max(currentStreak, longestStreak),
  };
}

export async function getDashboardStats(
  req: AuthenticatedRequest,
  res: Response,
) {
  const userId = req.user?.id;

  try {
    const journalsData = await Journal.find({ userId });
    const goalsData = await Goal.find({ userId });
    const roadmapsData = await Roadmap.find({ userId });
    const resourcesData = await Resource.find({ userId });
    const snippetsData = await Snippet.find({ userId });

    // 1. Core counters
    const totalJournals = journalsData.length;
    const totalGoals = goalsData.length;
    const completedGoals = goalsData.filter(
      (g) => g.status === "completed",
    ).length;
    const completionRate =
      totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

    // 2. Streaks
    const journalDates = journalsData.map((j) => new Date(j.date));
    const { currentStreak, longestStreak } = calculateStreaks(journalDates);

    // 3. Roadmaps average
    const totalRoadmaps = roadmapsData.length;
    const averageRoadmapProgress =
      totalRoadmaps > 0
        ? Math.round(
            roadmapsData.reduce((acc, r) => acc + r.progressPercentage, 0) /
              totalRoadmaps,
          )
        : 0;

    // // 4. Mood distribution (focused, happy, tired, productive, stressed)
    // const moodCounts: { [key: string]: number } = {
    //   focused: 0,
    //   happy: 0,
    //   tired: 0,
    //   productive: 0,
    //   stressed: 0,
    // };
    // journalsData.forEach((j) => {
    //   const mood = j.mood?.toLowerCase();
    //   if (mood && mood in moodCounts) {
    //     moodCounts[mood]++;
    //   } else {
    //     moodCounts.focused++; // default fallback
    //   }
    // });

    // const moodDistribution = Object.keys(moodCounts).map((name) => ({
    //   name: name.charAt(0).toUpperCase() + name.slice(1),
    //   value: moodCounts[name],
    // }));

    // 4. Mood Distribution

    const moodCounts: Record<string, number> = {
      focused: 0,
      happy: 0,
      tired: 0,
      productive: 0,
      stressed: 0,
    };

    journalsData.forEach((journal) => {
      if (!journal.mood) return;

      const mood = journal.mood.trim().toLowerCase();

      if (mood in moodCounts) {
        moodCounts[mood]++;
      }
    });

    const moodDistribution = Object.entries(moodCounts).map(
      ([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value,
      }),
    );

    // // 5. Weekly entry distribution (Mon - Sun)
    // const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    // const weeklyCounts: { [key: string]: number } = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };

    // // Group entries from last 7 days or current week
    // const now = new Date();
    // const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 1)); // Mon
    // startOfWeek.setHours(0, 0, 0, 0);

    // journalsData.forEach(j => {
    //   const entryDate = new Date(j.date);
    //   const dayName = weekDays[entryDate.getDay()];
    //   if (dayName in weeklyCounts) {
    //     weeklyCounts[dayName]++;
    //   }
    // });

    // const weeklyDistribution = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => ({
    //   day,
    //   journals: weeklyCounts[day],
    //   hours: weeklyCounts[day] * 2.5 // Simulated learning hours mapping to intensity
    // }));

    // 5. Weekly Activity (Last 7 Days)

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    console.log("Current Date:", today);

    const weeklyDistribution = [];

    for (let i = 6; i >= 0; i--) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() - i);
      currentDate.setHours(0, 0, 0, 0);

      const nextDate = new Date(currentDate);
      nextDate.setDate(currentDate.getDate() + 1);

      console.log(
        `Checking ${currentDate.toISOString()} -> ${nextDate.toISOString()}`,
      );

      let journalsCount = 0;

      journalsData.forEach((journal) => {
        const journalDate = new Date(journal.date);

        console.log(`Journal: ${journal.title} | ${journalDate.toISOString()}`);

        if (journalDate >= currentDate && journalDate < nextDate) {
          journalsCount++;
          console.log("✔ Counted");
        }
      });

      weeklyDistribution.push({
        day: weekDays[currentDate.getDay()],
        journals: journalsCount,
        hours: journalsCount * 2.5,
      });
    }

    console.log("Weekly Distribution:", weeklyDistribution);

    // 6. Category Distribution
    const categoryCounts: { [key: string]: number } = {};
    resourcesData.forEach((r) => {
      categoryCounts[r.category] = (categoryCounts[r.category] || 0) + 1;
    });

    const categoryDistribution = Object.keys(categoryCounts).map(
      (category) => ({
        category,
        count: categoryCounts[category],
      }),
    );

    // 7. Recent Activities Feed
    const activities: any[] = [];

    journalsData.slice(0, 5).forEach((j) => {
      activities.push({
        id: j._id,
        type: "journal",
        title: `Logged Journal: "${j.title}"`,
        date: j.date,
        meta: j.mood,
      });
    });

    goalsData.slice(0, 5).forEach((g) => {
      if (g.status === "completed") {
        activities.push({
          id: g._id,
          type: "goal",
          title: `Completed Goal: "${g.title}"`,
          date: g.updatedAt || g.createdAt,
          meta: "completed",
        });
      }
    });

    snippetsData.slice(0, 5).forEach((s) => {
      activities.push({
        id: s._id,
        type: "snippet",
        title: `Saved Code Snippet: "${s.title}"`,
        date: s.createdAt,
        meta: s.language,
      });
    });

    activities.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
    const recentActivities = activities.slice(0, 6);

    return res.json({
      success: true,
      data: {
        counters: {
          totalJournals,
          totalGoals,
          completedGoals,
          completionRate,
          currentStreak,
          longestStreak,
          totalRoadmaps,
          averageRoadmapProgress,
          totalResources: resourcesData.length,
          totalSnippets: snippetsData.length,
        },
        moodDistribution,
        weeklyDistribution,
        categoryDistribution,
        recentActivities,
      },
    });
  } catch (error: any) {
    console.error("Analytics Fetch Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to compute analytics.",
      error: error.message,
    });
  }
}
