// import { useBookStore } from "@/store/bookStore";
import * as FileSystem from "expo-file-system";
import { useLocalSearchParams } from "expo-router";
import * as Speech from "expo-speech";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

export default function ReadScreen() {
  const { id } = useLocalSearchParams();
  const book = {}; //useBookStore((state) => state.getBook(id as string));
  const [text, setText] = useState("");
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    if (!book) return;

    const loadText = async () => {
      if (book.type.includes("image")) {
        setText("Reading from image not supported yet.");
      } else if (book.type.includes("pdf")) {
        setText("Reading from PDF not supported in-app yet. Simulating...");
        // Later, you can extract PDF text using pdf-lib or via backend
      } else if (book.type.includes("word")) {
        setText("Reading from Word not supported in-app yet.");
      } else {
        const fileContent = await FileSystem.readAsStringAsync(book.uri);
        setText(fileContent);
      }
    };

    loadText();
  }, [book]);

  const speak = () => {
    if (!text) return;
    Speech.speak(text, {
      rate: 0.9,
      pitch: 1.0,
      voice: undefined, // pick available voice
      onDone: () => setSpeaking(false),
    });
    setSpeaking(true);
  };

  const stop = () => {
    Speech.stop();
    setSpeaking(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{book?.name}</Text>

      <ScrollView style={styles.textBox}>
        <Text>{text}</Text>
      </ScrollView>

      <View style={styles.controls}>
        {!speaking ? (
          <Pressable onPress={speak} style={styles.button}>
            <Text style={styles.btnText}>🔊 Read Aloud</Text>
          </Pressable>
        ) : (
          <Pressable
            onPress={stop}
            style={[styles.button, { backgroundColor: "#a00" }]}
          >
            <Text style={styles.btnText}>⏹️ Stop</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, backgroundColor: "#fff" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 12 },
  textBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
  },
  controls: {
    marginTop: 20,
    alignItems: "center",
  },
  button: {
    padding: 12,
    backgroundColor: "#111",
    borderRadius: 8,
    paddingHorizontal: 24,
  },
  btnText: { color: "#fff", fontWeight: "600" },
});
