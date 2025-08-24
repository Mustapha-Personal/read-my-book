import { useAuth } from "@/context/AuthContext";
import AxiosClient from "@/services/AxiosClient";
import { useMutation } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";

// ---- Types ----
type RegisterPayload = { name: string; email: string; password: string };
type LoginPayload = { email: string; password: string };

export function useRegister() {
  return useMutation({
    mutationFn: async (payload: RegisterPayload) => {
      const res = await AxiosClient.post("/register", payload);
      return res.data;
    },
  });
}

// export function useLogin() {
//   const { login } = useAuth();

//   return useMutation({
//     mutationFn: async (payload: LoginPayload) => {
//       const res = await AxiosClient.post("/login", payload);
//       return res.data;
//     },
//     onSuccess: async (data) => {
//       try {
//         const { user, token } = data.data;

//         await AsyncStorage.setItem("token", token);
//         await AsyncStorage.setItem("user", JSON.stringify(user));

//         login(user);
//       } catch (error) {
//         console.log("Error saving auth data:", error);
//       }
//     },
//   });
// }

export function useLogin() {
  const { login } = useAuth();

  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const res = await AxiosClient.post("/login", payload);
      return res.data;
    },
    onSuccess: async (data) => {
      try {
        // Handle different response structures
        const responseData = data.data || data;
        const { user, token } = responseData;

        if (!token || !user) {
          throw new Error("Invalid response from server");
        }

        await AsyncStorage.setItem("token", token);
        await AsyncStorage.setItem("user", JSON.stringify(user));

        login(user);
      } catch (error) {
        console.log("Error saving auth data:", error);
        throw error; // Re-throw to trigger onError in component
      }
    },
  });
}
