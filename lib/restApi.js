const matchCriteria = (field, value, condition) =>
  `searchCriteria[filter_groups][0][filters][0][field]=${field}` +
  `&searchCriteria[filter_groups][0][filters][0][value]=${value}` +
  `&searchCriteria[filter_groups][0][filters][0][condition_type]=${condition}`;

module.exports.restApi = (client) => {
  client.addMethods("request", (restClient) => ({
    get: (uri) => restClient.get(uri),
    post: (uri, data) => restClient.post(uri, data),
    put: (uri, data) => restClient.put(uri, data),
    delete: (uri) => restClient.delete(uri),
  }));

  const methods = {
    /*
      links:
      - https://devdocs.magento.com/swagger/index_23.html
      - https://devdocs.magento.com/guides/v2.3/rest/list.html
      - https://github.com/DivanteLtd/magento2-rest-client
    */

    request: {
      get: (endpoint) => client.request.get(endpoint),
      post: (endpoint, data) => client.request.post(endpoint, data),
      put: (endpoint, data) => client.request.put(endpoint, data),
      delete: (endpoint) => client.request.delete(endpoint),
    },

    stock: {
      // getLowStock: () => client, // TODO: fix cause not working
    },

    products: {
      getAll: () => client.request.get("/products?searchCriteria="),
      get: (sku) => client.request.get(`/products/${sku}`),
      create: (data) => client.request.post(`/products`, data),
      update: (sku, data) => client.request.put(`/products/${sku}`, data),
      delete: (id) => client.request.delete(`/products/${id}`),
      getById: async (id) => {
        const result = await client.request.get(
          `/products?${matchCriteria("entity_id", id, "eq")}`
        );
        return result.items[0];
      },
      getMedia: (sku) => client.request.get(`/products/${sku}/media`),
      updateQty: (sku, qty) =>
        client.request.put(`/products/${sku}`, {
          product: {
            extension_attributes: { stock_item: { qty, is_in_stock: qty > 0 } },
          },
        }),
      updatePrice: (sku, price) =>
        client.request.put(`/products/${sku}`, { product: { price } }),
      uploadImage: (sku, entry) => {
        return client.request.post("/products/" + sku + "/media", {
          entry: Object.assign(
            {
              media_type: "image",
              label: "Image",
              position: 1,
              disabled: false,
              types: ["image", "small_image", "swatch_image", "thumbnail"],
              content: {
                type: "image/jpeg",
              },
            },
            entry
          ),
        });
      },
    },

    cart: {
      create: () => client.cart.create(),
      update: (...args) => client.cart.update(...args), // { cartItem: cartItem }
      addressInformation: (...args) => client.cart.shippingInformation(...args),
      // paymentInformation: (...args) => client.cart.paymentInformationAndOrder(...args),
      guestShippingMethods: (cartId) =>
        client.request.get(`/guest-carts/${cartId}/shipping-methods`),
      order: (...args) => client.cart.order(...args),
    },

    orders: {
      get: (id) => client.request.get(`/orders/${id}`),
      addComment: (id, commentBody) =>
        client.request.post(`/orders/${id}/comments`, {
          statusHistory: commentBody,
        }),
    },
  };

  return methods;
};
