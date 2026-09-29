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

export const SIGNAL_TAG_IDS = [
  "role-change",
  "company-change",
  "website-view",
] as const;

export type TSignalTagId = (typeof SIGNAL_TAG_IDS)[number];

export type TMetricId =
  | "contacts"
  | "companies"
  | "activities"
  | "meetings"
  | "deals"
  | "pipeline";

export const SIGNAL_TEXT_WEIGHTS = ["bold", "semibold"] as const;

export type TSignalTextWeight = (typeof SIGNAL_TEXT_WEIGHTS)[number];

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

export interface ISignalView {
  signal: ISignal;
  user?: IUser;
  tag: ISignalTag;
}
