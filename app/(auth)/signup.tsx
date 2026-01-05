import { Colors } from '@/constants/theme'
import { supabase } from '@/lib/supabase'
import { Ionicons } from '@react-native-vector-icons/ionicons'
import { router } from 'expo-router'
import { useState } from 'react'
import { Alert, Image, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, useColorScheme, View } from 'react-native'

export default function signUp() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [username, setUsername] = useState('')

  const scheme = useColorScheme() ?? 'light'
  const theme = Colors[scheme]
  
	const signUp = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Passwords do not match')
      return
    }

		const { data, error } = await supabase.auth.signUp({
			email,
			password,
		})

  	if (error) Alert.alert(error.message)

    const { error: profileError } = await supabase
      .from('profiles')
      .update({ username })
      .eq('id', data.user?.id)

    if (profileError) {
      Alert.alert(profileError.message)
    }
	}

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <Image style={styles.image} source={require('@/assets/images/register.png')} />
      <Pressable style={styles.backButton} onPress={() => router.back() }>
        <Text style={styles.backButtonText}>
          <Ionicons name="chevron-back" color="#ECEDEE" size={20} />
        </Text>
      </Pressable>

      <Text style={[styles.title, { color: theme.text }]}>Register</Text>
      <Text style={[styles.subtitle, { color: theme.text }]}>Please register to login.</Text>

      {/* <TextInput
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        style={[styles.input, { backgroundColor: theme.input, color: theme.text }]}
      /> */}

      <View style={[styles.inputWrapper, { backgroundColor: theme.input }]}>
        <Ionicons
          name="person-outline"
          size={20}
          style={[styles.inputIcon, { color: theme.icon }]}
        />
        <TextInput
          placeholder="Username"
          autoCapitalize="none"
          value={username}
          onChangeText={setUsername}
          style={[styles.inputWithIcon, { color: theme.text }]}
        />
      </View>

      <View style={[styles.inputWrapper, { backgroundColor: theme.input }]}>
        <Ionicons
          name="mail-outline"
          size={20}
          color={theme.text}
          style={[styles.inputIcon, { color: theme.icon }]}
        />
        <TextInput
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          spellCheck={false}
          style={[styles.inputWithIcon, { color: theme.text }]}
        />
      </View>

      <View style={[styles.inputWrapper, { backgroundColor: theme.input }]}>
        <Ionicons
          name="lock-closed-outline"
          size={20}
          color={theme.text}
          style={[styles.inputIcon, { color: theme.icon }]}
        />
        <TextInput
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={[styles.inputWithIcon, { color: theme.text }]}
        />
      </View>

      <View style={[styles.inputWrapper, { backgroundColor: theme.input }]}>
        <Ionicons
          name="lock-closed-outline"
          size={20}
          color={theme.text}
          style={[styles.inputIcon, { color: theme.icon }]}
        />
        <TextInput
          placeholder="Confirm Password"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          style={[styles.inputWithIcon, { color: theme.text }]}
        />
      </View>

      <View style={styles.footer}>
        <Pressable style={({ pressed }) => [
            styles.primaryButton,
            pressed && styles.primaryButtonPressed,
          ]} 
          onPress={signUp}>
          <Text style={styles.primaryText}>Sign Up</Text>
        </Pressable>

        <View style={styles.subText}>
          <Text style={{ color: theme.text }}>Already have an account? </Text>
          <Pressable style={({ pressed }) => pressed && styles.signInTextPressed}
            onPress={() => router.replace('/login')}
          >
            <Text style={styles.signInText}>
              Sign in
            </Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 25,
  },
  image: {
    objectFit: 'contain',
    height: 200,
    marginBottom: 25,
    alignSelf: 'center',
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
  signInText: {
    color: Colors.primary,
    fontWeight: '700',
  },
  signInTextPressed: {
    opacity: 0.85,
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
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: 25,
    paddingHorizontal: 16,
    marginBottom: 15,
  },
  inputIcon: {
    marginRight: 10,
  },
  inputWithIcon: {
    flex: 1,
    fontSize: 16,
  },
})
