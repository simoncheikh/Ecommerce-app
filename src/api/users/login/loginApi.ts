import axios from 'axios';
import { LoginApiProps } from './LoginApi.type';
import Config from 'react-native-config';

export const LoginApi = async ({ email, password, tokenExpire }: LoginApiProps) => {
    console.log(Config.REACT_APP_API_URL)
    try {
        const response = await axios.post(`${Config.REACT_APP_API_URL}/api/auth/login`, {
            email,
            password,
            token_expires_in: tokenExpire
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const token = response?.data;
        return token;
    } catch (error) {
        console.error('Login failed:', error);
        return null;
    }
};
