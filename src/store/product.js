import {
  fetchProductsAPI,
  getProductByIdAPI,
  createProductAPI,
  updateProductByIdAPI,
  deleteProductByIdAPI,
} from "../api/product.js";
// import { getImageByNameAPI } from "../api/file.js";

const baseApiURL = process.env.REACT_APP_ROOT_API;

const Product = {
  state: {
    product: {
      productImages: [],
    },
    products: [],
  },

  reducers: {
    setProducts(state, data) {
      state.products = data;
      return { ...state };
    },
    addProducts(state, data) {
      // state.products.push(...data);
      const uniqueProducts = [...state.products, ...data].filter(
        (pro, index, self) =>
          index === self.findIndex(({ id }) => id === pro.id)
      );
      state.products = uniqueProducts;
      return { ...state };
    },
    setProductImage(state, data) {
      const index = state.products.findIndex(({ id }) => id === data.id);
      state.products[index] = data;
      return { ...state };
    },
    setProduct(state, data) {
      state.product = data;
      return { ...state };
    },
    changeFavourite(state, data) {
      state.product.favourite = data;
      return { ...state };
    },
  },

  effects: {
    async getProducts({ isScrollMore, ...params }) {
      const data = await fetchProductsAPI(params);
      // set products to show text content first, because images will take time to load
      if (isScrollMore) {
        this.addProducts(data.data.rows);
      } else {
        this.setProducts(data.data.rows);
      }

      data.data.rows.map((item) => {
        if (item.productImages?.length) {
          // item.image = await getImageByNameAPI(item.productImages[0].name);
          item.image = `${baseApiURL}/images/${item.productImages[0].name}`;
          // re set products again to show with their image
          this.setProductImage(item);
        }
      });

      return data;
    },
    async getProductById({ id, params }) {
      const data = await getProductByIdAPI(id, params);

      if (data.data.productImages?.length) {
        data.data.image = `${baseApiURL}/images/${data.data.productImages[0].name}`;
        data.data.productImages.map((item) => {
          item.image = `${baseApiURL}/images/${item.name}`;
        });
      }

      this.setProduct(data.data);
      return data;
    },
    async createProduct(payload) {
      return createProductAPI(payload);
    },
    async updateProductById({ id, payload }) {
      return updateProductByIdAPI(id, payload);
    },
    async deleteProductById(id) {
      return deleteProductByIdAPI(id);
    },
  },
};

export default Product;
