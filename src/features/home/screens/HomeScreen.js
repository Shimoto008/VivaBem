import React from 'react';
import { ScrollView, View, Text, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { getStyles } from './Home.styles';
import { PERFIL_OPTIONS } from './perfilOptions';
import { Card, Button } from '../../../components/ui';
import { useTheme } from '../../../contexts/ThemeContext';
import { ROUTES } from '../../../constants/routeNames';

const FAMILIAS_DE_ICONE = { MaterialIcons, FontAwesome5 };

export default function HomeScreen() {
  const navigation = useNavigation();
  const { themeColors } = useTheme();
  const styles = getStyles(themeColors);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Image style={styles.img} source={require('../../../../assets/VivaBem.png')} />
        <Text style={styles.titulo}>Área de Login</Text>
        <Text style={styles.subtitulo}>Auxiliar cuidadores de idoso</Text>

        <Button
          title="Criar conta"
          onPress={() => navigation.navigate(ROUTES.CADASTRO)}
          style={styles.ctaCriarConta}
          accessibilityLabel="Criar uma nova conta"
        />

        <Text style={styles.selecionar}>Ou escolha um perfil para começar</Text>

        <View style={styles.lista}>
          {PERFIL_OPTIONS.map((opcao) => {
            const IconeComponente = FAMILIAS_DE_ICONE[opcao.iconFamily];
            return (
              <TouchableOpacity
                key={opcao.key}
                activeOpacity={0.7}
                onPress={() =>
                  navigation.navigate(ROUTES.CADASTRO, { tipoInicial: opcao.tipoInicial })
                }
                accessibilityRole="button"
                accessibilityLabel={`Selecionar perfil ${opcao.title}`}
              >
                <Card style={styles.cardPerfil}>
                  <View style={styles.iconContainer}>
                    <IconeComponente name={opcao.icon} size={26} color={opcao.iconColor} />
                  </View>
                  <View style={styles.textoContainer}>
                    <Text style={styles.escolha}>{opcao.title}</Text>
                    <Text style={styles.desc}>{opcao.description}</Text>
                  </View>
                  <MaterialIcons name="chevron-right" size={24} color={opcao.iconColor} />
                </Card>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate(ROUTES.LOGIN)}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Entrar em uma conta existente"
          style={styles.linkLogin}
        >
          <Text style={styles.textoLinkLogin}>Já tenho conta — entrar com CPF</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
