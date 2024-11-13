import http from ".";

export async function fetchFavouritesAPI(params) {
  return http.get("/favourites", { params });
}

export async function createFavouriteAPI(payload) {
  return http.post("/favourites", payload);
}

export async function updateFavouriteByIdAPI(id, payload) {
  return http.put(`/favourites/${id}`, payload);
}

export async function deleteFavouriteByIdAPI(productId) {
  return http.delete(`/favourites/${productId}`);
}

export async function deleteFavouritesAPI(payload) {
  return http.delete("/favourites", { data: payload });
}
