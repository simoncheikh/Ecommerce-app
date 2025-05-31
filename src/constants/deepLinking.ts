export const linking = {
  prefixes: ['myappsimonecommerce://', 'https://myappsimonecommerce.com'],
  config: {
    screens: {
      LandingPage: 'landing',
      AuthStack: {
        screens: {
          HomeTabs: {
            screens: {
              Home: 'home',
              Profile: 'profile',
              ProductDetails: 'productdetails/:productId',
              Settings: 'settings',
              'My Cart': 'cart',
            },
          },
        },
      },
    },
  },
};
