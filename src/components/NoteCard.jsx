import { Text, StyleSheet, View, Pressable } from "react-native";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import { Ionicons } from "@expo/vector-icons";

export default function NoteCard({ note, onToggle, onEdit, onDelete }) {
  function getDate() {
    if (note.createdAt && note.createdAt.toDate) {
      return note.createdAt.toDate().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
    return "Just now";
  }

  function renderRightActions() {
    return (
      <View style={styles.actions}>
        <Pressable
          style={[styles.actionButton, styles.editButton]}
          onPress={() => onEdit(note)}
        >
          <Ionicons name="create-outline" size={22} color="#ffffff" />
          <Text style={styles.actionText}>Edit</Text>
        </Pressable>
        <Pressable
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => onDelete(note.id)}
        >
          <Ionicons name="trash-outline" size={22} color="#ffffff" />
          <Text style={styles.actionText}>Delete</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <Swipeable
      renderRightActions={renderRightActions}
      rightThreshold={40}
      overshootRight={false}
      containerStyle={styles.swipeContainer}
    >
      <View style={styles.noteCard}>
        <View style={styles.noteContent}>
          <Text style={styles.noteTitle} numberOfLines={1}>
            {note.title}
          </Text>
          <Text style={styles.notePreview} numberOfLines={2}>
            {note.content}
          </Text>
          <Text style={styles.noteDate}>{getDate()}</Text>
        </View>

        <Pressable style={styles.star} onPress={() => onToggle(note.id)}>
          <Ionicons
            name={note.favorite ? "star" : "star-outline"}
            size={24}
            color={note.favorite ? "#d97706" : "#5b6275"}
          />
        </Pressable>
      </View>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  swipeContainer: {
    height: 100,
    marginBottom: 10,
    borderRadius: 16,
  },
  noteCard: {
    height: 100,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    marginBottom: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },

  noteContent: {
    flex: 1,
  },

  noteTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#1b1f3b",
    marginBottom: 3,
  },

  notePreview: {
    fontSize: 14,
    color: "#4a5168",
    marginBottom: 4,
  },

  noteDate: {
    fontSize: 12,
    color: "#5b6275",
  },

  star: {
    marginLeft: 8,
  },

  actions: {
    width: 150,
    flexDirection: "row",
  },

  actionButton: {
    width: 75,
    justifyContent: "center",
    alignItems: "center",
  },
  editButton: {
    backgroundColor: "#4338ca",
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  deleteButton: {
    backgroundColor: "#b91c1c",
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
  },
  actionText: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "600",
    marginTop: 3,
  },
});
