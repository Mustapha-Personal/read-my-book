import AuthenticatedLayout from "@/components/Layout/AuthenticatedLayout";
import * as DocumentPicker from "expo-document-picker";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

type FileAsset = {
  uri: string;
  name: string;
  mimeType?: string;
};

export default function UploadScreen() {
  const [file, setFile] = useState<FileAsset | null>(null);
  const [uploading, setUploading] = useState(false);

  const pickFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: [
        "application/pdf",
        "image/*",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/msword",
      ],
      copyToCacheDirectory: true,
      multiple: false,
    });

    if (result.assets && result.assets.length > 0) {
      const asset = result.assets[0];

      if (!asset.name?.match(/\.(pdf|jpe?g|png)$/i)) {
        alert("Only PDF or image files (e.g. screenshot) are allowed.");
        return;
      }

      setFile(asset);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);

    try {
      // Simulate upload
      await new Promise((res) => setTimeout(res, 2000));
      alert(`Uploaded "${file.name}" successfully!`);
      setFile(null);
    } catch (err) {
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const isImage = file?.name?.match(/\.(jpg|jpeg|png)$/i);

  return (
    <AuthenticatedLayout title="Upload Book">
      <View style={styles.container}>
        <Pressable onPress={pickFile} style={styles.selectButton}>
          <Text style={styles.buttonText}>Select PDF or Screenshot</Text>
        </Pressable>

        {file?.name && (
          <View style={styles.preview}>
            <Text style={styles.filename}>📄 {file.name}</Text>

            {isImage && (
              <Image
                source={{ uri: file.uri }}
                style={styles.imagePreview}
                resizeMode="contain"
              />
            )}
          </View>
        )}

        <Pressable
          onPress={handleUpload}
          style={[styles.uploadButton, { opacity: file ? 1 : 0.5 }]}
          disabled={!file || uploading}
        >
          {uploading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Upload</Text>
          )}
        </Pressable>
      </View>
    </AuthenticatedLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    alignItems: "center",
    gap: 20,
  },
  selectButton: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  uploadButton: {
    backgroundColor: "#111",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  filename: {
    fontSize: 15,
    fontStyle: "italic",
    color: "#333",
    marginBottom: 8,
    textAlign: "center",
  },
  preview: {
    alignItems: "center",
    gap: 10,
  },
  imagePreview: {
    width: 180,
    height: 240,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
});
