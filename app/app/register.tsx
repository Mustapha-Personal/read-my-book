import Alert from "@/components/Alert";
import Button from "@/components/Button";
import Input from "@/components/Input";
import PasswordInput from "@/components/PasswordInput";
import { Link, router } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useRegister } from "@/hooks/useAuth";
import { useAuth } from "@/context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState("");
  const { login } = useAuth();

  const registerMutation = useRegister();
  const { mutate: register, error } = registerMutation;

  const handleRegister = () => {
    // Clear previous errors
    setValidationError("");
    setIsLoading(true);

    // Validation
    if (!name || !email || !password) {
      setValidationError("All fields are required");
      return;
    }

    if (password.length < 6) {
      setValidationError("Password must be at least 6 characters");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setValidationError("Please enter a valid email address");
      return;
    }

    // Call the mutation
    register(
      { name, email, password },
      {
        onSuccess: async (data) => {
          try {
            console.log("Registration successful:", data);

            const { user, token } = data.data || data;

            if (token && user) {
              await AsyncStorage.setItem("token", token);
              await AsyncStorage.setItem("user", JSON.stringify(user));
              login(user);

              router.replace("/(auth)/tabs/home");
            } else {
              router.replace("/login");
            }
          } catch (error) {
            console.log("Error handling registration success:", error);
            router.replace("/login");
          }
        },
        onError: (error) => {
          console.log("Registration failed:", error);
        },
      }
    );

    setIsLoading(false);
  };

  // Combine API errors with validation errors
  const displayError = validationError || error?.response?.data?.message;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Join ReadMyBook 📚</Text>

      {displayError ? <Alert message={displayError} type="error" /> : null}

      <Input
        label="Full Name"
        value={name}
        onChangeText={setName}
        placeholder="Full Name"
        editable={!isLoading}
      />

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
        label={isLoading ? "Please wait..." : "Register"}
        onPress={handleRegister}
        disabled={isLoading}
      />

      <Text style={styles.footerText}>
        Already have an account?{" "}
        <Link href="/login" style={styles.link}>
          Login
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
