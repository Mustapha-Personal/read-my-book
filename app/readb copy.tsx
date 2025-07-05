// Full implementation with conditional visibility for settings and full text view

import Spinner from "@/components/Spinner";
import Slider from "@react-native-community/slider";
import * as Speech from "expo-speech";
import React, { useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

const sampleText = `Welcome to ReadMyBook - your personal audiobook companion. This innovative application transforms your reading experience by converting text into natural-sounding speech.

Imagine you've just finished a long day at work. Your eyes are tired, but you're eager to continue the thrilling mystery novel you started last week. With ReadMyBook, simply upload your book and let our advanced text-to-speech technology read it aloud to you in a clear, pleasant voice. You can relax on your couch, go for a walk, or even prepare dinner while enjoying your favorite books.

Our application supports multiple languages and dialects, allowing you to listen to works in their original language or practice a foreign language through literature. The customizable voice settings let you adjust the speech rate to your preference - slower for complex material or faster when you're familiar with the content. You can also modify the pitch to find the most comfortable listening tone.

The current chapter of our demonstration book describes a serene landscape: "The morning sun cast golden rays across the dew-covered meadow, where wildflowers danced gently in the breeze. In the distance, the silhouette of ancient oak trees stood guard over the valley, their gnarled branches telling stories of centuries past. A babbling brook wound its way through the scene, its waters sparkling like liquid diamonds under the morning light."

Scientific studies have shown that auditory learning can improve comprehension and retention. Many users report remembering details better when they hear information rather than just reading it. This makes ReadMyBook particularly valuable for students, professionals studying dense material, or anyone who wants to maximize their reading experience.

The application also includes powerful features like:
- Bookmarking to save your position
- Sleep timer functionality
- Background playback
- Variable speed control
- Voice customization

As the famous author Stephen King once said, "Books are a uniquely portable magic." With ReadMyBook, that magic becomes even more accessible. Whether you're commuting, exercising, or simply relaxing, your favorite stories can accompany you anywhere.

The demonstration will now conclude with a famous excerpt from Shakespeare's "As You Like It":
"All the world's a stage,
And all the men and women merely players;
They have their exits and their entrances,
And one man in his time plays many parts..."

Thank you for exploring ReadMyBook. We hope this demonstration has shown how our application can bring your reading experience to life through the power of speech.`;

const loadingMessages = [
  "Loading book content...",
  "Decoding book...",
  "Getting ready to speak...",
  "Finding the perfect voice...",
];

export default function ReadBook() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [voices, setVoices] = useState<Speech.Voice[]>([]);
  const [loadingAudio, setLoadingAudio] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  const [currentChunkIndex, setCurrentChunkIndex] = useState(0);

  const scrollRef = useRef<ScrollView>(null);

  const textChunks = sampleText
    .split(/(?<=[.?!])\s+/)
    .filter((chunk) => chunk.trim().length > 0);

  const [langOpen, setLangOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [languageItems, setLanguageItems] = useState<any[]>([]);

  const [voiceOpen, setVoiceOpen] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState<string | null>(null);
  const [voiceItems, setVoiceItems] = useState<any[]>([]);

  useEffect(() => {
    const loadVoices = async () => {
      const availableVoices = await Speech.getAvailableVoicesAsync();
      setVoices(availableVoices);

      const languages = Array.from(
        new Set(availableVoices.map((v) => v.language))
      );
      const langOptions = languages.map((lang) => ({
        label: lang,
        value: lang,
      }));
      setLanguageItems(langOptions);

      const defaultLang =
        languages.find((l) => l.startsWith("en")) || languages[0];
      setSelectedLanguage(defaultLang);
    };

    loadVoices();
  }, []);

  useEffect(() => {
    if (!selectedLanguage) return;
    const filtered = voices.filter((v) => v.language === selectedLanguage);
    const voiceOptions = filtered.map((v) => ({
      label: v.name,
      value: v.identifier,
    }));
    setVoiceItems(voiceOptions);
    setSelectedVoice(filtered[0]?.identifier || null);
  }, [selectedLanguage, voices]);

  useEffect(() => {
    if (!loadingAudio) return;
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 1500);
    return () => clearInterval(interval);
  }, [loadingAudio]);

  const speakFromIndex = (index: number) => {
    setLoadingAudio(false);
    setIsSpeaking(true);
    setPaused(false);
    setCurrentChunkIndex(index);

    const speakNextChunk = (i: number) => {
      if (i >= textChunks.length) {
        setIsSpeaking(false);
        return;
      }

      setCurrentChunkIndex(i);
      scrollRef.current?.scrollTo({ y: i * 60, animated: true });

      Speech.speak(textChunks[i], {
        rate,
        pitch,
        voice: selectedVoice || undefined,
        onDone: () => {
          if (!paused) speakNextChunk(i + 1);
        },
      });
    };

    speakNextChunk(index);
  };

  const speak = () => {
    setLoadingAudio(true);
    setTimeout(() => speakFromIndex(0), 2000);
  };

  const pause = () => {
    Speech.stop();
    setPaused(true);
    setIsSpeaking(false);
  };

  const resume = () => {
    speakFromIndex(currentChunkIndex);
  };

  const stop = () => {
    Speech.stop();
    setPaused(false);
    setIsSpeaking(false);
    setCurrentChunkIndex(0);
  };

  const showSettings = !isSpeaking && !paused;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.safe}
    >
      <View style={styles.container}>
        <Text style={styles.title}>📚 Read My Book</Text>

        {!showSettings && (
          <>
            <Text style={styles.label}>
              Progress: {currentChunkIndex + 1} / {textChunks.length}
            </Text>

            <ScrollView
              style={{ maxHeight: 200, marginBottom: 16 }}
              ref={scrollRef}
            >
              {textChunks.map((chunk, index) => (
                <Text
                  key={index}
                  style={[
                    styles.chunkText,
                    index === currentChunkIndex && styles.highlight,
                  ]}
                >
                  {chunk}
                </Text>
              ))}
            </ScrollView>
          </>
        )}

        {showSettings && (
          <>
            <Text style={styles.label}>Select Language:</Text>
            <DropDownPicker
              open={langOpen}
              value={selectedLanguage}
              items={languageItems}
              setOpen={setLangOpen}
              setValue={setSelectedLanguage}
              setItems={setLanguageItems}
              placeholder="Select language"
              searchable
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
              zIndex={3000}
              zIndexInverse={1000}
            />

            <Text style={styles.label}>Select Voice:</Text>
            <DropDownPicker
              open={voiceOpen}
              value={selectedVoice}
              items={voiceItems}
              setOpen={setVoiceOpen}
              setValue={setSelectedVoice}
              setItems={setVoiceItems}
              placeholder="Select voice"
              searchable
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
              zIndex={2000}
              zIndexInverse={2000}
            />

            <Text style={styles.label}>Rate: {rate.toFixed(1)}</Text>
            <Slider
              minimumValue={0.5}
              maximumValue={2}
              value={rate}
              onValueChange={(val) => setRate(val)}
              step={0.1}
            />

            <Text style={styles.label}>Pitch: {pitch.toFixed(1)}</Text>
            <Slider
              minimumValue={0.5}
              maximumValue={2}
              value={pitch}
              onValueChange={(val) => setPitch(val)}
              step={0.1}
            />
          </>
        )}

        {loadingAudio && (
          <View style={styles.feedback}>
            <Spinner size="lg" variant="primary" />
            <Text style={styles.feedbackText}>
              {loadingMessages[messageIndex]}
            </Text>
          </View>
        )}

        <View style={styles.buttonRow}>
          {!isSpeaking ? (
            <TouchableOpacity style={styles.actionBtn} onPress={speak}>
              <Text style={styles.btnText}>🔊 Play</Text>
            </TouchableOpacity>
          ) : paused ? (
            <TouchableOpacity style={styles.actionBtn} onPress={resume}>
              <Text style={styles.btnText}>▶️ Resume</Text>
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity style={styles.actionBtn} onPress={pause}>
                <Text style={styles.btnText}>⏸ Pause</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionBtn, { marginLeft: 12 }]}
                onPress={stop}
              >
                <Text style={styles.btnText}>⏹ Stop</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1, padding: 24, backgroundColor: "#f2f2f2" },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
  },
  label: { fontSize: 16, fontWeight: "600", marginVertical: 8 },
  dropdown: {
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 16,
  },
  dropdownContainer: {
    backgroundColor: "#fff",
    borderColor: "#ccc",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
    flexWrap: "wrap",
  },
  actionBtn: {
    backgroundColor: "#111",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginBottom: 12,
  },
  btnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  feedback: {
    alignItems: "center",
    marginTop: 20,
  },
  feedbackText: {
    marginTop: 12,
    fontSize: 14,
    color: "#555",
    fontWeight: "500",
  },
  chunkText: {
    fontSize: 14,
    marginBottom: 10,
    color: "#333",
    lineHeight: 20,
  },
  highlight: {
    backgroundColor: "#fffae6",
    fontWeight: "bold",
  },
});
