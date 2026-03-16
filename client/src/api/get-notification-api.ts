import { authFetch, BASE_URL, handleResponse } from "./api-client";

export interface Notification {
  id: number;
  message: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
  user: number;
}

export async function getNotifications(): Promise<Notification[]> {
  const res = await authFetch(`${BASE_URL}/notifications/`);
  return handleResponse<Notification[]>(res);
}

export async function markNotificationRead(id: string | number): Promise<void> {
  const res = await authFetch(`${BASE_URL}/notifications/${id}/`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ is_read: true }),
  });
  return handleResponse<void>(res);
}