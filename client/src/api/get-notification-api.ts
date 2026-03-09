import { authFetch, BASE_URL, handleResponse } from "./implementor-api";

export async function getNotifications(): Promise<any> {
  const res = await authFetch(`${BASE_URL}/admin/notifications/`)
  return handleResponse<any>(res);
}