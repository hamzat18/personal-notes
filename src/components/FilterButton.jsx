import { Pressable, StyleSheet, Text } from "react-native";

export default function FilterButton({ title, active, onPress }) {
  return (
    <Pressable
      style={[styles.button, active && styles.activeButton]}
      onPress={onPress}
    >
      <Text style={[styles.text, active && styles.activeText]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 18,
  },
  activeButton: {
    backgroundColor: "#fff",
    elevation: 2,
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
    color: "#49526b",
  },
  activeText: {
    color: "#4338d1",
  },
});
