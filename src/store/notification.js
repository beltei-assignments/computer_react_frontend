import {
  fetchNotificationsAPI,
  updateNotificationByIdAPI,
} from "../api//notification.js";

const Notification = {
  state: {
    notofications: [],
  },

  reducers: {
    setNotifications(state, data) {
      state.notofications = data;
      return { ...state };
    },
  },

  effects: {
    async fetchNotifications() {
      const data = await fetchNotificationsAPI();
      this.setNotifications(data.data);
      return data;
    },
    // async createAddress(payload) {
    //   return createAddressAPI(payload);
    // },
    async updateNotificationById({ id, payload }) {
      return updateNotificationByIdAPI(id, payload);
    },
    // async deleteAddressById(id) {
    //   return deleteAddressByIdAPI(id);
    // },
  },
};

export default Notification;
