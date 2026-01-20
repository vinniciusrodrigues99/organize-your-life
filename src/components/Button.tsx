import { FontAwesome } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  icon?: any;
  label?: string;
  theme?: "primary";
  onClick?: () => void;
  onPress?: () => void;
};

export default function Button({
  icon,
  label,
  theme,
  onClick,
  onPress,
}: Props) {
  if (theme === "primary") {
    return (
      <View
        style={[
          styles.buttonContainer,
          { borderWidth: 4, borderColor: "#69086cff", borderRadius: 18 },
        ]}
      >
        <Pressable
          style={[styles.button, { backgroundColor: "#fff" }]}
          onPress={onPress}
        >
          <FontAwesome
            name="picture-o"
            size={18}
            color={"#25292e"}
            style={styles.buttonIcon}
          />
          <Text style={styles.buttonLabel}> {label}</Text>
        </Pressable>
      </View>
    );
  }
  return (
    <View style={styles.buttonContainer}>
      <Pressable style={styles.button} onPress={onClick}>
        {icon && (
          <FontAwesome
            name={icon}
            size={18}
            color={"#25292e"}
            style={styles.buttonIcon}
          />
        )}
        <Text style={styles.buttonLabel}>{label}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    width: 320,
    height: 68,
    marginHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    padding: 3,
  },
  button: {
    borderRadius: 10,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    backgroundColor: "white",
  },
  buttonIcon: {
    paddingRight: 8,
  },
  buttonLabel: {
    color: "#00000",
    fontSize: 16,
    fontWeight: "500",
  },
});
