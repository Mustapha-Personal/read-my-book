// app/settings.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import { useUpdateSettings, useUserSettings } from "@/hooks/useSettings";
import AuthenticatedLayout from "@/components/Layout/AuthenticatedLayout";
import Button from "@/components/Button";
import Slider from "@react-native-community/slider";
import DropDownPicker from "react-native-dropdown-picker";
import * as Speech from "expo-speech";

export default function SettingsScreen() {
  // const { data: profile, isLoading } = useProfile();

  const { data: profile, isLoading } = useUserSettings();

  const updateSettingsMutation = useUpdateSettings();

  const [language, setLanguage] = useState("");
  const [voice, setVoice] = useState("");
  const [pitch, setPitch] = useState(1);
  const [rate, setRate] = useState(1);

  const [langOpen, setLangOpen] = useState(false);
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [languageItems, setLanguageItems] = useState<any[]>([]);
  const [voiceItems, setVoiceItems] = useState<any[]>([]);
  const [voices, setVoices] = useState<Speech.Voice[]>([]);

  // Load available voices
  useEffect(() => {
    const loadVoices = async () => {
      const availableVoices = await Speech.getAvailableVoicesAsync();
      setVoices(availableVoices);

      const languages = Array.from(
        new Set(availableVoices.map((v) => v.language))
      );
      setLanguageItems(languages.map((lang) => ({ label: lang, value: lang })));
    };

    loadVoices();
  }, []);

  // Update voice options when language changes
  useEffect(() => {
    if (!language) return;
    const filtered = voices.filter((v) => v.language === language);
    const voiceOptions = filtered.map((v) => ({
      label: v.name,
      value: v.identifier,
    }));
    setVoiceItems(voiceOptions);
  }, [language, voices]);

  // Initialize form with profile data
  useEffect(() => {
    if (profile) {
      setLanguage(profile.language || "");
      setVoice(profile.voice || "");
      setPitch(profile.pitch || 1);
      setRate(profile.rate || 1);
    }
  }, [profile]);

  const handleSave = async () => {
    try {
      await updateSettingsMutation.mutateAsync({
        language,
        voice,
        pitch,
        rate,
      });

      Alert.alert("Success", "Settings saved successfully!");
    } catch (error) {
      Alert.alert("Error", "Failed to save settings. Please try again.");
    }
  };

  const handleTest = () => {
    Speech.speak("This is a test of your current settings", {
      voice,
      pitch,
      rate,
    });
  };

  if (isLoading) {
    return (
      <AuthenticatedLayout title="Settings">
        <View style={styles.center}>
          <ActivityIndicator size="large" />
          <Text>Loading settings...</Text>
        </View>
      </AuthenticatedLayout>
    );
  }

  return (
    <AuthenticatedLayout title="Settings">
      <ScrollView style={styles.container}>
        {/* <Text style={styles.sectionTitle}>Speech Settings</Text> */}

        <Text style={styles.label}>Select Language:</Text>
        <DropDownPicker
          open={langOpen}
          value={language}
          items={languageItems}
          setOpen={setLangOpen}
          setValue={setLanguage}
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
          value={voice}
          items={voiceItems}
          setOpen={setVoiceOpen}
          setValue={setVoice}
          setItems={setVoiceItems}
          placeholder="Select voice"
          searchable
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownContainer}
          zIndex={2000}
          zIndexInverse={2000}
          disabled={!language}
        />

        <Text style={styles.label}>Rate: {rate.toFixed(1)}</Text>
        <Slider
          minimumValue={0.5}
          maximumValue={2}
          value={rate}
          onValueChange={setRate}
          step={0.1}
          style={styles.slider}
        />

        <Text style={styles.label}>Pitch: {pitch.toFixed(1)}</Text>
        <Slider
          minimumValue={0.5}
          maximumValue={2}
          value={pitch}
          onValueChange={setPitch}
          step={0.1}
          style={styles.slider}
        />

        <View style={styles.buttonContainer}>
          <Button
            label="Test Settings"
            onPress={handleTest}
            variant="outline"
            style={styles.testButton}
            disabled={false}
          />
          <Button
            label="Save Settings"
            onPress={handleSave}
            style={styles.saveButton}
            disabled={false}
          />
        </View>
      </ScrollView>
    </AuthenticatedLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 20,
    color: "#333",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginVertical: 8,
    color: "#333",
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
  slider: {
    width: "100%",
    height: 40,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },
  testButton: {
    flex: 1,
  },
  saveButton: {
    flex: 1,
  },
});
