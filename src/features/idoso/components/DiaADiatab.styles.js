import { StyleSheet, Platform } from 'react-native';
import { radius, spacing, typography } from '../../../theme';

export const getStyles = (themeColors) =>
  StyleSheet.create({
    containerAbas: {
      flex: 1,
      paddingHorizontal: spacing?.md || 16,
      paddingTop: spacing?.sm || 12,
      paddingBottom: spacing?.lg || 24,
    },

    /* CARD DE BOAS-VINDAS EXPANDIDO */
    boasVindasCard: {
      backgroundColor: themeColors?.surface || '#FFFFFF',
      borderRadius: radius?.lg || 22,
      padding: spacing?.md || 20,
      marginBottom: spacing?.md || 20,
      borderWidth: 1,
      borderColor: 'rgba(0,0,0,0.04)',
      ...Platform.select({
        ios: {
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.08,
          shadowRadius: 10,
        },
        android: {
          elevation: 4,
        },
      }),
    },
    saudacao: {
      fontSize: typography?.sizes?.h3 || 20,
      fontWeight: '500',
      color: themeColors?.textSecondary || '#6C757D',
    },
    nomeDestaque: {
      fontSize: 32, // Nome bem visível e em destaque
      fontWeight: '800',
      color: themeColors?.textPrimary || '#1A1D20',
      marginBottom: spacing?.xs || 8,
    },
    subtituloBoasVindas: {
      fontSize: 18,
      lineHeight: 26,
      color: themeColors?.textSecondary || '#495057',
      fontWeight: '400',
    },

    /* GRID E CARDS DOS ATALHOS MAIORES */
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing?.sm || 12,
      marginBottom: spacing?.lg || 24,
    },
    cardAtalho: {
      width: '48%',
      backgroundColor: themeColors?.surface || '#FFFFFF',
      borderRadius: radius?.lg || 20,
      paddingVertical: 26, // Mais espaçamento interno para facilitar o toque
      paddingHorizontal: spacing?.xs || 12,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: 'rgba(0,0,0,0.04)',
      ...Platform.select({
        ios: {
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.08,
          shadowRadius: 10,
        },
        android: {
          elevation: 4,
        },
      }),
    },
    iconContainer: {
      width: 68, // Círculo do ícone ampliado
      height: 68,
      borderRadius: 34,
      backgroundColor: themeColors?.backgroundSecondary || '#F1F3F5',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing?.xs || 12,
    },
    cardTitle: {
      fontSize: 18, // Texto maior
      fontWeight: '700',
      color: themeColors?.textPrimary || '#1A1D20',
      textAlign: 'center',
    },

    /* ÁREA DE EMERGÊNCIA */
    headerEmergenciaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing?.xs || 8,
      marginTop: spacing?.xs || 8,
      marginBottom: spacing?.xs || 10,
    },
    tituloEmergenciaDestaque: {
      fontSize: 22,
      fontWeight: '800',
      color: themeColors?.danger || '#DC3545',
    },
    cardEmergenciaContainer: {
      backgroundColor: themeColors?.surface || '#FFFFFF',
      borderRadius: radius?.md || 18,
      padding: spacing?.md || 16,
      borderWidth: 1.5,
      borderColor: 'rgba(220, 53, 69, 0.25)',
      ...Platform.select({
        ios: {
          shadowColor: '#DC3545',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 10,
        },
        android: {
          elevation: 5,
        },
      }),
    },
    emergenciaRow: {
      flexDirection: 'row',
      gap: spacing?.md || 16, // Funções levemente mais separadas
    },
    botaoEmergenciaPrincipal: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing?.xs || 8,
      backgroundColor: themeColors?.danger || '#DC3545',
      paddingVertical: 16,
      borderRadius: radius?.sm || 14,
      ...Platform.select({
        ios: {
          shadowColor: '#DC3545',
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.25,
          shadowRadius: 6,
        },
        android: {
          elevation: 4,
        },
      }),
    },
    textoEmergenciaBranco: {
      fontSize: 17,
      fontWeight: '700',
      color: '#FFFFFF',
    },
    botaoEmergenciaSecundarioCard: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing?.xs || 6,
      backgroundColor: themeColors?.backgroundSecondary || '#F8F9FA',
      borderWidth: 1.5,
      borderColor: themeColors?.border || '#E9ECEF',
      paddingVertical: 16,
      borderRadius: radius?.sm || 14,
    },
    textoEmergencia: {
      fontSize: 17,
      fontWeight: '700',
    },
  });