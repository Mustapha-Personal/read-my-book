// utils/auth.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

export async function getToken() {
  try {
    return await AsyncStorage.getItem("token");
  } catch (error) {
    console.log("Error fetching token:", error);
    return null;
  }
}
