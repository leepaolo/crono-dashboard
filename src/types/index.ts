export interface INavItem {
  id: string;
  label: string;
  icon: string;
  active?: boolean;
  badge?: string;
  expandable?: boolean;
}

export interface ITrialBannerData {
  active: boolean;
  message: string;
  action: string;
}

export type TTaskId =
  | "overdue"
  | "pending-manual"
  | "pending-auto"
  | "completed";

export type TSignalTagId = "role-change" | "company-change" | "website-view";

export type TMetricId =
  | "contacts"
  | "companies"
  | "activities"
  | "meetings"
  | "deals"
  | "pipeline";

export type TSignalTextWeight = "bold" | "semibold";

export interface ITaskStat {
  id: TTaskId;
  label: string;
  count: number;
  chevron: boolean;
  error?: string;
}

export interface ISidebarUser {
  name: string;
  role: string;
  avatar: string;
}

export interface IUser {
  id: string;
  name: string;
  role: string;
}

export interface ISignalTag {
  id: TSignalTagId;
  label: string;
}

export interface ISignalSegment {
  text: string;
  weight: TSignalTextWeight;
  highlight?: boolean;
}

export interface IMetric {
  id: TMetricId;
  label: string;
  value: number;
  target: number;
  valueLabel: string;
  targetLabel: string;
  icon?: string;
  info?: boolean;
}

export interface IOnboardingStepData {
  id: string;
  title: string;
  duration: string;
  icon: string;
}

export interface ISignal {
  id: string;
  userId?: string;
  avatar: string;
  segments: ISignalSegment[];
  tagId: TSignalTagId;
  inSequence: boolean;
  date: string;
  unread: boolean;
}
