import { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import Header from "./Header";

type Props = {
  title: string;
  children: ReactNode;
};

export default function AuthenticatedLayout({ title, children }: Props) {
  return (
    <View style={styles.container}>
      <Header title={title} />
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9" },
  content: { flex: 1 },
});
