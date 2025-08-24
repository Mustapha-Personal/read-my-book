import Alert from "@/components/Alert";
import Button from "@/components/Button";
import Input from "@/components/Input";
import PasswordInput from "@/components/PasswordInput";
import { useLogin } from "@/hooks/useAuth";
import { Link, router } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validationError, setValidationError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const loginMutation = useLogin();
  const { mutate: login, error } = loginMutation;

  const handleLogin = () => {
    setValidationError("");
    setIsLoading(true);

    if (!email || !password) {
      setValidationError("All fields are required");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setValidationError("Please enter a valid email address");
      return;
    }

    login(
      { email, password },
      {
        onSuccess: async (data) => {
          try {
            router.replace("/(auth)/tabs/home");
          } catch (error) {
            console.log("Error handling login success:", error);
          }
        },
        onError: (error) => {
          console.log("Login failed:", error);
        },
      }
    );

    setIsLoading(false);
  };

  const displayError =
    validationError || error?.response?.data?.message || error?.message;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login to ReadMyBook 📚</Text>

      {displayError ? <Alert message={displayError} type="error" /> : null}

      <Input
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        editable={!isLoading}
      />

      <PasswordInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        editable={!isLoading}
      />

      <Button
        label={isLoading ? "Please wait..." : "Login"}
        onPress={handleLogin}
        disabled={isLoading}
      />

      <Text style={styles.footerText}>
        Don&rsquo;t have an account?{" "}
        <Link href="/register" style={styles.link}>
          Register
        </Link>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#f9f9f9",
    justifyContent: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#111",
    marginBottom: 32,
    textAlign: "center",
  },
  footerText: {
    marginTop: 24,
    textAlign: "center",
    color: "#555",
  },
  link: {
    color: "#007bff",
    fontWeight: "600",
  },
});
