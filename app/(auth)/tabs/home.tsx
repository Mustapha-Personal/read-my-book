import BookCard from "@/components/Book/Card";
import AuthenticatedLayout from "@/components/Layout/AuthenticatedLayout";
import { useAuth } from "@/context/AuthContext";
import { Link } from "expo-router";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

const mockBooks = [
  {
    id: "1",
    title: "The Power of Now",
    cover: "https://covers.openlibrary.org/b/id/11153223-L.jpg",
  },
  {
    id: "2",
    title: "Atomic Habits",
    cover: "https://covers.openlibrary.org/b/id/10532453-L.jpg",
  },
  {
    id: "3",
    title: "Atomic Habits",
    cover: "https://covers.openlibrary.org/b/id/10532453-L.jpg",
  },
  {
    id: "4",
    title: "Atomic Habits",
    cover: "https://covers.openlibrary.org/b/id/10532453-L.jpg",
  },
  {
    id: "5",
    title: "Atomic Habits",
    cover: "https://covers.openlibrary.org/b/id/10532453-L.jpg",
  },
  {
    id: "6",
    title: "Atomic Habits",
    cover: "https://covers.openlibrary.org/b/id/10532453-L.jpg",
  },
  {
    id: "7",
    title: "Atomic Habits",
    cover: "https://covers.openlibrary.org/b/id/10532453-L.jpg",
  },
  {
    id: "8",
    title: "Atomic Habits",
    cover: "https://covers.openlibrary.org/b/id/10532453-L.jpg",
  },
  {
    id: "9",
    title: "Atomic Habits",
    cover: "https://covers.openlibrary.org/b/id/10532453-L.jpg",
  },
  {
    id: "10",
    title: "Atomic Habits",
    cover: "https://covers.openlibrary.org/b/id/10532453-L.jpg",
  },
  {
    id: "11",
    title: "Atomic Habits",
    cover: "https://covers.openlibrary.org/b/id/10532453-L.jpg",
  },
];

export default function Home() {
  const { user } = useAuth();

  return (
    <AuthenticatedLayout title={`Hello, ${user?.name} 👋`}>
      <View style={styles.container}>
        <Pressable style={styles.uploadButton}>
          {" "}
          <Link href="/(auth)/tabs/upload" asChild>
            <Text style={styles.uploadText}>+ Upload New Book</Text>
          </Link>
        </Pressable>

        <Text style={styles.subheading}>Your Books</Text>

        <FlatList
          data={mockBooks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <BookCard id={item.id} title={item.title} cover={item.cover} />
          )}
          ListEmptyComponent={
            <Text style={{ textAlign: "center", marginTop: 30, color: "#777" }}>
              No books yet.
            </Text>
          }
        />
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
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 16,
  },
  uploadButton: {
    backgroundColor: "#111",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 10,
    width: "100%",
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
