import { useState, useCallback } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { colors, spacing } from '../theme'
import { useStorage } from '../hooks/useStorage'
import { Ionicons } from '@expo/vector-icons'

export default function HomeScreen() {
  const { updateLog, getLog, settings, updateSettings } = useStorage()
  const insets = useSafeAreaInsets()
  const today = new Date()
  const dateKey = today.toISOString().split('T')[0]
  const entry = getLog(dateKey)
  const [count, setCount] = useState(entry.count || 0)
  const [priceInput, setPriceInput] = useState(String(entry.price ?? settings.pricePerStick))
  const saved = entry.count > 0

  const handleAdd = useCallback(async () => {
    const newCount = count + 1
    setCount(newCount)
    await updateLog(dateKey, { count: newCount, price: Number(priceInput) || settings.pricePerStick })
  }, [count, dateKey, priceInput, settings.pricePerStick, updateLog])

  const handleSubtract = useCallback(async () => {
    if (count <= 0) return
    const newCount = count - 1
    setCount(newCount)
    await updateLog(dateKey, { count: newCount > 0 ? newCount : 0, price: Number(priceInput) || settings.pricePerStick })
  }, [count, dateKey, priceInput, settings.pricePerStick, updateLog])

  const handlePriceChange = useCallback(
    (text) => {
      setPriceInput(text)
    },
    []
  )

  const handlePriceBlur = useCallback(async () => {
    const price = Number(priceInput) || settings.pricePerStick
    setPriceInput(String(price))
    if (count > 0) {
      await updateLog(dateKey, { count, price })
    }
  }, [priceInput, settings.pricePerStick, count, dateKey, updateLog])

  const toggleCurrency = useCallback(async () => {
    const newCurrency = settings.currency === 'INR' ? 'USD' : 'INR'
    await updateSettings({ currency: newCurrency })
  }, [settings.currency, updateSettings])

  const currencySymbol = settings.currency === 'INR' ? '₹' : '$'
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.appName}>Soothe</Text>
      </View>

      <View style={styles.dateRow}>
        <Text style={styles.dayName}>{dayNames[today.getDay()]}</Text>
        <Text style={styles.fullDate}>
          {monthNames[today.getMonth()]} {today.getDate()}, {today.getFullYear()}
        </Text>
      </View>

      <View style={styles.counterSection}>
        <Text style={styles.counterLabel}>Sticks Today</Text>
        <Text style={styles.counterValue}>{count}</Text>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.subBtn} onPress={handleSubtract} activeOpacity={0.7}>
            <Ionicons name="remove" size={28} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.addBtn} onPress={handleAdd} activeOpacity={0.7}>
            <Ionicons name="add" size={28} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.priceSection}>
        <Text style={styles.sectionLabel}>Price per stick</Text>
        <View style={styles.priceRow}>
          <TouchableOpacity style={styles.currencyToggle} onPress={toggleCurrency} activeOpacity={0.7}>
            <Text style={styles.currencyText}>{settings.currency}</Text>
            <Ionicons name="swap-horizontal" size={16} color={colors.textDim} />
          </TouchableOpacity>
          <Text style={styles.currencySymbol}>{currencySymbol}</Text>
          <TextInput
            style={styles.priceInput}
            value={priceInput}
            onChangeText={handlePriceChange}
            onBlur={handlePriceBlur}
            keyboardType="numeric"
            placeholderTextColor={colors.textMuted}
            placeholder="0"
          />
        </View>
      </View>

      {count > 0 && (
        <View style={styles.totalSection}>
          <Text style={styles.totalLabel}>Today's total</Text>
          <Text style={styles.totalValue}>
            {currencySymbol}{(count * (Number(priceInput) || settings.pricePerStick)).toLocaleString()}
          </Text>
          <Text style={styles.totalSticks}>{count} stick{count !== 1 ? 's' : ''}</Text>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingHorizontal: spacing.lg,
  },
  header: {
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  appName: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 4,
  },
  dateRow: {
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  dayName: {
    fontSize: 18,
    color: colors.textDim,
    fontWeight: '500',
  },
  fullDate: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  counterSection: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  counterLabel: {
    fontSize: 14,
    color: colors.textDim,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  counterValue: {
    fontSize: 96,
    fontWeight: '300',
    color: colors.text,
    marginVertical: spacing.md,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  subBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  addBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  priceSection: {
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  sectionLabel: {
    fontSize: 12,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: spacing.sm,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  currencyToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  currencyText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  currencySymbol: {
    color: colors.textDim,
    fontSize: 20,
  },
  priceInput: {
    flex: 1,
    backgroundColor: colors.surface,
    color: colors.text,
    fontSize: 20,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  totalSection: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: 'auto',
  },
  totalLabel: {
    fontSize: 12,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  totalValue: {
    fontSize: 36,
    fontWeight: '700',
    color: colors.primary,
    marginVertical: spacing.xs,
  },
  totalSticks: {
    fontSize: 14,
    color: colors.textDim,
  },
})
