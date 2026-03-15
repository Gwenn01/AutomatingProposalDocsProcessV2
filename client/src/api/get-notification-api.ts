import { authFetch, BASE_URL, handleResponse } from "./api-client";
export interface Notification {
  id: number;
  message: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;  // ← add this
  user: number;         // ← add this
}

export async function getNotifications(): Promise<any> {
  const res = await authFetch(`${BASE_URL}/notifications/`)
  return handleResponse<any>(res);
}