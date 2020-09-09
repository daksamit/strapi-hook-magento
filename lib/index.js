"use strict";

const Magento2RestClient = require("magento2-rest-client");
const { restApi } = require("./restApi");

/**
 * Magento2 Hook
 */

module.exports = (strapi) => {
  return {
    /**
     * Default options
     * This object is merged to strapi.config.hook.settings.allegro
     */
    defaults: {},

    /**
     * Initialize the hook
     */
    async initialize() {
      const config = {
        ...this.defaults,
        ...strapi.config.hook.settings.magento,
      };

      strapi.hook.magento.clients = new Map(config.clients);
    },

    rest(name, storeCode) {
      const clients = strapi.hook.magento.clients;
      try {
        const endpoint = !!storeCode
          ? `${clients.get(name).url}/rest/${storeCode}`
          : `${clients.get(name).url}/rest`;
        let clientConfig = {
          ...clients.get(name),
          url: endpoint,
        };
        const client = Magento2RestClient.Magento2Client(clientConfig);
        if (client) return restApi(client);
        else {
          throw {
            code: "CLIENT_MISSING",
            message: `nie można pobrać klienta dla magento: ${name}`,
          };
        }
      } catch (err) {
        strapi.log.error(
          "nie można wykonać operacji związanych z magento rest api",
          err
        );
      }
    },
  };
};
