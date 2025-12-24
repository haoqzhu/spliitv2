import Avatar from '@/components/Avatar'
import { useAuth } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import React, { useEffect, useState } from 'react'
import { Alert, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'

export default function Account() {
  const session = useAuth()
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState('')
  const [website, setWebsite] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')

  useEffect(() => {
    if (session) getProfile()
  }, [session])

  async function getProfile() {
    try {
      setLoading(true)
      if (!session?.user) throw new Error('No user on the session!')

      const { data, error } = await supabase
        .from('profiles')
        .select('username, website, avatar_url')
        .eq('id', session.user.id)
        .single()

      if (error) throw error

      if (data) {
        setUsername(data.username ?? '')
        setWebsite(data.website ?? '')
        setAvatarUrl(data.avatar_url ?? '')
      }
    } catch (error: any) {
      Alert.alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  async function updateProfile() {
    try {
      setLoading(true)
      if (!session?.user) throw new Error('No user on the session!')

      const { error } = await supabase.from('profiles').upsert({
        id: session.user.id,
        username,
        website,
        avatar_url: avatarUrl,
        updated_at: new Date(),
      })

      if (error) throw error
      Alert.alert('Profile updated')
    } catch (error: any) {
      Alert.alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <View style={styles.card}>
        <Text style={styles.title}>Account Settings</Text>
        <Text style={styles.subtitle}>Manage your profile information</Text>

        <View style={styles.avatarWrapper}>
          <Avatar
            size={120}
            url={avatarUrl}
            onUpload={(url) => {
              setAvatarUrl(url)
            }}
          />
        </View>

        <Text style={styles.label}>Email</Text>
        <TextInput
          value={session?.user?.email}
          editable={false}
          style={[styles.input, styles.disabledInput]}
        />

        <Text style={styles.label}>Username</Text>
        <TextInput
          value={username}
          onChangeText={setUsername}
          style={styles.input}
        />

        <Text style={styles.label}>Website</Text>
        <TextInput
          value={website}
          onChangeText={setWebsite}
          style={styles.input}
        />

        <Pressable
          style={[styles.primaryButton, loading && { opacity: 0.6 }]}
          onPress={updateProfile}
          disabled={loading}
        >
          <Text style={styles.primaryButtonText}>
            {loading ? 'Saving…' : 'Save Changes'}
          </Text>
        </Pressable>

        <Pressable
          style={styles.dangerButton}
          onPress={() => supabase.auth.signOut()}
        >
          <Text style={styles.dangerButtonText}>Sign Out</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a', // slate-900
    padding: 20,
    justifyContent: 'center',
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
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 24,
  },
  avatarWrapper: {
    alignItems: 'center',
    marginBottom: 24,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: '#334155',
    marginBottom: 6,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: '#f8fafc',
  },
  disabledInput: {
    backgroundColor: '#e5e7eb',
    color: '#64748b',
  },
  primaryButton: {
    height: 48,
    backgroundColor: '#2563eb',
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
  dangerButton: {
    marginTop: 16,
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ef4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dangerButtonText: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: '600',
  },
})
