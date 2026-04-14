// types/shared-types.ts
export type ApiActivity = {
  id: number;
  activity_title: string;
  project_leader: string;
  members: string[];
  activity_duration_hours: number;
  activity_date: string | null;
};

export type ApiActivityListResponse = {
  id: number;
  project_title: string;
  activities: ApiActivity[];
};