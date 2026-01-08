import { supabase } from '@/lib/supabase'
import { Image } from 'expo-image'
import * as ImagePicker from 'expo-image-picker'
import { useEffect, useState } from 'react'
import { Alert, Button, StyleSheet, Text, View } from 'react-native'

interface Props {
  size?: number
  url: string | null
  onUpload?: (filePath: string) => void
  placeholderText?: string
  placeholderColor?: string
}

export default function Avatar({ url, size = 150, onUpload, placeholderText, placeholderColor }: Props) {
  const [uploading, setUploading] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const avatarSize = { height: size, width: size }

  useEffect(() => {
    if (url) downloadImage(url)
  }, [url])

  async function downloadImage(path: string) {
    try {
      const { data, error } = await supabase.storage.from('avatars').download(path)

      if (error) {
        throw error
      }

      const fr = new FileReader()
      fr.readAsDataURL(data)
      fr.onload = () => {
        setAvatarUrl(fr.result as string)
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log('Error downloading image: ', error.message)
      }
    }
  }

  async function uploadAvatar() {
    try {
      setUploading(true)

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'], // Restrict to only images
        allowsMultipleSelection: false, // Can only select one image
        allowsEditing: true, // Allows the user to crop / rotate their photo before uploading it
        quality: 1,
        exif: false, // We don't want nor need that data.
      })

      if (result.canceled || !result.assets || result.assets.length === 0) {
        console.log('User cancelled image picker.')
        return
      }

      const image = result.assets[0]
      console.log('Got image', image)

      if (!image.uri) {
        throw new Error('No image uri!') // Realistically, this should never happen, but just in case...
      }

      const arraybuffer = await fetch(image.uri).then((res) => res.arrayBuffer())

      const fileExt = image.uri?.split('.').pop()?.toLowerCase() ?? 'jpeg'
      const path = `${Date.now()}.${fileExt}`
      const { data, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(path, arraybuffer, {
          contentType: image.mimeType ?? 'image/jpeg',
        })

      if (uploadError) {
        throw uploadError
      }

      if (onUpload) {
        onUpload(data.path)
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message)
      } else {
        throw error
      }
    } finally {
      setUploading(false)
    }
  }

  return (
    <View>
      {avatarUrl ? (
        <Image
          source={{ uri: avatarUrl }}
          accessibilityLabel="Avatar"
          style={[avatarSize, styles.avatar]}
          contentFit="cover"
        />
      ) : (
        <View style={[avatarSize, styles.avatar, styles.noImage, { backgroundColor: placeholderColor || '#333' }]}>
          {placeholderText && (
            <Text style={styles.placeholderText}>
              {placeholderText}
            </Text>
          )}
        </View>
      )}
      {onUpload && (
        <View>
          <Button
            title={uploading ? 'Uploading ...' : 'Upload'}
            onPress={uploadAvatar}
            disabled={uploading}
          />
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  avatar: {
    borderRadius: 100,
    overflow: 'hidden',
    maxWidth: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImage: {
    borderRadius: 25,
  },
  placeholderText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#f4f4f0',
  },
})