import { SelectOption, SelectProps } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  FlatList,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export function Select({
  options,
  selectedValue,
  onSelect,
  placeholder,
  label,
}: SelectProps) {
  const [modalVisible, setModalVisible] = useState(false);

  const selectedOption = options.find((opt) => opt.value === selectedValue);

  const handleSelect = (item: SelectOption) => {
    onSelect(item.value);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <TouchableOpacity
        style={styles.selector}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.7}
      >
        <Text
          style={[styles.selectorText, !selectedOption && styles.placeholder]}
        >
          {selectedOption
            ? selectedOption.label
            : placeholder || "Selecione..."}
        </Text>
        <Ionicons name="chevron-down" size={18} color="#666" />
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <SafeAreaView style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{label || "Selecione"}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.doneButton}>Concluir</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={options}
              keyExtractor={(item) => item.value.toString()}
              renderItem={({ item }) => {
                const isSelected = item.value === selectedValue;
                return (
                  <TouchableOpacity
                    style={[
                      styles.optionItem,
                      isSelected && styles.optionItemActive,
                    ]}
                    onPress={() => handleSelect(item)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        isSelected && styles.optionTextActive,
                      ]}
                    >
                      {item.label}
                    </Text>
                    {isSelected && (
                      <Ionicons name="checkmark" size={20} color="#fff" />
                    )}
                  </TouchableOpacity>
                );
              }}
            />
          </SafeAreaView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 20,
  },
  label: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 16,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    opacity: 0.8,
  },
  selector: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    height: 55,
    backgroundColor: "#000000",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#333333",
  },
  selectorText: {
    color: "#FFFFFF",
    fontSize: 15,
  },
  placeholder: {
    color: "#666",
  },

  // --- Estilos do Modal (Bottom Sheet) ---
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.95)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#000000",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    maxHeight: "80%",
    borderTopWidth: 1,
    borderTopColor: "#222222",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
    paddingBottom: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: "#333333",
  },
  modalTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  doneButton: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    padding: 5,
  },

  optionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 10,
    borderBottomWidth: 0.3,
    borderBottomColor: "#222222",
  },
  optionItemActive: {
    backgroundColor: "#0A0A0A",
  },
  optionText: {
    color: "#AAAAAA",
    fontSize: 16,
  },
  optionTextActive: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
});
