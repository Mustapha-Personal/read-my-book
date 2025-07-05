import { Image, Pressable, StyleSheet, Text, View } from "react-native";

type BookCardProps = {
  id: string;
  title: string;
  cover: string;
};

export default function BookCard({ id, title, cover }: BookCardProps) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: cover }} style={styles.image} />

      <View style={styles.info}>
        <Text style={styles.title}>{title}</Text>
        {/* <Link href={`/read/${id}`} asChild> */}
        <Pressable>
          <Text style={styles.readLink}>Read Now →</Text>
        </Pressable>
        {/* </Link> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
    alignItems: "center",
    elevation: 1,
  },
  image: {
    width: 50,
    height: 70,
    borderRadius: 6,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  title: {
    fontWeight: "600",
    fontSize: 16,
    marginBottom: 4,
  },
  readLink: {
    color: "#007bff",
    fontWeight: "500",
  },
});
