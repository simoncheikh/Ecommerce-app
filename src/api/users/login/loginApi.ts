import axios from 'axios';
import { API_BASE_URL } from '../../../constants/apiConfig';
import { LoginApiProps } from './LoginApi.type';

export const LoginApi = async ({ email, password, tokenExpire }: LoginApiProps) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
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
