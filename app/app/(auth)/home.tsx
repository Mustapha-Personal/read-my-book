import BookCard from "@/components/Book/Card";
import { useAuth } from "@/context/AuthContext";
import { useBooks } from "@/hooks/useBook";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function Home() {
  const { user, logout } = useAuth();
  const { data: recentBooks, isLoading } = useBooks({ limit: 10 });

  console.log("recentBooksssss", recentBooks);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome back, {user?.name} 👋</Text>

      <Pressable style={styles.uploadButton}>
        {" "}
        {/* <Link href="/upload"> */}
        <Text style={styles.uploadText}>+ Upload New Book</Text>
        {/* </Link> */}
      </Pressable>

      <Text style={styles.subheading}>Your Books</Text>

      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={recentBooks}
          keyExtractor={(book) => book.id.toString()} // Convert id to string
          renderItem={({ item }) => <BookCard book={item} />} // Pass the entire book object
          ListEmptyComponent={
            <Text style={{ textAlign: "center", marginTop: 30, color: "#777" }}>
              No books uploaded yet.
            </Text>
          }
        />
      )}

      <Pressable onPress={logout} style={styles.logout}>
        <Text style={{ color: "#777", textAlign: "center" }}>Logout</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 48,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 16,
  },
  uploadButton: {
    backgroundColor: "#111",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 24,
    alignSelf: "flex-start",
  },
  uploadText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
  subheading: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  bookCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
    alignItems: "center",
    elevation: 1,
  },
  bookImage: {
    width: 50,
    height: 70,
    borderRadius: 6,
    marginRight: 12,
  },
  bookInfo: {
    flex: 1,
  },
  bookTitle: {
    fontWeight: "600",
    fontSize: 16,
    marginBottom: 4,
  },
  readLink: {
    color: "#007bff",
    fontWeight: "500",
  },
  logout: {
    marginTop: 20,
  },
});
