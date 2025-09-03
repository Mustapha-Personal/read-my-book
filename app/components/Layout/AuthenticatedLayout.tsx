import { ReactNode } from "react";
import { StyleSheet, View, Text } from "react-native";
import Header from "./Header";

type Props = {
  title?: string;
  children?: ReactNode;
};

export default function AuthenticatedLayout({ title, children }: Props) {
  const renderChildren =
    typeof children === "string" ? <Text>{children}</Text> : children;

  return (
    <View style={styles.container}>
      <Header title={title ?? ""} />
      <View style={styles.content}>{renderChildren}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9" },
  content: { flex: 1 },
});
