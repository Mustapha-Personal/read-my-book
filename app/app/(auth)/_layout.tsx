// import { useAuth } from "@/context/AuthContext";
import { Slot } from "expo-router"; //Redirect

export default function AuthLayout() {
  // const { user } = useAuth();

  // if (!user) return <Redirect href="/login" />;

  return <Slot />;
}
