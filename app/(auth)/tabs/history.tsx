import AuthenticatedLayout from "@/components/Layout/AuthenticatedLayout";
import { StyleSheet, Text, View } from "react-native";

export default function History() {
  return (
    <AuthenticatedLayout title={`Reading History`}>
      <View style={styles.container}>
        <Text style={styles.subheading}>Your Books</Text>
      </View>
    </AuthenticatedLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#f9f9f9",
  },

  subheading: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
});
