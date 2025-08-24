// In a separate file like `AxiosClient.ts`
import { getToken } from "@/utils/auth";
import axios from "axios";

const AxiosClient = axios.create({
  baseURL: "http://localhost:8002/api",
});

// Request interceptor to add the auth token
AxiosClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await getToken();

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (err) {
      console.log("Error fetching token:", err);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default AxiosClient;
