import { ActivityIndicator, StyleSheet } from "react-native";

type SpinnerProps = {
  size?: "small" | "medium" | "large";
  variant?: "primary" | "light" | "dark";
};

const sizeMap = {
  small: "small",
  medium: "large",
  large: "large",
} as const;

const colorMap = {
  primary: "#111",
  light: "#fff",
  dark: "#333",
};

export default function Spinner({
  size = "medium",
  variant = "primary",
}: SpinnerProps) {
  return (
    <ActivityIndicator
      size={sizeMap[size]}
      color={colorMap[variant]}
      style={styles.spinner}
    />
  );
}

const styles = StyleSheet.create({
  spinner: {
    alignSelf: "center",
  },
});
