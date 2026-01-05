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

// 1. Definição do Tipo para as Opções
interface Option {
  id: string;
  label: string;
}

// 2. Props do Componente (caso você queira extraí-lo para um arquivo separado)
interface MultiSelectProps {
  options: Option[];
  label: string;
  placeholder?: string;
}

export default function MultiSelect({
  options,
  label,
  placeholder = "Selecione...",
}: MultiSelectProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const toggleOption = (id: string): void => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Encontra os rótulos dos itens selecionados para exibir os Chips
  const selectedLabels = options.filter((opt) => selectedIds.includes(opt.id));

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <TouchableOpacity
        style={styles.selector}
        onPress={() => setIsModalVisible(true)}
        activeOpacity={0.7}
      >
        <Text style={styles.selectorText}>
          {selectedIds.length > 0
            ? `${selectedIds.length} selecionado(s)`
            : placeholder}
        </Text>
        <Ionicons name="chevron-down" size={18} color="#666" />
      </TouchableOpacity>

      {/* Renderização de Chips (Seleções Atuais) */}
      <View style={styles.chipContainer}>
        {selectedLabels.map((item) => (
          <View key={item.id} style={styles.chip}>
            <Text style={styles.chipText}>{item.label}</Text>
            <TouchableOpacity onPress={() => toggleOption(item.id)}>
              <Ionicons
                name="close-circle"
                size={16}
                color="#FFF"
                style={{ marginLeft: 5 }}
              />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <Modal visible={isModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <SafeAreaView style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{label}</Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <Text style={styles.doneButton}>Concluir</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={options}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => {
                const isSelected = selectedIds.includes(item.id);
                return (
                  <TouchableOpacity
                    style={[
                      styles.optionItem,
                      isSelected && styles.optionItemActive,
                    ]}
                    onPress={() => toggleOption(item.id)}
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
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 10,
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
    borderColor: "#333333", // Borda sutil para definir o campo
  },
  selectorText: {
    color: "#FFFFFF",
    fontSize: 15,
  },

  // --- Estilos dos Chips (Itens selecionados fora do modal) ---
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 12,
    gap: 8,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111111",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#222222",
  },
  chipText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "500",
  },

  // --- Estilos do Modal (Ocupa a tela toda ou estilo Bottom Sheet) ---
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.95)", // Fundo escurecido semi-transparente
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#000000",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    maxHeight: "80%", // Evita que o modal cubra a tela toda
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

  // --- Estilos da Lista de Opções ---
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
    backgroundColor: "#0A0A0A", // Destaque muito sutil para o item selecionado
  },
  optionText: {
    color: "#AAAAAA", // Texto em cinza para itens não selecionados
    fontSize: 16,
  },
  optionTextActive: {
    color: "#FFFFFF", // Branco puro para o que está selecionado
    fontWeight: "600",
  },
});
