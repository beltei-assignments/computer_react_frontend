// import { getImageByNameAPI } from "../api/file.js";
import {
  fetchCartsAPI,
  createCartAPI,
  updateCartByIdAPI,
  deleteCartByIdAPI,
} from "../api/cart.js";

const baseApiURL = process.env.REACT_APP_ROOT_API;

const Cart = {
  state: {
    carts: [],
  },

  reducers: {
    setCarts(state, data) {
      state.carts = data;
      return { ...state };
    },
    setProductImage(state, data) {
      const index = state.carts.findIndex(({ id }) => id === data.id);
      state.carts[index] = data;
      return { ...state };
    },
    setQuantity(state, data) {
      const index = state.carts.findIndex(({ id }) => id === data.id);
      state.carts[index] = data;
      return { ...state };
    },
  },

  effects: {
    async getCarts(params) {
      const data = await fetchCartsAPI(params);
      this.setCarts(data.data);

      data.data.map((item) => {
        if (item.product.productImages?.length) {
          item.product.image = `${baseApiURL}/images/${item.product.productImages[0].name}`;
          this.setProductImage(item);
        }
      });

      return data;
    },
    async createCart(payload) {
      return createCartAPI(payload);
    },
    async updateCartById({ id, payload }) {
      return updateCartByIdAPI(id, payload);
    },
    async deleteCartById(id) {
      return deleteCartByIdAPI(id);
    },
  },
};

export default Cart;
