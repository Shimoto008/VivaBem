import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@vivabem:theme-preferences';
const DEFAULT_PRIMARY_COLOR = '#3B82F6';

/**
 * Paletas neutras atualizadas:
 * No modo claro (LIGHT_PALETTE), alteramos o background para #FFFFFF
 * e os textos primário/secundário para o preto puro (#000000).
 */
const LIGHT_PALETTE = {
  background: '#FFFFFF', // <--- Alterado de #F8F9FA para Branco Puro
  surface: '#FFFFFF',
  border: '#E1E8ED',
  divider: '#F1F3F5',
  textPrimary: '#000000', // <--- Alterado para Preto Puro
  textSecondary: '#000000', // <--- Alterado para Preto Puro
  textTertiary: '#777777',
  placeholder: '#A1A1A1',
  overlay: 'rgba(0, 0, 0, 0.4)',
};

const DARK_PALETTE = {
  background: '#121212',
  surface: '#1E1E1E',
  border: '#333336',
  divider: '#2A2A2C',
  textPrimary: '#F2F2F2',
  textSecondary: '#B0B0B3',
  textTertiary: '#8A8A8D',
  placeholder: '#7A7A7D',
  overlay: 'rgba(0, 0, 0, 0.6)',
};

const SEMANTIC = {
  white: '#FFFFFF',
  success: '#228B22',
  danger: '#FF3B30',
  warning: '#FF6347',
  disabled: '#C7C7CC',
  textOnPrimary: '#FFFFFF',
};

function escurecerHex(hex, fator = 0.15) {
  const match = /^#?([a-f\d]{6})$/i.exec(hex);
  if (!match) return hex;
  const numero = parseInt(match[1], 16);
  const r = Math.max(0, Math.floor(((numero >> 16) & 0xff) * (1 - fator)));
  const g = Math.max(0, Math.floor(((numero >> 8) & 0xff) * (1 - fator)));
  const b = Math.max(0, Math.floor((numero & 0xff) * (1 - fator)));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

function buildThemeColors(isDarkMode, primaryColor) {
  const paleta = isDarkMode ? DARK_PALETTE : LIGHT_PALETTE;
  return {
    ...paleta,
    ...SEMANTIC,
    primary: primaryColor,
    primarySoft: `${primaryColor}22`,
    primaryBorder: `${primaryColor}44`,
    primaryPressed: escurecerHex(primaryColor, 0.18),
  };
}

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [primaryColor, setPrimaryColorState] = useState(DEFAULT_PRIMARY_COLOR);
  const [preferenciasCarregadas, setPreferenciasCarregadas] = useState(false);

  useEffect(() => {
    let ativo = true;
    (async () => {
      try {
        const salvo = await AsyncStorage.getItem(STORAGE_KEY);
        if (ativo && salvo) {
          const preferencias = JSON.parse(salvo);
          if (typeof preferencias.isDarkMode === 'boolean') setIsDarkMode(preferencias.isDarkMode);
          if (typeof preferencias.primaryColor === 'string') setPrimaryColorState(preferencias.primaryColor);
        }
      } catch (erro) {
        console.warn('Não foi possível carregar as preferências de tema:', erro.message);
      } finally {
        if (ativo) setPreferenciasCarregadas(true);
      }
    })();
    return () => {
      ativo = false;
    };
  }, []);

  useEffect(() => {
    if (!preferenciasCarregadas) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ isDarkMode, primaryColor })).catch((erro) => {
      console.warn('Não foi possível salvar as preferências de tema:', erro.message);
    });
  }, [isDarkMode, primaryColor, preferenciasCarregadas]);

  const toggleDarkMode = useCallback(() => setIsDarkMode((atual) => !atual), []);
  const setPrimaryColor = useCallback((hex) => setPrimaryColorState(hex), []);

  const themeColors = useMemo(() => buildThemeColors(isDarkMode, primaryColor), [isDarkMode, primaryColor]);

  const value = useMemo(
    () => ({ isDarkMode, primaryColor, themeColors, toggleDarkMode, setPrimaryColor }),
    [isDarkMode, primaryColor, themeColors, toggleDarkMode, setPrimaryColor]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme deve ser usado dentro de um <ThemeProvider>.');
  }
  return context;
}