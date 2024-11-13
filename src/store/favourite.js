// import { getImageByNameAPI } from "../api/file.js";
import {
  fetchFavouritesAPI,
  createFavouriteAPI,
  deleteFavouriteByIdAPI,
  deleteFavouritesAPI,
} from "../api/favourite.js";

const baseApiURL = process.env.REACT_APP_ROOT_API;

const Favourite = {
  state: {
    favourites: [],
  },

  reducers: {
    setFavourites(state, data) {
      state.favourites = data;
      return { ...state };
    },
    setFavourite(state, data) {
      const index = state.favourites.findIndex(({ id }) => id === data.id);
      state.favourites[index] = data;
      return { ...state };
    },
    setProductImage(state, data) {
      const index = state.favourites.findIndex(({ id }) => id === data.id);
      state.favourites[index] = data;
      return { ...state };
    },
  },

  effects: {
    async getFavourites(params) {
      const data = await fetchFavouritesAPI(params);
      this.setFavourites(data.data);

      data.data.map((item) => {
        if (item.product.productImages?.length) {
          item.product.image = `${baseApiURL}/images/${item.product.productImages[0].name}`;
        }
        item.quantity_to_cart = 1;
        this.setProductImage(item);
      });

      return data;
    },
    async createFavourite(payload) {
      return createFavouriteAPI(payload);
    },
    async deleteFavouriteById(productId) {
      return deleteFavouriteByIdAPI(productId);
    },
    async deleteFavourites(payload) {
      return deleteFavouritesAPI(payload);
    },
  },
};

export default Favourite;
