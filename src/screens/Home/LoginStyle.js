import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  // ─── Layout base ───────────────────────────────────────────────
  wrapper: {
    flex: 1,
    backgroundColor: "#4169E1",
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 64,
    paddingBottom: 40,
  },

  // ─── Header ────────────────────────────────────────────────────
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  titulo: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },
  subtitulo: {
    fontSize: 13,
    color: "rgba(255,255,255,0.72)",
    marginTop: 4,
    letterSpacing: 0.2,
  },

  // ─── Card do formulário ────────────────────────────────────────
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    shadowColor: "#1e3a8a",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 10,
    marginBottom: 24,
  },

  // ─── Inputs ────────────────────────────────────────────────────
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 6,
    marginTop: 14,
    letterSpacing: 0.1,
  },
  labelSpacingExtra: {
    marginTop: 6,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    paddingHorizontal: 12,
    height: 50,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#111827",
  },

  // ─── Cards de perfil ───────────────────────────────────────────
  perfilGrid: {
    flexDirection: "row",
    gap: 10,
    marginTop: 4,
  },
  perfilCard: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    paddingVertical: 14,
    paddingHorizontal: 6,
  },
  perfilCardAtivo: {
    backgroundColor: "#EEF2FF",
    borderColor: "#4169E1",
  },
  perfilIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  perfilIconBoxAtivo: {
    backgroundColor: "#C7D2FE",
  },
  perfilLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 3,
  },
  perfilLabelAtivo: {
    color: "#4169E1",
  },
  perfilDesc: {
    fontSize: 10,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 13,
  },

  // ─── Botão principal ───────────────────────────────────────────
  botaoCadastrar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    height: 56,
    gap: 8,
    shadowColor: "#1e3a8a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
    marginBottom: 20,
  },
  botaoTexto: {
    fontSize: 17,
    fontWeight: "700",
    color: "#4169E1",
    letterSpacing: 0.2,
  },

  // ─── Rodapé ────────────────────────────────────────────────────
  rodape: {
    textAlign: "center",
    fontSize: 12,
    color: "rgba(255,255,255,0.65)",
    lineHeight: 18,
  },
  rodapeLink: {
    color: "#FFFFFF",
    fontWeight: "600",
    textDecorationLine: "underline",
  },
});

export default styles;