import AuthenticatedLayout from "@/components/Layout/AuthenticatedLayout";
import { useAddBook } from "@/hooks/useBook";
import * as DocumentPicker from "expo-document-picker";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  Animated,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

type FileAsset = {
  uri: string;
  name: string;
  mimeType?: string;
};

const { width } = Dimensions.get("window");

export default function UploadScreen() {
  const [file, setFile] = useState<FileAsset | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress] = useState(new Animated.Value(0));
  const addBookMutation = useAddBook();

  const pickFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: [
        "application/pdf",
        "image/*",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
        "application/msword", // .doc
      ],
      copyToCacheDirectory: true,
      multiple: false,
    });

    if (result.assets && result.assets.length > 0) {
      const asset = result.assets[0];

      // Allow PDF, images, and Word documents
      if (!asset.name?.match(/\.(pdf|jpe?g|png|docx?)$/i)) {
        Alert.alert(
          "Unsupported Format",
          "Please select a PDF, image file, or Word document.",
          [{ text: "OK", style: "default" }],
          { cancelable: true }
        );
        return;
      }

      setFile(asset);

      // Animate upload progress for visual feedback
      Animated.timing(uploadProgress, {
        toValue: 0.3,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);

    // Animate progress
    Animated.timing(uploadProgress, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();

    try {
      // Use the mutation to upload the file

      const uploadedBook = await addBookMutation.mutateAsync(file);

      Alert.alert(
        "Success! 🎉",
        `"${file.name}" has been uploaded successfully!`,
        [
          {
            text: "Read Now",
            onPress: () => {
              // Navigate to the reading screen with the book ID
              router.replace(`/read/${uploadedBook.id}`);
              setFile(null);
            },
          },
          {
            text: "Upload Another",
            onPress: () => {
              setFile(null);
            },
          },
        ]
      );
    } catch (err: any) {
      console.log("Upload error:", err);
      Alert.alert(
        "Upload Failed",
        err.response?.data?.message ||
          "Something went wrong. Please try again.",
        [{ text: "OK", style: "default" }]
      );
      uploadProgress.setValue(0);
    } finally {
      setUploading(false);
    }
  };

  const getFileIcon = (filename: string) => {
    if (filename.match(/\.(jpg|jpeg|png)$/i)) return "image";
    if (filename.match(/\.pdf$/i)) return "document-text";
    if (filename.match(/\.(doc|docx)$/i)) return "document";
    return "document-outline";
  };

  const getFileType = (filename: string) => {
    if (filename.match(/\.(jpg|jpeg|png)$/i)) return "Image";
    if (filename.match(/\.pdf$/i)) return "PDF Document";
    if (filename.match(/\.(doc|docx)$/i)) return "Word Document";
    return "Document";
  };

  const isImage = file?.name?.match(/\.(jpg|jpeg|png)$/i);

  return (
    <AuthenticatedLayout title="Upload Book">
      <LinearGradient
        colors={["#fefefe", "#cccccc"]}
        style={styles.gradientBackground}
      >
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Upload Your Book</Text>
          </View>

          {/* Upload Area */}
          <View style={styles.uploadArea}>
            {!file ? (
              <Pressable onPress={pickFile} style={styles.dropZone}>
                <View style={styles.dropZoneContent}>
                  <View style={styles.iconContainer}>
                    <Ionicons name="cloud-upload" size={48} color="#456123" />
                  </View>
                  <Text style={styles.dropZoneTitle}>Choose File</Text>
                  <Text style={styles.dropZoneSubtitle}>
                    PDF, Word Documents, or Images
                  </Text>
                  <Text style={styles.dropZoneHint}>
                    Tap to browse your files
                  </Text>
                </View>
              </Pressable>
            ) : (
              <View style={styles.filePreview}>
                <View style={styles.fileHeader}>
                  <View style={styles.fileIconContainer}>
                    <Ionicons
                      name={getFileIcon(file.name)}
                      size={32}
                      color="#456123"
                    />
                  </View>
                  <View style={styles.fileInfo}>
                    <Text style={styles.fileName} numberOfLines={2}>
                      {file.name}
                    </Text>
                    <Text style={styles.fileType}>
                      {getFileType(file.name)}
                    </Text>
                  </View>
                  <Pressable
                    onPress={() => setFile(null)}
                    style={styles.removeButton}
                  >
                    <Ionicons name="close-circle" size={24} color="#ff6b6b" />
                  </Pressable>
                </View>

                {isImage && (
                  <View style={styles.imageContainer}>
                    <Image
                      source={{ uri: file.uri }}
                      style={styles.imagePreview}
                      resizeMode="cover"
                    />
                  </View>
                )}

                {/* Progress Bar */}
                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <Animated.View
                      style={[
                        styles.progressFill,
                        {
                          width: uploadProgress.interpolate({
                            inputRange: [0, 1],
                            outputRange: ["0%", "100%"],
                          }),
                        },
                      ]}
                    />
                  </View>
                </View>
              </View>
            )}
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            {file && (
              <Pressable onPress={pickFile} style={styles.secondaryButton}>
                <Ionicons name="swap-horizontal" size={20} color="#456123" />
                <Text style={styles.secondaryButtonText}>Change File</Text>
              </Pressable>
            )}

            <Pressable
              onPress={handleUpload}
              style={[
                styles.primaryButton,
                {
                  opacity: file && !uploading ? 1 : 0,
                  backgroundColor: file && !uploading ? "#456123" : "#ccc",
                },
              ]}
              disabled={!file || uploading}
            >
              {uploading ? (
                <>
                  <ActivityIndicator color="#fff" size="small" />
                  <Text style={styles.primaryButtonText}>Uploading...</Text>
                </>
              ) : (
                <>
                  <Ionicons name="cloud-upload" size={20} color="#fff" />
                  <Text style={styles.primaryButtonText}>Upload Book</Text>
                </>
              )}
            </Pressable>
          </View>

          {/* Features */}
          <View style={styles.features}>
            <View style={styles.feature}>
              <Ionicons name="shield-checkmark" size={20} color="#4ecdc4" />
              <Text style={styles.featureText}>Secure Upload</Text>
            </View>
            <View style={styles.feature}>
              <Ionicons name="flash" size={20} color="#45b7d1" />
              <Text style={styles.featureText}>Fast Processing</Text>
            </View>
            <View style={styles.feature}>
              <Ionicons name="mic" size={20} color="#f39c12" />
              <Text style={styles.featureText}>Cool Audio</Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </AuthenticatedLayout>
  );
}

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#222222",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    fontWeight: "400",
  },
  uploadArea: {
    flex: 1,
    justifyContent: "center",
    marginBottom: 32,
  },
  dropZone: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "rgba(102, 126, 234, 0.3)",
    borderStyle: "dashed",
    paddingVertical: 48,
    paddingHorizontal: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
  },
  dropZoneContent: {
    alignItems: "center",
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(102, 126, 234, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  dropZoneTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
    marginBottom: 8,
  },
  dropZoneSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
    textAlign: "center",
  },
  dropZoneHint: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
  },
  filePreview: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
  },
  fileHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  fileIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(102, 126, 234, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  fileType: {
    fontSize: 12,
    color: "#666",
  },
  removeButton: {
    padding: 4,
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  imagePreview: {
    width: width - 96,
    height: 200,
    borderRadius: 12,
    backgroundColor: "#f5f5f5",
  },
  progressContainer: {
    marginTop: 16,
  },
  progressBar: {
    height: 4,
    backgroundColor: "rgba(102, 126, 234, 0.2)",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#456123",
    borderRadius: 2,
  },
  actionButtons: {
    gap: 12,
  },
  primaryButton: {
    backgroundColor: "#456123",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: "#456123",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  secondaryButton: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "rgba(102, 126, 234, 0.3)",
  },
  secondaryButtonText: {
    color: "#456123",
    fontWeight: "500",
    fontSize: 14,
  },
  features: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.2)",
  },
  feature: {
    alignItems: "center",
    gap: 4,
  },
  featureText: {
    color: "rgba(22, 12, 22, 0.7)",
    fontSize: 12,
    fontWeight: "500",
  },
});
