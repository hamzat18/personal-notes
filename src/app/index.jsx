import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import NoteCard from "../components/NoteCard";
import FilterButton from "../components/FilterButton";
import NoteModal from "../components/NoteModal";
import {
  createNote,
  removeNote,
  subscribeToNotes,
  updateNote,
} from "../services/noteServices";
import { auth } from "../firebase/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

export default function HomeScreen() {
  const [notes, setNotes] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [filter, setFilter] = useState("All");
  const [modalVisible, setModalVisible] = useState(false);
  const [editingNote, setEditingNote] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!user) {
      setNotes([]);
      return;
    }

    const unsubscribe = subscribeToNotes(
      user.uid,
      (firestoreNotes) => {
        setNotes(firestoreNotes);
      },
      (error) => {
        console.error("Error loading notes: ", error);
      },
    );
    return () => unsubscribe();
  }, [user?.uid]);

  const handleSignup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setEmail("");
      setPassword("");
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setEmail("");
      setPassword("");
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.log(error);
    }
  };

  function openAddModal() {
    setEditingNote(null);
    setModalVisible(true);
  }

  function openEditModal(note) {
    setEditingNote(note);
    setModalVisible(true);
  }

  function closeModal() {
    setModalVisible(false);
    setEditingNote(null);
  }

  async function toggleFavorite(id) {
    const note = notes.find((note) => note.id === id);

    if (!note) return;

    try {
      await updateNote(id, {
        favorite: !note.favorite,
      });
    } catch (error) {
      console.error("Error updating note", error);
    }
  }

  async function saveNote(noteData) {
    if (!user) return;

    try {
      if (editingNote) {
        await updateNote(editingNote.id, {
          title: noteData.title,
          content: noteData.content,
        });
      } else {
        await createNote(noteData, user.uid);
      }
      closeModal();
    } catch (error) {
      console.error("Error saving note", error);
    }
  }

  async function deleteNote(id) {
    try {
      await removeNote(id);
    } catch (error) {
      console.error("Error deleting note", error);
    }
  }

  function getFilteredNotes() {
    if (filter === "Favorites") {
      return notes.filter((note) => note.favorite);
    }

    return notes;
  }

  const filteredNotes = getFilteredNotes();

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loginContainer}>
          <Image
            source={require("../../assets/images/notes-logo.png")}
            style={styles.logo}
            resizeMode="contain"
          ></Image>
          <Text style={styles.loginTitle}>Personal Notes</Text>
          <Text style={styles.loginSubtitle}>Log in to see your notes </Text>
          <TextInput
            style={styles.loginInput}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput
            style={styles.loginInput}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <Pressable style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Sign In</Text>
          </Pressable>
          <Pressable style={styles.createAccountButton} onPress={handleSignup}>
            <Text style={styles.createAccountButtonText}>Create Account</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>My Notes</Text>
            <Text style={styles.subtitle}>{notes.length} notes in total</Text>
          </View>
          <Pressable onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={30}></Ionicons>
          </Pressable>
        </View>
        <View style={styles.filters}>
          <FilterButton
            title="All"
            active={filter === "All"}
            onPress={() => setFilter("All")}
          />
          <FilterButton
            title="Favorites"
            active={filter === "Favorites"}
            onPress={() => setFilter("Favorites")}
          />
        </View>
        <FlatList
          style={styles.list}
          data={filteredNotes}
          renderItem={({ item }) => (
            <NoteCard
              note={item}
              onToggle={toggleFavorite}
              onEdit={openEditModal}
              onDelete={deleteNote}
            />
          )}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />
        <Pressable style={styles.addButton} onPress={openAddModal}>
          <Text style={styles.addButtonText}>+</Text>
        </Pressable>
        {modalVisible && (
          <NoteModal
            visible={modalVisible}
            note={editingNote}
            onClose={closeModal}
            onSave={saveNote}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5fa",
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 20,
  },
  loginContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    transform: [{ translateY: -22 }],
  },
  loginTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  loginSubtitle: {
    fontSize: 15,
    color: "#5b6275",
    marginBottom: 30,
    textAlign: "center",
  },
  loginInput: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    marginBottom: 20,
  },
  loginButton: {
    width: "100%",
    backgroundColor: "#4338ca",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
    marginTop: 10,
  },
  loginButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  createAccountButton: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#222",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  createAccountButtonText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1b1f3b",
  },
  subtitle: {
    fontSize: 14,
    color: "#5b6275",
    marginTop: 3,
  },
  filters: {
    flexDirection: "row",
    backgroundColor: "#e9eaf2",
    borderRadius: 24,
    padding: 6,
    marginBottom: 20,
  },
  list: {
    flex: 1,
  },
  addButton: {
    position: "absolute",
    right: 20,
    bottom: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#4338ca",
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    color: "#ffffff",
    fontSize: 40,
    fontWeight: "300",
    marginTop: -8,
  },
});
