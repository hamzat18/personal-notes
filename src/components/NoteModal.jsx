import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function NoteModal({ visible, note, onClose, onSave }) {
  const [title, setTitle] = useState(note ? note.title : "");
  const [content, setContent] = useState(note ? note.content : "");

  function handleSave() {
    if (!title.trim()) {
      return;
    }

    onSave({
      title: title.trim(),
      content: content.trim(),
    });
  }

  const editing = note != null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === "ios" ? "position" : "height"}
      >
        <Pressable style={styles.background} onPress={onClose} />
        <View style={styles.modal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {editing ? "Edit Note" : "Add Note"}
            </Text>
            <Pressable style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={20} color="#4a5168" />
            </Pressable>
          </View>
          <Text style={styles.label}>TITLE</Text>
          <TextInput
            style={styles.input}
            placeholder="Note title"
            placeholderTextColor="#aaa"
            value={title}
            onChangeText={setTitle}
          />
          <Text style={styles.label}>CONTENT</Text>
          <TextInput
            style={[styles.input, styles.contentInput]}
            placeholder="Write your note..."
            placeholderTextColor="#aaa"
            value={content}
            onChangeText={setContent}
            multiline
            textAlignVertical="top"
          />
          <Pressable style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>
              {editing ? "Save Changes" : "Add Note"}
            </Text>
          </Pressable>
          <Pressable style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },

  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
  },

  modal: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 36,
  },

  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1b1f3b",
  },

  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f0f1f7",
    justifyContent: "center",
    alignItems: "center",
  },

  label: {
    fontSize: 11,
    fontWeight: "600",
    color: "#5b6275",
    marginBottom: 7,
  },

  input: {
    height: 52,
    borderWidth: 1,
    borderColor: "#d5d9e5",
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 16,
    color: "#1b1f3b",
    marginBottom: 18,
  },

  contentInput: {
    height: 160,
    paddingTop: 14,
  },

  saveButton: {
    height: 54,
    backgroundColor: "#4338ca",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 4,
  },

  saveButtonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 16,
  },

  cancelButton: {
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 6,
  },

  cancelButtonText: {
    color: "#4a5168",
    fontSize: 15,
    fontWeight: "600",
  },
});
