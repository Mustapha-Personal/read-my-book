import { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { formatDate } from "@/utils/dateFormatter";
import { Book } from "@/types/book";
import { useToggleFavourite } from "@/hooks/useBook";

type BookCardProps = {
  book: Book;
};

export default function BookCard({ book }: BookCardProps) {
  const [isFavourite, setIsFavourite] = useState(book.is_favourite);
  const toggleFavouriteMutation = useToggleFavourite();

  const handleToggleFavourite = async (event: any) => {
    // Prevent the card's onPress from firing
    event.stopPropagation();

    try {
      setIsFavourite(!isFavourite);
      await toggleFavouriteMutation.mutateAsync(book.id);
    } catch (error) {
      setIsFavourite(book.is_favourite);
      console.log("Failed to toggle favourite:", error);
    }
  };

  return (
    <Link href={`/read/${book.id}`} asChild>
      <Pressable style={styles.card}>
        <View style={styles.info}>
          <View style={styles.header}>
            <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
              {book.title}
            </Text>
            <Pressable
              onPress={handleToggleFavourite}
              style={styles.favouriteButton}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={[styles.star, isFavourite && styles.favouriteStar]}>
                {isFavourite ? "★" : "☆"}
              </Text>
            </Pressable>
          </View>

          <View style={styles.footer}>
            {book.last_read_at && (
              <Text style={styles.lastRead}>
                Last read: {formatDate(book.last_read_at)}
              </Text>
            )}

            <Text style={styles.readLink}>Read Now</Text>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  info: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    flex: 1,
    marginRight: 8,
  },
  favouriteButton: {
    padding: 4,
  },
  star: {
    fontSize: 20,
    color: "#ccc",
  },
  favouriteStar: {
    color: "#ffd700", // Gold color for favourite
  },
  readLink: {
    color: "#007bff",
    fontWeight: "500",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  lastRead: {
    fontSize: 12,
    color: "#666",
    fontStyle: "italic",
    flex: 1, // Take available space
    marginRight: 12, // Add some spacing between the text and button
  },
});
