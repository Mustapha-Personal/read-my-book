import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  // Platform,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";

interface PasswordInputProps extends TextInputProps {
  label?: string;
}

export default function PasswordInput({ label, ...rest }: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View style={styles.passwordContainer}>
        <TextInput
          {...rest}
          secureTextEntry={!showPassword}
          autoCorrect={false}
          autoCapitalize="none"
          style={styles.input}

          // textContentType="password"
          // keyboardType={Platform.OS === "ios" ? "default" : "visible-password"}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons
            name={showPassword ? "eye-off" : "eye"}
            size={22}
            color="#999"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  label: { fontSize: 14, marginBottom: 6, color: "#333" },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    borderColor: "#ddd",
    borderWidth: 1,
    paddingHorizontal: 14,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: "#111",
  },
});
