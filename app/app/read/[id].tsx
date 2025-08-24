import Spinner from "@/components/Spinner";
import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { useFocusEffect } from "@react-navigation/native";
import * as Speech from "expo-speech";
import { VoiceQuality } from "expo-speech";
import React, { useEffect, useRef, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { useBook } from "@/hooks/useBook";
import { useProfile } from "@/hooks/useSettings";

const loadingMessages = [
  "Loading book content...",
  "Decoding book...",
  "Getting ready to speak...",
  "Finding the perfect voice...",
];

export default function ReadBook() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [voices, setVoices] = useState<Speech.Voice[]>([]);
  const [loadingAudio, setLoadingAudio] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  const [currentChunkIndex, setCurrentChunkIndex] = useState(0);

  const { id } = useLocalSearchParams();
  const bookId = parseInt(id as string);

  const { data: book } = useBook(bookId);
  const { data: profile } = useProfile();

  // Save book text in a variable
  const bookText = book?.text || "";

  const scrollRef = useRef<ScrollView>(null);

  const textChunks = bookText
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

      // Use user's settings if available
      if (profile?.pitch) setPitch(profile.pitch);
      if (profile?.rate) setRate(profile.rate);

      setVoices(availableVoices);

      const languages = Array.from(
        new Set(availableVoices.map((v) => v.language))
      );
      setLanguageItems(languages.map((lang) => ({ label: lang, value: lang })));

      const defaultLang =
        profile?.language ||
        languages.find((l) => l.startsWith("en")) ||
        languages[0];
      setSelectedLanguage(defaultLang);

      // Try to use user's preferred voice if available
      if (
        profile?.voice &&
        availableVoices.find((v) => v.identifier === profile.voice)
      ) {
        setSelectedVoice(profile.voice);
      } else {
        const fastVoice = availableVoices.find(
          (v) =>
            v.quality === VoiceQuality.Enhanced || v.language?.startsWith("en")
        );
        setSelectedVoice(
          fastVoice?.identifier || availableVoices[0]?.identifier
        );
      }
    };

    loadVoices();
  }, [profile]);

  useEffect(() => {
    if (!selectedLanguage) return;
    const filtered = voices.filter((v) => v.language === selectedLanguage);
    const voiceOptions = filtered.map((v) => ({
      label: v.name,
      value: v.identifier,
    }));
    setVoiceItems(voiceOptions);

    // Only set default if not already set from user preferences
    if (!selectedVoice) {
      setSelectedVoice(filtered[0]?.identifier || null);
    }
  }, [selectedLanguage, voices]);

  useEffect(() => {
    if (!loadingAudio) return;
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 1500);
    return () => clearInterval(interval);
  }, [loadingAudio]);

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        Speech.stop();
        setIsSpeaking(false);
        setPaused(false);
        setCurrentChunkIndex(0);
        setShowSettings(false);
      };
    }, [])
  );

  const speakFromIndex = (index: number) => {
    setLoadingAudio(false);
    setIsSpeaking(true);
    setPaused(false);
    setShowSettings(false);
    setCurrentChunkIndex(index);

    const speakNextChunk = (i: number) => {
      if (i >= textChunks.length) {
        setIsSpeaking(false);
        setPaused(false);
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
    Speech.pause();
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

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  const isPlaying = isSpeaking && !paused;
  const isStopped = !isSpeaking && !paused;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.safe}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={22} color="#007bff" />
          </Pressable>
          <Text style={styles.title}>📚 Read My Book</Text>
          <View style={styles.spacer} />
        </View>

        <View style={styles.contentArea}>
          {/* Always show progress and text when not in settings mode */}
          {!showSettings && (
            <>
              <Text style={styles.label}>
                Progress: {currentChunkIndex + 1} / {textChunks.length}
              </Text>
              <ScrollView style={styles.textScroll} ref={scrollRef}>
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

          {/* Show settings only when settings button is clicked */}
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
              <Spinner size="large" variant="primary" />
              <Text style={styles.feedbackText}>
                {loadingMessages[messageIndex]}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.buttonRow}>
          {/* Playing state */}
          {isPlaying && (
            <>
              <TouchableOpacity style={styles.actionBtn} onPress={pause}>
                <Text style={styles.btnText}>⏸ Pause</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionBtn]} onPress={stop}>
                <Text style={styles.btnText}>⏹ Stop</Text>
              </TouchableOpacity>
            </>
          )}

          {/* Paused state */}
          {paused && (
            <>
              <TouchableOpacity style={styles.actionBtn} onPress={resume}>
                <Text style={styles.btnText}>▶️ Resume</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionBtn, styles.settingsBtn]}
                onPress={toggleSettings}
              >
                <Text style={styles.btnText}>⚙️ Settings</Text>
              </TouchableOpacity>
            </>
          )}

          {/* Stopped state */}
          {isStopped && (
            <>
              <TouchableOpacity style={styles.actionBtn} onPress={speak}>
                <Text style={styles.btnText}>🔊 Play</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionBtn, styles.settingsBtn]}
                onPress={toggleSettings}
              >
                <Text style={styles.btnText}>⚙️ Settings</Text>
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
  contentArea: { flex: 0.9 },
  buttonRow: {
    flex: 0.1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 12,
  },
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
  actionBtn: {
    backgroundColor: "#111",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    minWidth: 100,
    alignItems: "center",
  },
  secondaryBtn: {
    backgroundColor: "#666",
  },
  settingsBtn: {
    backgroundColor: "#222222",
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
  textScroll: {
    flexGrow: 1,
    paddingBottom: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 32,
    marginTop: 20,
  },
  spacer: {
    width: 40,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
  },
  label: { fontSize: 16, fontWeight: "600", marginVertical: 8 },
});
