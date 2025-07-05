import { Pressable, StyleSheet, Text, ViewStyle } from "react-native";

interface Props {
  label: string;
  onPress: () => void;
  variant?: "primary" | "outline";
  style?: ViewStyle;
}

export default function Button({
  label,
  onPress,
  variant = "primary",
  style,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.base,
        variant === "primary" ? styles.primary : styles.outline,
        style,
      ]}
    >
      <Text
        style={variant === "primary" ? styles.primaryText : styles.outlineText}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  primary: {
    backgroundColor: "#111",
  },
  primaryText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  outline: {
    borderWidth: 2,
    borderColor: "#111",
  },
  outlineText: {
    color: "#111",
    fontWeight: "600",
    fontSize: 16,
  },
});
