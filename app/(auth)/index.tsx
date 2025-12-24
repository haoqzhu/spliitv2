import { Colors } from '@/constants/theme'
import { router } from 'expo-router'
import { Image, Pressable, StyleSheet, Text, useColorScheme, View } from 'react-native'

export default function Welcome() {
  const scheme = useColorScheme() ?? 'light'
  const theme = Colors[scheme]

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}> 
      <Image style={styles.image} source={require('@/assets/images/welcome.png')} />

      <Text style={[styles.title, { color: theme.text }]}>Spliit.</Text>
      <Text style={[styles.subtitle, { color: theme.text }]}>
        Less Math. More Memories.
      </Text>

      <View style={styles.footer}>
        <Pressable
          style={({ pressed }) => [
            styles.primaryButton,
            pressed && styles.primaryButtonPressed,
          ]}
          onPress={() => router.navigate('/signup')}
        >
          <Text style={styles.primaryText}>Get Started</Text>
        </Pressable>

        <View style={styles.subText}>
          <Text style={{ color: theme.text }}>Already have an account? </Text>
          <Pressable style={({ pressed }) => pressed && styles.loginTextPressed}
            onPress={() => router.navigate('/login')}
          >
            <Text style={styles.loginText}>Sign In</Text>
          </Pressable>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  image: {
    objectFit: 'contain',
    height: 300,
    marginBottom: 50,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 25,
  },
  title: {
    fontSize: 50,
    fontWeight: '800',
    marginBottom: 15,
    color: Colors.primary,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    width: '100%',
    position: 'absolute',
    bottom: 50,
    gap: 20,
  },
  primaryButton: {
    width: '100%',
    backgroundColor: Colors.primary,
    paddingVertical: 15,
    borderRadius: 50,
    alignItems: 'center',

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  primaryButtonPressed: {
    transform: [{ scale: 0.99 }],
    opacity: 0.85,
  },
  primaryText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#f4f4f0',  
  },
  subText: {
    flexDirection: 'row',
  },
  loginText: {
    color: Colors.primary,
    fontWeight: '700',
  },
  loginTextPressed: {
    opacity: 0.85,
  },
})
