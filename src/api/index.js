import axios from 'axios';
import queryString from 'query-string';

const baseURL = "https://tazagroup.vn/api/index.php/v1/hrms"
const token = "c2hhMjU2OjcyOmUzNGExYmY5YTViZGRhMzE4OWFkYTgzZDIyMDM3ZWY3MWQ5NjRkNzM1NWU0MjE5NGE3NmE1NmYwYjIwMWNkZTM="
const axiosClient = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    },
    paramsSerializer: (params) => queryString.stringify(params),
});

axiosClient.interceptors.request.use(async (config) => {
    return config;
});

axiosClient.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        return error
    }
);

export default axiosClient;