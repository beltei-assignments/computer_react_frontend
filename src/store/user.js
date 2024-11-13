import {
  fetchUserAPI,
  loginAPI,
  registerAPI,
  updateUserAPI,
  verifyResetPasswordAPI,
  resetPasswordAPI,
  sendRequestResetPasswordAPI,
} from "../api/auth.js";

const User = {
  state: {
    user: {},
    token: null,
    canSeeMenu: false,
    items_in_cart: 0,
    number_of_orders: 0,
    number_of_notifications: 0,
    number_of_favourites: 0,
  },

  reducers: {
    setUser(state, data) {
      state.user = data;
      return { ...state };
    },
    setToken(state, data) {
      state.token = data;
      return { ...state };
    },
    setCanSeeMenu(state, data) {
      state.canSeeMenu = data;
      return { ...state };
    },
    setItemsInCart(state, data) {
      state.items_in_cart = data;
      return { ...state };
    },
    setNumberOfOrders(state, data) {
      state.number_of_orders = data;
      return { ...state };
    },
    setNumberOfNotifications(state, data) {
      state.number_of_notifications = data;
      return { ...state };
    },
    setNumberOfFavourites(state, data) {
      state.number_of_favourites = data;
      return { ...state };
    },
  },

  effects: {
    async fetchUser() {
      const {
        user,
        can_see_menus,
        items_in_cart,
        number_of_orders,
        number_of_notifications,
        number_of_favourites,
      } = await fetchUserAPI();
      this.setUser(user);
      this.setCanSeeMenu(can_see_menus);
      this.setItemsInCart(items_in_cart);
      this.setNumberOfOrders(number_of_orders);
      this.setNumberOfNotifications(number_of_notifications);
      this.setNumberOfFavourites(number_of_favourites);
    },
    async login(payload) {
      const data = await loginAPI(payload);
      const { user, token, can_see_menus } = data;
      this.setUser(user);
      this.setToken(token);
      this.setCanSeeMenu(can_see_menus);
      localStorage.setItem("token", token);

      return data;
    },
    async register(payload) {
      return registerAPI(payload);
    },
    async updateUser(payload) {
      return updateUserAPI(payload);
    },
    async verifyResetPassword(params) {
      return verifyResetPasswordAPI(params);
    },
    async sendRequestResetPassword(payload) {
      return sendRequestResetPasswordAPI(payload);
    },
    async resetPassword(payload) {
      return resetPasswordAPI(payload);
    },
    logout() {
      localStorage.removeItem("token");
      this.setUser({});
      this.setToken(null);
      this.setCanSeeMenu(false);
      this.setItemsInCart(0);
      this.setNumberOfOrders(0);
      this.setNumberOfNotifications(0);
      this.setNumberOfFavourites(0);
    },
  },
};

export default User;
