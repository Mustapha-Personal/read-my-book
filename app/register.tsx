import Alert from "@/components/Alert";
import Button from "@/components/Button";
import Input from "@/components/Input";
import PasswordInput from "@/components/PasswordInput";
import { Link } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function Register() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setError("");
    setLoading(true);

    try {
      // Simulate API call
      await new Promise((res) => setTimeout(res, 1500));

      if (!name || !username || !password) {
        throw new Error("All fields are required");
      }

      // Do actual registration logic here...
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Join ReadMyBook 📚</Text>

      {error ? <Alert message={error} type="error" /> : null}

      <Input
        label="Full Name"
        value={name}
        onChangeText={setName}
        placeholder="Full Name"
      />

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
        label={loading ? "Please wait..." : "Register"}
        onPress={handleRegister}
      />

      <Text style={styles.footerText}>
        Already have an account?{" "}
        <Link href="/login">
          <Text style={styles.link}>Login</Text>
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
