export type HomeTabsParamList = {
  Home: undefined;
  Profile: undefined;
  ProductDetails: { productId: string };
  'My Cart': undefined;
  Settings: undefined;
  EditProfile: undefined;
  AddProduct: undefined;
  EditProduct: undefined;
};

export type AuthStackParamList = {
  HomeTabs: {
    screen: keyof HomeTabsParamList;
    params?: HomeTabsParamList[keyof HomeTabsParamList];
  };
  Map: undefined;
};

export type RootStackParamList = {
  LandingPage: undefined;
  AuthStack: {
    screen: keyof AuthStackParamList;
    params?: AuthStackParamList[keyof AuthStackParamList];
  };
  UnAuthStack: undefined;
};
