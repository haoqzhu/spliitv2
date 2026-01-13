import { Colors } from '@/constants/theme'
import { useAuth } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { Ionicons } from '@react-native-vector-icons/ionicons'
import * as ImagePicker from 'expo-image-picker'
import React, { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  useColorScheme
} from 'react-native'

interface Receipt {
  id: string
  created_at: string
  total?: number
  merchant_name?: string
  items?: any[]
  user_id: string
}

export default function Receipts() {
  const session = useAuth()
  const [receipts, setReceipts] = useState<Receipt[]>([])
  const [loading, setLoading] = useState(true)
  const [drawerVisible, setDrawerVisible] = useState(false)
  const [scanning, setScanning] = useState(false)

  const scheme = useColorScheme() ?? 'light'
  const theme = Colors[scheme]

  useEffect(() => {
    if (session) {
      fetchReceipts()
    }
  }, [session])

  async function fetchReceipts() {
    try {
      setLoading(true)
      if (!session?.user) throw new Error('Not authenticated')

      const { data, error } = await supabase
        .from('receipts')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      setReceipts(data || [])
    } catch (error: any) {
      console.error('Error fetching receipts:', error.message)
      Alert.alert('Error', 'Failed to load receipts')
    } finally {
      setLoading(false)
    }
  }

  async function handleScanReceipt() {
    try {
      setScanning(true)
      setDrawerVisible(false)

      // Request camera permissions
      const { status } = await ImagePicker.requestCameraPermissionsAsync()
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Camera permission is required to scan receipts')
        return
      }

      // Launch camera
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 1,
      })

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return
      }

      const image = result.assets[0]
      
      // TODO: Implement receipt parsing logic here
      // For now, just show an alert
      Alert.alert('Receipt Scanned', 'Receipt parsing will be implemented here')
      
      // After parsing, you would create a receipt in the database
      // await createReceipt(parsedData)
      
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to scan receipt')
    } finally {
      setScanning(false)
    }
  }

  function handleManualInput() {
    setDrawerVisible(false)
    // TODO: Navigate to manual input screen or show modal
    Alert.alert('Manual Input', 'Manual input form will be implemented here')
  }

  function renderReceiptItem({ item }: { item: Receipt }) {
    const date = new Date(item.created_at)
    const formattedDate = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })

    return (
      <Pressable
        style={[styles.receiptItem, { backgroundColor: theme.input }]}
        onPress={() => {
          // TODO: Navigate to receipt detail
          console.log('Receipt pressed:', item.id)
        }}
      >
        <View style={styles.receiptHeader}>
          <View style={styles.receiptInfo}>
            <Text style={[styles.receiptMerchant, { color: theme.text }]}>
              {item.merchant_name || 'Receipt'}
            </Text>
            <Text style={[styles.receiptDate, { color: theme.icon }]}>
              {formattedDate}
            </Text>
          </View>
          {item.total && (
            <Text style={[styles.receiptTotal, { color: Colors.primary }]}>
              ${item.total.toFixed(2)}
            </Text>
          )}
        </View>
        {item.items && item.items.length > 0 && (
          <Text style={[styles.receiptItemsCount, { color: theme.icon }]}>
            {item.items.length} item{item.items.length !== 1 ? 's' : ''}
          </Text>
        )}
      </Pressable>
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.background }]}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Receipts</Text>
        <Pressable
          style={[styles.addButton, { backgroundColor: Colors.primary }]}
          onPress={() => setDrawerVisible(true)}
        >
          <Ionicons name="add" size={24} color="#ffffff" />
        </Pressable>
      </View>

      {/* Receipts List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : receipts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="receipt-outline" size={64} color={theme.icon} />
          <Text style={[styles.emptyText, { color: theme.icon }]}>
            No receipts yet
          </Text>
          <Text style={[styles.emptySubtext, { color: theme.icon }]}>
            Tap the + button to create your first receipt
          </Text>
        </View>
      ) : (
        <FlatList
          data={receipts}
          renderItem={renderReceiptItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Drawer Modal */}
      <Modal
        visible={drawerVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setDrawerVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setDrawerVisible(false)}
        >
          <View
            style={[styles.drawer, { backgroundColor: theme.background }]}
            onStartShouldSetResponder={() => true}
          >
            <View style={[styles.drawerHandle, { backgroundColor: theme.icon }]} />
            
            <Text style={[styles.drawerTitle, { color: theme.text }]}>
              Create New Receipt
            </Text>

            <Pressable
              style={[styles.drawerOption, { backgroundColor: theme.input }]}
              onPress={handleScanReceipt}
              disabled={scanning}
            >
              <View style={styles.drawerOptionContent}>
                <View style={[styles.drawerOptionIcon, { backgroundColor: Colors.primary }]}>
                  <Ionicons name="camera" size={24} color="#ffffff" />
                </View>
                <View style={styles.drawerOptionText}>
                  <Text style={[styles.drawerOptionTitle, { color: theme.text }]}>
                    Scan Receipt
                  </Text>
                  <Text style={[styles.drawerOptionSubtitle, { color: theme.icon }]}>
                    Use your camera to scan and parse receipt
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={theme.icon} />
            </Pressable>

            <Pressable
              style={[styles.drawerOption, { backgroundColor: theme.input }]}
              onPress={handleManualInput}
            >
              <View style={styles.drawerOptionContent}>
                <View style={[styles.drawerOptionIcon, { backgroundColor: Colors.secondary }]}>
                  <Ionicons name="create-outline" size={24} color="#ffffff" />
                </View>
                <View style={styles.drawerOptionText}>
                  <Text style={[styles.drawerOptionTitle, { color: theme.text }]}>
                    Manual Input
                  </Text>
                  <Text style={[styles.drawerOptionSubtitle, { color: theme.icon }]}>
                    Enter receipt items manually
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={theme.icon} />
            </Pressable>

            <Pressable
              style={[styles.drawerCancelButton, { backgroundColor: theme.input }]}
              onPress={() => setDrawerVisible(false)}
            >
              <Text style={[styles.drawerCancelText, { color: theme.text }]}>
                Cancel
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
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
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
  listContainer: {
    padding: 20,
    paddingTop: 10,
  },
  receiptItem: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  receiptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  receiptInfo: {
    flex: 1,
  },
  receiptMerchant: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  receiptDate: {
    fontSize: 13,
    fontWeight: '400',
  },
  receiptTotal: {
    fontSize: 18,
    fontWeight: '700',
  },
  receiptItemsCount: {
    fontSize: 13,
    fontWeight: '400',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  drawer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    maxHeight: '70%',
  },
  drawerHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
    opacity: 0.3,
  },
  drawerTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 24,
  },
  drawerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  drawerOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  drawerOptionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  drawerOptionText: {
    flex: 1,
  },
  drawerOptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  drawerOptionSubtitle: {
    fontSize: 13,
    fontWeight: '400',
  },
  drawerCancelButton: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  drawerCancelText: {
    fontSize: 16,
    fontWeight: '600',
  },
})
