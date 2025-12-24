import { supabase } from '@/lib/supabase'
import { router } from 'expo-router'
import { useState } from 'react'
import { Alert, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'

export default function signUp() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
	const signUp = async () => {
		const { error } = await supabase.auth.signUp({
			email,
			password,
		})

  	if (error) Alert.alert(error.message)
	}

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <Pressable style={styles.backButton} onPress={() => router.back() }>
        <Text style={styles.backButtonText}>←</Text>
      </Pressable>

      <View style={styles.card}>
        <Text style={styles.title}>Register</Text>
        <Text style={styles.subtitle}>Please register to login.</Text>

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

        <Pressable style={styles.primaryButton} onPress={signUp}>
          <Text style={styles.primaryButtonText}>Sign Up</Text>
        </Pressable>

        <Pressable style={styles.secondaryButton} onPress={() => router.replace('/login')}>
          <Text style={styles.secondaryButtonText}>
            Already have an account? Sign in
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a', // slate-900
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  backButton: {
    position: 'absolute',
    top: 48,
    left: 16,
    padding: 12,
    zIndex: 20,
    backgroundColor: '#1e293b', // slate-800
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  backButtonText: {
    color: '#cbd5f5',
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 6,
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b', // slate-500
    marginBottom: 24,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#e2e8f0', // slate-200
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 16,
    marginBottom: 14,
    backgroundColor: '#f8fafc',
  },
  primaryButton: {
    height: 48,
    backgroundColor: '#2563eb', // blue-600
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#2563eb',
    fontSize: 14,
    fontWeight: '500',
  },
})
