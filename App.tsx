import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { Image } from 'react-native';
import { useWindowDimensions } from 'react-native';

function WelcomeMessage() {
  const { width } = useWindowDimensions();
  const imageSize = Math.min(width * 0.6, 250);

  return (
    <View style={{ alignItems: 'center', marginTop: 20, paddingHorizontal: 16 }}>
      <Text style={{ fontSize: width > 400 ? 22 : 18, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' }}>
        ¡Bienvenida a tu futura app de Control de Notas 💛💕!
      </Text>
      <Image
        source={{ uri: 'https://i.pinimg.com/736x/ed/70/d7/ed70d7e7ffea6a509fb2026d2c86d2c1.jpg' }}
        style={{ width: imageSize, height: imageSize, borderRadius: 10 }}
        resizeMode="cover"
      />
      <Text style={{ marginTop: 10, fontSize: width > 400 ? 16 : 14, textAlign: 'center' }}>
        ¡Espero verte ya cuando tenga un avancesito :3!
      </Text>
    </View>
  );
}

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 18, textAlign: 'center' }}>Holi Moycito :3</Text>
      <StatusBar style="auto" />
      <WelcomeMessage />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
