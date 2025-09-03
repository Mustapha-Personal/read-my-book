import React, { useEffect, useMemo, useRef, useState } from "react";
import { useBook } from "@/hooks/useBook";
import { useUserSettings } from "@/hooks/useSettings";
import { Link, router, useLocalSearchParams } from "expo-router";
import {
  SafeAreaView,
  StatusBar,
  Platform,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  StyleSheet,
} from "react-native";
import * as Speech from "expo-speech";
import { Ionicons } from "@expo/vector-icons";

// AUTOMATED EXPO-SPEECH HOOK
const useAutomatedExpoSpeech = (sentences, profile) => {
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const currentSessionRef = useRef(0);

  // AUTOMATIC sentence-by-sentence playback (no manual batching!)
  const playSentence = (index, sessionId) => {
    if (sessionId !== currentSessionRef.current) return;
    if (index >= sentences.length) {
      // Reading complete
      setIsPlaying(false);
      setCurrentSentenceIndex(0);
      return;
    }

    const sentence = sentences[index];
    setCurrentSentenceIndex(index);
    setIsPlaying(true);
    setIsPaused(false);

    Speech.speak(sentence, {
      rate: profile?.rate || 1.0,
      pitch: profile?.pitch || 1.0,
      voice: profile?.voice || undefined,
      language: profile?.language || "en-US",
      quality: Speech.VoiceQuality.Enhanced,

      onStart: () => {
        console.log(`🎯 Auto-playing sentence ${index + 1}`);
      },

      // AUTOMATIC progression - no manual timing needed!
      onDone: () => {
        if (sessionId === currentSessionRef.current) {
          // Auto-advance to next sentence with smart delay
          const delay = sentence.match(/[!?]/) ? 400 : 200;
          setTimeout(() => playSentence(index + 1, sessionId), delay);
        }
      },

      onError: (error) => {
        console.error(`Error on sentence ${index}:`, error);
        // Auto-skip to next sentence on error
        if (sessionId === currentSessionRef.current) {
          setTimeout(() => playSentence(index + 1, sessionId), 500);
        }
      },
    });
  };

  const startReading = (fromIndex = 0) => {
    Speech.stop();
    currentSessionRef.current += 1;
    const sessionId = currentSessionRef.current;

    setTimeout(() => playSentence(fromIndex, sessionId), 100);
  };

  const pauseReading = () => {
    Speech.stop();
    setIsPlaying(false);
    setIsPaused(true);
    currentSessionRef.current += 1;
  };

  const resumeReading = () => {
    startReading(currentSentenceIndex);
  };

  const stopReading = () => {
    Speech.stop();
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentSentenceIndex(0);
    currentSessionRef.current += 1;
  };

  const jumpToSentence = (targetIndex) => {
    Speech.stop();
    setCurrentSentenceIndex(targetIndex);
    if (isPlaying || isPaused) {
      startReading(targetIndex);
    }
  };

  return {
    currentSentenceIndex,
    isPlaying,
    isPaused,
    startReading,
    pauseReading,
    resumeReading,
    stopReading,
    jumpToSentence,
  };
};

