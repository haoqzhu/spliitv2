import Avatar from '@/components/Avatar'
import { Colors } from '@/constants/theme'
import { useAuth } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { Ionicons } from '@react-native-vector-icons/ionicons'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, FlatList, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View, useColorScheme } from 'react-native'

interface UserProfile {
  id: string
  username: string | null
  avatar_url: string | null
  website: string | null
}

export default function Search() {
  const session = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(false)
  const [debounceTimer, setDebounceTimer] = useState<ReturnType<typeof setTimeout> | null>(null)

  const scheme = useColorScheme() ?? 'light'
  const theme = Colors[scheme]

  useEffect(() => {
    // Clear previous timer
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }

    // If search query is empty, clear results
    if (searchQuery.trim() === '') {
      setUsers([])
      return
    }

    // Set new timer for debounced search
    const timer = setTimeout(() => {
      searchUsers(searchQuery.trim())
    }, 300) // 300ms debounce

    setDebounceTimer(timer)

    // Cleanup
    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [searchQuery])

  async function searchUsers(query: string) {
    try {
      setLoading(true)
      
      if (!session?.user) {
        throw new Error('Not authenticated')
      }

      // Search for users by username (case-insensitive)
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, avatar_url, website')
        .ilike('username', `%${query}%`)
        .neq('id', session.user.id) // Exclude current user
        .limit(20) // Limit results

      if (error) throw error

      setUsers(data || [])
    } catch (error: any) {
      console.error('Error searching users:', error.message)
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  function renderUserItem({ item }: { item: UserProfile }) {
    return (
      <Pressable
        style={({ pressed }) => [
          styles.userItem,
          pressed && styles.userItemPressed,
        ]}
        onPress={() => {
          // You can navigate to user profile or perform other actions here
          console.log('User pressed:', item.id)
        }}
      >
        <View style={styles.avatarContainer}>
          <Avatar
            url={item.avatar_url}
            size={45}
            placeholderText={item.username?.[0]?.toUpperCase() || '?'}
            placeholderColor={Colors.primary}
          />
        </View>
        <View style={styles.userInfo}>
          <Text style={[styles.username, { color: theme.text }]}>{item.username || 'No username'}</Text>
          {item.website && (
            <Text style={[styles.website, { color: theme.icon }]} numberOfLines={1}>
              {item.website}
            </Text>
          )}
        </View>
      </Pressable>
    )
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <View style={styles.searchContainer}>
        <View style={[styles.inputWrapper, { backgroundColor: theme.input }]}>
          <Ionicons
            name="search-outline"
            size={20}
            style={[styles.inputIcon, { color: theme.icon }]}
          />
          <TextInput
            placeholder="Search by username..."
            placeholderTextColor={theme.icon}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
            style={[styles.inputWithIcon, { color: theme.text }]}
          />
        </View>
      </View>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={Colors.primary} />
        </View>
      )}

      {!loading && searchQuery.trim() === '' && (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: theme.icon }]}>
            Start typing to search for your friends...
          </Text>
        </View>
      )}

      {!loading && searchQuery.trim() !== '' && users.length === 0 && (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: theme.icon }]}>No users found</Text>
        </View>
      )}

      {!loading && users.length > 0 && (
        <FlatList
          data={users}
          renderItem={renderUserItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 62.5 : 25,
    paddingBottom: 13,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 42,
    borderRadius: 25,
    paddingHorizontal: 15,
  },
  inputIcon: {
    marginRight: 10,
  },
  inputWithIcon: {
    flex: 1,
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  listContainer: {
    padding: 15,
    paddingTop: 5,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 0,
    marginBottom: 15,
  },
  userItemPressed: {
    opacity: 0.85,
  },
  avatarContainer: {
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  website: {
    fontSize: 14,
    fontWeight: '500',
  },
})