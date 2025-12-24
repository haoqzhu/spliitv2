import { Colors } from '@/constants/theme'
import { supabase } from '@/lib/supabase'
import { Ionicons } from '@react-native-vector-icons/ionicons'
import { router } from 'expo-router'
import { useState } from 'react'
import { Alert, Image, Pressable, StyleSheet, Text, TextInput, View, useColorScheme } from 'react-native'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const scheme = useColorScheme() ?? 'light'
  const theme = Colors[scheme]

  const login = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      Alert.alert(error.message)
    } else {
      router.replace('/(tabs)')
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Image style={styles.image} source={require('@/assets/images/login.png')} />
      <Pressable style={styles.backButton} onPress={() => router.back() }>
        <Text style={styles.backButtonText}>
          <Ionicons name="chevron-back" color="#ffffff" size={20} />
        </Text>
      </Pressable>

      <Text style={[styles.title, { color: theme.text }]}>Login</Text>
      <Text style={[styles.subtitle, { color: theme.text }]}>Please Sign In to continue.</Text>

      <TextInput
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />

      <View style={styles.footer}>
        <Pressable style={({ pressed }) => [
            styles.primaryButton,
            pressed && styles.primaryButtonPressed,
          ]} 
          onPress={login}>
          <Text style={styles.primaryText}>Sign In</Text>
        </Pressable>

        <View style={styles.subText}>
          <Text style={{ color: theme.text }}>Don't have an account? </Text>
          <Pressable onPress={() => router.replace('/signup')}>
            <Text style={styles.signUpText}>
              Sign up
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  image: {
    objectFit: 'contain',
    height: 200,
    marginBottom: 25,
    alignSelf: 'center'
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 25,
  },
  backButton: {
    position: 'absolute',
    top: 75,
    left: 16,
    padding: 12,
    zIndex: 20,
    backgroundColor: Colors.primary, // slate-800
    borderRadius: 10,
    shadowColor: '#000',
  },
  backButtonText: {
    color: '#cbd5f5',
    fontSize: 16,
  },
  title: {
    fontSize: 50,
    fontWeight: '800',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 25,
  },
  input: {
    height: 48,
    borderRadius: 25,
    paddingHorizontal: 14,
    fontSize: 16,
    marginBottom: 25,
    backgroundColor: '#f8fafc',
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
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  signUpText: {
    color: Colors.primary,
    fontWeight: '700',
  },
  footer: {
    alignItems: 'center',
    width: '100%',
    gap: 20,
  },
  subText: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
})
