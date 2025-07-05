import Alert from "@/components/Alert";
import Button from "@/components/Button";
import Input from "@/components/Input";
import PasswordInput from "@/components/PasswordInput";
import { useAuth } from "@/context/AuthContext";
import { Link, router } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      if (!username || !password) {
        throw new Error("All fields are required");
      }

      await new Promise((res) => setTimeout(res, 1000));

      const loggedInUser = {
        id: Date.now().toString(),
        name: "Tijani",
        username: username.trim(),
      };

      login(loggedInUser);

      router.replace("/(auth)/tabs/home");
    } catch (e: any) {
      setError(e.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login to ReadMyBook 📚</Text>

      {error ? <Alert message={error} type="error" /> : null}

      <Input
        label="Username"
        value={username}
        onChangeText={setUsername}
        placeholder="Username"
        autoCapitalize="none"
      />

      <PasswordInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
      />

      <Button
        label={loading ? "Please wait..." : "Login"}
        onPress={handleLogin}
      />

      <Text style={styles.footerText}>
        Don't have an account?{" "}
        <Link href="/register">
          <Text style={styles.link}>Register</Text>
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
  passwordWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
});