export default function AutomatedReadBook() {
  const { id } = useLocalSearchParams();
  const bookId = parseInt(id as string);
  const { data: book } = useBook(bookId);
  const { data: profile } = useUserSettings();

  const scrollRef = useRef<ScrollView>(null);

  // IMPROVED: Better sentence splitting that handles abbreviations and line breaks
  const sentences = useMemo(() => {
    if (!book?.text) return [];

    // First, clean up the text to handle line breaks and multiple spaces
    const cleanedText =
      "Read My Book App by Ogunkunle Fatima, now enjoy your reading. " +
      book.text
        .replace(/\n+/g, " ") // Replace line breaks with spaces
        .replace(/\s+/g, " ") // Replace multiple spaces with single space
        .trim();

    // Smart sentence splitting that combines short fragments
    let rawSentences = cleanedText
      .split(/(?<=[.!?])\s+(?=[A-Z])/) // Split only before capital letters
      .map((s) => s.trim())
      .filter((s) => s.length > 5);

    // Combine very short sentences with the next one for better flow
    const improvedSentences = [];
    let currentSentence = "";

    for (let i = 0; i < rawSentences.length; i++) {
      const sentence = rawSentences[i];

      // If current sentence is too short (likely a fragment), combine with next
      if (sentence.length < 50 && i < rawSentences.length - 1) {
        currentSentence += sentence + " ";
      } else {
        currentSentence += sentence;
        if (currentSentence.trim().length > 10) {
          improvedSentences.push(currentSentence.trim());
        }
        currentSentence = "";
      }
    }

    // Add any remaining sentence
    if (currentSentence.trim().length > 10) {
      improvedSentences.push(currentSentence.trim());
    }

    return improvedSentences;
  }, [book?.text]);

  // REPLACE your entire complex system with this simple hook
  const {
    currentSentenceIndex,
    isPlaying,
    isPaused,
    startReading,
    pauseReading,
    resumeReading,
    stopReading,
    jumpToSentence,
  } = useAutomatedExpoSpeech(sentences, profile);

  // FIXED: Auto-scroll with proper native component handling
  useEffect(() => {
    if (currentSentenceIndex >= 0 && sentences.length > 0) {
      // Use a more reliable scrolling approach
      setTimeout(() => {
        const estimatedOffset = currentSentenceIndex * 80; // Estimate based on sentence height
        const targetY = Math.max(0, estimatedOffset - 150); // Keep some context above

        scrollRef.current?.scrollTo({
          y: targetY,
          animated: true,
        });
      }, 100); // Small delay to ensure component is rendered
    }
  }, [currentSentenceIndex, sentences.length]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      Speech.stop();
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />

      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Link href={"/(auth)/tabs/history"} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </Link>
          <Text style={styles.headerTitle}>{book?.title}</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Progress */}
        <View style={styles.progressCard}>
          <Text style={styles.progressText}>
            📖 {currentSentenceIndex + 1} / {sentences.length} (
            {Math.round(((currentSentenceIndex + 1) / sentences.length) * 100)}
            %)
          </Text>
          <Text style={styles.progressSubtext}>
            👆 Tap any sentence to jump there
          </Text>
        </View>

        {/* Auto-scrolling text */}
        <ScrollView
          ref={scrollRef}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={true}
        >
          {sentences.map((sentence, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => jumpToSentence(index)}
              activeOpacity={0.7}
              style={[
                styles.sentenceContainer,
                index === currentSentenceIndex && styles.currentSentence,
              ]}
            >
              <Text style={styles.sentenceNumber}>{index + 1}.</Text>
              <Text
                style={[
                  styles.sentenceText,
                  index === currentSentenceIndex && styles.currentSentenceText,
                ]}
              >
                {sentence}
              </Text>
              {index === currentSentenceIndex && isPlaying && (
                <Text style={styles.speakerIcon}>🔊</Text>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Controls */}
        <View style={styles.controls}>
          {!isPlaying && !isPaused && (
            <TouchableOpacity
              style={[styles.controlButton, styles.startButton]}
              onPress={() => startReading(0)}
            >
              <Text style={styles.controlButtonText}>Start Listening</Text>
            </TouchableOpacity>
          )}

          {isPlaying && (
            <>
              <TouchableOpacity
                style={[styles.controlButton, styles.pauseButton]}
                onPress={pauseReading}
              >
                <Text style={styles.controlButtonText}>⏸️ Pause</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.controlButton, styles.stopButton]}
                onPress={stopReading}
              >
                <Text style={styles.controlButtonText}>⏹️ Stop</Text>
              </TouchableOpacity>
            </>
          )}

          {isPaused && (
            <TouchableOpacity
              style={[styles.controlButton, styles.resumeButton]}
              onPress={resumeReading}
            >
              <Text style={styles.controlButtonText}>▶️ Resume</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingVertical: 10,
  },
  backButton: {
    padding: 8,
  },
  backText: {
    fontSize: 18,
    color: "#007bff",
    fontWeight: "500",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  headerSpacer: {
    width: 50,
  },
  progressCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  progressText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  progressSubtext: {
    color: "#666",
    marginTop: 4,
    fontSize: 14,
  },
  scrollView: {
    flex: 1,
    marginBottom: 16,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  sentenceContainer: {
    flexDirection: "row",
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: "#f8f9fa",
    alignItems: "flex-start",
  },
  currentSentence: {
    backgroundColor: "#fff3cd",
    borderLeftWidth: 4,
    borderLeftColor: "#ffc107",
  },
  sentenceNumber: {
    color: "#999",
    marginRight: 8,
    minWidth: 30,
    fontSize: 14,
  },
  sentenceText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
  },
  currentSentenceText: {
    fontWeight: "bold",
    color: "#856404",
  },
  speakerIcon: {
    marginLeft: 8,
    fontSize: 16,
  },
  controls: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
    paddingBottom: Platform.OS === "android" ? 30 : 20,
    gap: 16,
    backgroundColor: "#f8f9fa",
  },
  controlButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    minWidth: 100,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  startButton: {
    backgroundColor: "#28a745",
  },
  pauseButton: {
    backgroundColor: "#ffc107",
  },
  stopButton: {
    backgroundColor: "#dc3545",
  },
  resumeButton: {
    backgroundColor: "#28a745",
  },
  controlButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
});
