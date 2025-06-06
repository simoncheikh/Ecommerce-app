export type Product = {
  _id: string;
  title: string;
  description: string;
  price: number;
  images: { url: string; _id: string }[];
  location: { longitude: number, latitude: number }
  user: {
    email: any; _id: string
  }
};
