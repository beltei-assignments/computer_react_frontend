import { getImageByNameAPI } from "../api/file.js";
import {
  fetchOrdersAPI,
  updateOrderByIdAPI,
  deleteOrderByIdAPI,
} from "../api/order.js";

const Order = {
  state: {
    orders: [],
  },

  reducers: {
    setOrders(state, data) {
      state.orders = data;
      return { ...state };
    },
    setProductImage(state, data) {
      const index = state.orders.findIndex(({ id }) => id === data.id);
      state.orders[index] = data;
      return { ...state };
    },
  },

  effects: {
    async getOrders(params) {
      const data = await fetchOrdersAPI(params);
      this.setOrders(data.data);

      data.data.map(async (order) => {
        order.created_at = new Date(order.created_at).toLocaleDateString(
          "en-US",
          {
            year: "numeric",
            month: "short",
            day: "numeric",
          }
        );

        const estimateDate1 = new Date(order.created_at);
        estimateDate1.setDate(estimateDate1.getDate() + 1);
        const resultEstimateDate1 = estimateDate1.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });

        const estimateDate2 = new Date(order.created_at);
        estimateDate2.setDate(estimateDate2.getDate() + 3);
        const resultEstimateDate2 = estimateDate2.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });

        order.estimate_time = `${resultEstimateDate1} - ${resultEstimateDate2}`

        order.orderProducts.map(async ({ product }) => {
          if (product.productImages?.length) {
            product.image = await getImageByNameAPI(
              product.productImages[0].name
            );
            // re set products again to show with their image
            this.setProductImage(order);
          }
        });
      });

      return data;
    },
    async updateOrderById({ id, payload }) {
      return updateOrderByIdAPI(id, payload);
    },
    async deleteOrderById(id) {
      return deleteOrderByIdAPI(id);
    },
  },
};

export default Order;
