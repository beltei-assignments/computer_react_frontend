import http from ".";

export async function checkoutPaymentAPI(payload) {
  const res = await http.post("/payments/checkout", payload);
  window.location.href = res.url;
}
