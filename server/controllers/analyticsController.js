import Journal from "../models/Journal.js";
import Goal from "../models/Goal.js";
import Roadmap from "../models/Roadmap.js";
import Resource from "../models/Resource.js";
import Snippet from "../models/Snippet.js";
function calculateStreaks(dates) {
  if (dates.length === 0) return { currentStreak: 0, longestStreak: 0 };
  const uniqueDays = Array.from(
    new Set(dates.map((d) => new Date(d).toDateString())),
  ).map((dString) => new Date(dString));
  uniqueDays.sort((a, b) => b.getTime() - a.getTime());
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  const today = /* @__PURE__ */ new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const mostRecentEntry = uniqueDays[0];
  if (mostRecentEntry) {
    const mostRecentDate = new Date(mostRecentEntry);
    mostRecentDate.setHours(0, 0, 0, 0);
    if (
      mostRecentDate.getTime() === today.getTime() ||
      mostRecentDate.getTime() === yesterday.getTime()
    ) {
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
          break;
        }
      }
    }
  }
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
async function getDashboardStats(req, res) {
  const userId = req.user?.id;
  try {
    const journalsData = await Journal.find({ userId });
    const goalsData = await Goal.find({ userId });
    const roadmapsData = await Roadmap.find({ userId });
    const resourcesData = await Resource.find({ userId });
    const snippetsData = await Snippet.find({ userId });
    const totalJournals = journalsData.length;
    const totalGoals = goalsData.length;
    const completedGoals = goalsData.filter(
      (g) => g.status === "completed",
    ).length;
    const completionRate =
      totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;
    const journalDates = journalsData.map((j) => new Date(j.date));
    const { currentStreak, longestStreak } = calculateStreaks(journalDates);
    const totalRoadmaps = roadmapsData.length;
    const averageRoadmapProgress =
      totalRoadmaps > 0
        ? Math.round(
            roadmapsData.reduce((acc, r) => acc + r.progressPercentage, 0) /
              totalRoadmaps,
          )
        : 0;
    const moodCounts = {
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
    const today = /* @__PURE__ */ new Date();
    today.setHours(0, 0, 0, 0);
    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const weeklyDistribution = [];
    for (let i = 6; i >= 0; i--) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() - i);
      const currentKey = currentDate.toLocaleDateString("en-CA");
      let journalsCount = 0;
      journalsData.forEach((journal) => {
        const journalKey = new Date(journal.date).toLocaleDateString("en-CA");
        if (journalKey === currentKey) {
          journalsCount++;
        }
      });
      weeklyDistribution.push({
        day: weekDays[currentDate.getDay()],
        journals: journalsCount,
        hours: journalsCount * 2.5,
      });
    }
    const categoryCounts = {};
    resourcesData.forEach((r) => {
      categoryCounts[r.category] = (categoryCounts[r.category] || 0) + 1;
    });
    const categoryDistribution = Object.keys(categoryCounts).map(
      (category) => ({
        category,
        count: categoryCounts[category],
      }),
    );
    const activities = [];
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
  } catch (error) {
    console.error("Analytics Fetch Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to compute analytics.",
      error: error.message,
    });
  }
}
export { getDashboardStats };
