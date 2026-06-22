import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useNavigation } from "@react-navigation/native";

import styles from "./LoginStyle";

// ─── Dados dos perfis ──────────────────────────────────────────────────────────
const PERFIS = [
  {
    key: "Cuidador",
    label: "Cuidador",
    desc: "Gerenciar rotina e atividades",
    icon: <MaterialIcons name="health-and-safety" size={22} color="#4169E1" />,
  },
  {
    key: "Familiar",
    label: "Familiar",
    desc: "Acompanhar e descrever",
    icon: <MaterialIcons name="family-restroom" size={22} color="#4169E1" />,
  },
  {
    key: "Idoso",
    label: "Idoso Autonomo",
    desc: "Jogos e atividades",
    icon: <FontAwesome5 name="heartbeat" size={20} color="#4169E1" />,
  },
];

// ─── Helpers de formatação ─────────────────────────────────────────────────────
function formatCPF(value) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  return digits
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function formatTelefone(value) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 10) {
    return digits.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
  }
  return digits.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
}

// ─── Componente ───────────────────────────────────────────────────────────────
export default function Login() {
  const navigation = useNavigation();
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [perfilSelecionado, setPerfilSelecionado] = useState(null);

  const handleCadastrar = () => {
    if (!nome.trim()) {
      Alert.alert("Campo obrigatório", "Informe seu nome completo.");
      return;
    }
    if (cpf.replace(/\D/g, "").length < 11) {
      Alert.alert("CPF inválido", "Digite um CPF completo com 11 dígitos.");
      return;
    }
    if (telefone.replace(/\D/g, "").length < 10) {
      Alert.alert("Telefone inválido", "Digite um telefone válido.");
      return;
    }
    if (!perfilSelecionado) {
      Alert.alert("Perfil não selecionado", "Escolha um perfil para continuar.");
      return;
    }
    navigation.navigate(perfilSelecionado);
  };

  return (
    <KeyboardAvoidingView
      style={styles.wrapper}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <StatusBar style="light" />

      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <View style={styles.logoCircle}>
            <FontAwesome5 name="user-plus" size={28} color="#4169E1" />
          </View>
          <Text style={styles.titulo}>Criar Conta</Text>
          <Text style={styles.subtitulo}>VivaBem · Cuidado com quem importa</Text>
        </View>

        {/* ── Card do formulário ── */}
        <View style={styles.card}>

          <Text style={styles.label}>Nome completo</Text>
          <View style={styles.inputWrapper}>
            <MaterialIcons name="person-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Ex: Maria Aparecida"
              placeholderTextColor="#9CA3AF"
              value={nome}
              onChangeText={setNome}
              autoCapitalize="words"
              returnKeyType="next"
            />
          </View>

          <Text style={styles.label}>CPF</Text>
          <View style={styles.inputWrapper}>
            <MaterialIcons name="badge" size={20} color="#9CA3AF" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="000.000.000-00"
              placeholderTextColor="#9CA3AF"
              value={cpf}
              onChangeText={(v) => setCpf(formatCPF(v))}
              keyboardType="numeric"
              returnKeyType="next"
            />
          </View>

          <Text style={styles.label}>Telefone</Text>
          <View style={styles.inputWrapper}>
            <MaterialIcons name="phone-android" size={20} color="#9CA3AF" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="(11) 99999-0000"
              placeholderTextColor="#9CA3AF"
              value={telefone}
              onChangeText={(v) => setTelefone(formatTelefone(v))}
              keyboardType="phone-pad"
              returnKeyType="done"
            />
          </View>

          <Text style={[styles.label, styles.labelSpacingExtra]}>Selecione seu perfil</Text>
          <View style={styles.perfilGrid}>
            {PERFIS.map((p) => {
              const ativo = perfilSelecionado === p.key;
              return (
                <TouchableOpacity
                  key={p.key}
                  style={[styles.perfilCard, ativo && styles.perfilCardAtivo]}
                  onPress={() => setPerfilSelecionado(p.key)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.perfilIconBox, ativo && styles.perfilIconBoxAtivo]}>
                    {p.icon}
                  </View>
                  <Text style={[styles.perfilLabel, ativo && styles.perfilLabelAtivo]}>
                    {p.label}
                  </Text>
                  <Text style={styles.perfilDesc}>{p.desc}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* ── Botão principal ── */}
        <TouchableOpacity
          style={styles.botaoCadastrar}
          onPress={handleCadastrar}
          activeOpacity={0.85}
        >
          <Text style={styles.botaoTexto}>Cadastrar</Text>
          <MaterialIcons name="arrow-forward" size={20} color="#4169E1" />
        </TouchableOpacity>

        <Text style={styles.rodape}>
          Ao cadastrar, você concorda com nossos{" "}
          <Text style={styles.rodapeLink}>Termos de Uso</Text>
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}