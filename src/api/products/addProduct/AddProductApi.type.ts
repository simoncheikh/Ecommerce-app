export type AddProductApiProps = {
    title: string;
    description: string;
    price: number;
    accessToken: string,
    location: {
        name: string;
        longitude: number;
        latitude: number;
    };
    images: Array<{
        url: string;
        _id: string;
    }>;
};