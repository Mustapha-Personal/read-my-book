import BookCard from "@/components/Book/Card";
import AuthenticatedLayout from "@/components/Layout/AuthenticatedLayout";
import Spinner from "@/components/Spinner";
import { useBooks } from "@/hooks/useBook";
import { useDebounce } from "@/hooks/useDebounce";
import { useCallback, useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function History() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFavorites, setShowFavorites] = useState(false);
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const { data: recentBooks, isLoading } = useBooks({
    limit: 50,
    search: debouncedSearchQuery,
    is_favourite: showFavorites || undefined,
  });

  const toggleFavorites = useCallback(() => {
    setShowFavorites((prev) => !prev);
  }, []);

  return (
    <AuthenticatedLayout title={`Reading History`}>
      <View style={styles.container}>
        <Text style={styles.subheading}>Your Books</Text>

        <View style={styles.controls}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search books..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            clearButtonMode="while-editing"
          />

          <Pressable
            style={[
              styles.filterButton,
              showFavorites && styles.filterButtonActive,
            ]}
            onPress={toggleFavorites}
          >
            <Text
              style={[
                styles.filterText,
                showFavorites && styles.filterTextActive,
              ]}
            >
              {showFavorites ? "★ All Books" : "☆ Favorites Only"}
            </Text>
          </Pressable>
        </View>

        {isLoading ? (
          <Spinner size="large" />
        ) : (
          <FlatList
            data={recentBooks}
            keyExtractor={(book) => book.id.toString()} // Convert id to string
            renderItem={({ item }) => <BookCard book={item} />} // Pass the entire book object
            ListEmptyComponent={
              <Text
                style={{ textAlign: "center", marginTop: 30, color: "#777" }}
              >
                No books uploaded yet.
              </Text>
            }
          />
        )}
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

  controls: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  filterButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  filterButtonActive: {
    backgroundColor: "#ffd700",
    borderColor: "#ffd700",
  },
  filterText: {
    color: "#666",
    fontWeight: "500",
  },
  filterTextActive: {
    color: "#000",
    fontWeight: "600",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 30,
    color: "#777",
    fontSize: 16,
  },
});
