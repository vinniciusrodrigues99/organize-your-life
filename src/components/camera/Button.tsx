import { FontAwesome } from "@expo/vector-icons";
import { Pressable, StyleSheet, View } from "react-native";

type Props = {
  icon: any;
  onPress?: () => void;
  color?: string;
};

export default function Button({ icon, onPress, color }: Props) {
  return (
    <View style={styles.buttonContainer}>
      <Pressable style={styles.button} onPress={onPress}>
        <FontAwesome
          name={icon}
          size={24}
          color={color || "#25292e"}
          style={styles.buttonIcon}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    width: 60,
    height: 60,
    display: "flex",
  },
  button: {
    borderRadius: 30,
    borderWidth: 3,
    borderColor: "white",
    height: "100%",
    width: "100%",
    backgroundColor: "#ffffffe5",
    alignItems: "center",
    justifyContent: "center",
    borderBlockStartColor: "white",
  },
  buttonIcon: {
    alignSelf: "center",
    justifyContent: "center",
  },
});
