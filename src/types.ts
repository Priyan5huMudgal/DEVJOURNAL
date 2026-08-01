export interface UserPreferences {
  theme: string;
  notifications: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  preferences: UserPreferences;
}

export interface JournalCodeSnippet {
  language: string;
  code: string;
  title?: string;
}

export interface JournalEntry {
  _id: string;
  title: string;
  content: string;
  mood: string;
  date: string;
  tags: string[];
  images: string[];
  codeSnippets: JournalCodeSnippet[];
  createdAt: string;
  updatedAt: string;
}

export interface Goal {
  _id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly';
  priority: 'low' | 'medium' | 'high';
  deadline?: string;
  status: 'todo' | 'in-progress' | 'completed';
  progress: number;
  createdAt: string;
  updatedAt: string;
}

export interface RoadmapTopic {
  name: string;
  status: 'todo' | 'in-progress' | 'completed';
  order: number;
}

export interface Roadmap {
  _id: string;
  title: string;
  topics: RoadmapTopic[];
  progressPercentage: number;
  estimatedCompletion?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LearningResource {
  _id: string;
  title: string;
  url: string;
  category: string;
  isFavorite: boolean;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface CodeSnippet {
  _id: string;
  title: string;
  language: string;
  description: string;
  code: string;
  tags: string[];
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardCounters {
  totalJournals: number;
  totalGoals: number;
  completedGoals: number;
  completionRate: number;
  currentStreak: number;
  longestStreak: number;
  totalRoadmaps: number;
  averageRoadmapProgress: number;
  totalResources: number;
  totalSnippets: number;
}

export interface MoodDistributionItem {
  name: string;
  value: number;
}

export interface WeeklyDistributionItem {
  day: string;
  journals: number;
  hours: number;
}

export interface CategoryDistributionItem {
  category: string;
  count: number;
}

export interface RecentActivityItem {
  id: string;
  type: 'journal' | 'goal' | 'snippet';
  title: string;
  date: string;
  meta: string;
}

export interface DashboardStats {
  counters: DashboardCounters;
  moodDistribution: MoodDistributionItem[];
  weeklyDistribution: WeeklyDistributionItem[];
  categoryDistribution: CategoryDistributionItem[];
  recentActivities: RecentActivityItem[];
}
