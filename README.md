# strapi-hook-magento

This hook allows you to use [Magento 2 Rest API](https://devdocs.magento.com/guides/v2.4/rest/bk-rest.html) with strapi.

## Installation

```bash
# using yarn
yarn add strapi-hook-magento

# using npm
npm install strapi-hook-magento --save
```

## Hook config

To activate and configure the hook, you need to create or update the file `./config/hook.js` in your strapi app.

```js
module.exports = {
  settings: {
    // ...
    magento: {
      enabled: true,
      clients: [
        [
          "v-media.pl",
          {
            url: "https://v-media.pl",
            consumerKey: "",
            consumerSecret: "",
            accessToken: "",
            accessTokenSecret: "",
          },
        ],
      ],
    },
  },
};
```

### Resources

- [MIT License](LICENSE.md)

### Links

- [Strapi website](http://strapi.io/)
- [Strapi community on Slack](http://slack.strapi.io)
- [Strapi news on Twitter](https://twitter.com/strapijs)
