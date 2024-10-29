import http from ".";

export async function fetchNotificationsAPI(params) {
  return http.get("/notifications", { params });
}

export async function updateNotificationByIdAPI(id, payload) {
  return http.put(`/notifications/${id}`, payload);
}

export async function deleteNotificationByIdAPI(id) {
  return http.delete(`/notifications/${id}`);
}
