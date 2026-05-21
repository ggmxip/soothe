import { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Alert, TextInput } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { colors, spacing } from '../theme'
import { useStorage } from '../hooks/useStorage'
import { Ionicons } from '@expo/vector-icons'

export default function SettingsScreen() {
  const { settings, updateSettings, clearAllData } = useStorage()
  const insets = useSafeAreaInsets()
  const [priceInput, setPriceInput] = useState(String(settings.pricePerStick))

  const currencySymbol = settings.currency === 'INR' ? '₹' : '$'

  const handlePriceChange = (text) => {
    setPriceInput(text)
  }

  const handlePriceSave = async () => {
    const price = Number(priceInput) || 0
    if (price <= 0) {
      Alert.alert('Invalid price', 'Please enter a valid price')
      return
    }
    setPriceInput(String(price))
    await updateSettings({ pricePerStick: price })
  }

  const toggleCurrency = async () => {
    const newCurrency = settings.currency === 'INR' ? 'USD' : 'INR'
    await updateSettings({ currency: newCurrency })
  }

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all your logs and reset settings.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: clearAllData },
      ]
    )
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Currency</Text>
        <TouchableOpacity style={styles.row} onPress={toggleCurrency} activeOpacity={0.7}>
          <View style={styles.rowLeft}>
            <Ionicons name="cash-outline" size={22} color={colors.textDim} />
            <Text style={styles.rowLabel}>Default currency</Text>
          </View>
          <View style={styles.rowRight}>
            <Text style={styles.rowValue}>{settings.currency}</Text>
            <Ionicons name="swap-horizontal" size={18} color={colors.textMuted} />
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Default Price</Text>
        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Ionicons name="pricetag-outline" size={22} color={colors.textDim} />
            <Text style={styles.rowLabel}>Price per stick</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.currencySymbol}>{currencySymbol}</Text>
            <TextInput
              style={styles.priceInput}
              value={priceInput}
              onChangeText={handlePriceChange}
              onBlur={handlePriceSave}
              keyboardType="numeric"
              placeholderTextColor={colors.textMuted}
              placeholder="0"
            />
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data</Text>
        <TouchableOpacity style={styles.row} onPress={handleClearData} activeOpacity={0.7}>
          <View style={styles.rowLeft}>
            <Ionicons name="trash-outline" size={22} color={colors.primary} />
            <Text style={[styles.rowLabel, { color: colors.primary }]}>Clear all data</Text>
          </View>
          <Ionicons name="warning-outline" size={18} color={colors.primaryDim} />
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Soothe</Text>
        <Text style={styles.footerVersion}>v1.0.2</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingHorizontal: spacing.md,
  },
  header: {
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 4,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 12,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: spacing.sm,
    paddingLeft: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  rowLabel: {
    fontSize: 15,
    color: colors.text,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  rowValue: {
    fontSize: 15,
    color: colors.textDim,
    fontWeight: '600',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  currencySymbol: {
    color: colors.textDim,
    fontSize: 18,
  },
  priceInput: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'right',
    minWidth: 60,
  },
  footer: {
    marginTop: 'auto',
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  footerText: {
    fontSize: 18,
    color: colors.textMuted,
    fontWeight: '600',
    letterSpacing: 2,
  },
  footerVersion: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
})
