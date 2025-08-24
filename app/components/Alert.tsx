import { StyleSheet, Text, View } from "react-native";

type Props = {
  message: string;
  type?: "error" | "success" | "info";
};

export default function Alert({ message, type = "info" }: Props) {
  const background =
    type === "error" ? "#fdecea" : type === "success" ? "#e6f4ea" : "#e8f0fe";

  const color =
    type === "error" ? "#d93025" : type === "success" ? "#188038" : "#1a73e8";

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <Text style={[styles.text, { color }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  text: {
    fontSize: 14,
  },
});
