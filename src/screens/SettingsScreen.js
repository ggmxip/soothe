import { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Modal, ActivityIndicator } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { colors, spacing } from '../theme'
import { useStorage } from '../hooks/useStorage'
import { usePro } from '../hooks/usePro'
import { Ionicons } from '@expo/vector-icons'

export default function SettingsScreen() {
  const { settings, updateSettings, clearAllData, isPro } = useStorage()
  const { restore, restoreInFlight, error: proError, clearError: clearProError } = usePro()
  const insets = useSafeAreaInsets()
  const [priceInput, setPriceInput] = useState(String(settings.pricePerStick))
  const [showModal, setShowModal] = useState(false)
  const [restoreMessage, setRestoreMessage] = useState(null)

  const currencySymbol = settings.currency === 'INR' ? '₹' : '$'

  const handlePriceChange = (text) => {
    setPriceInput(text)
  }

  const handlePriceSave = async () => {
    const price = Number(priceInput) || 0
    if (price <= 0) {
      setPriceInput(String(settings.pricePerStick))
      return
    }
    setPriceInput(String(price))
    await updateSettings({ pricePerStick: price })
  }

  const toggleCurrency = async () => {
    const newCurrency = settings.currency === 'INR' ? 'USD' : 'INR'
    await updateSettings({ currency: newCurrency })
  }

  const handleConfirmDelete = async () => {
    setShowModal(false)
    await clearAllData()
  }

  const handleRestore = async () => {
    if (proError) clearProError()
    setRestoreMessage(null)
    const ok = await restore()
    if (ok) {
      setRestoreMessage('Lifetime unlocked. Thanks!')
    } else if (!proError) {
      setRestoreMessage('No previous purchase found for this account.')
    }
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Ionicons
              name={isPro ? 'shield-checkmark' : 'lock-closed-outline'}
              size={22}
              color={isPro ? colors.green : colors.textDim}
            />
            <View>
              <Text style={styles.rowLabel}>{isPro ? 'Soothe Pro' : 'Free preview'}</Text>
              <Text style={styles.rowSubLabel}>
                {isPro ? 'Lifetime unlocked' : 'One-time $4.99 unlock'}
              </Text>
            </View>
          </View>
          {isPro ? (
            <View style={styles.proBadge}>
              <Text style={styles.proBadgeText}>PRO</Text>
            </View>
          ) : null}
        </View>
        {!isPro ? (
          <TouchableOpacity
            style={[styles.row, styles.restoreRow]}
            onPress={handleRestore}
            disabled={restoreInFlight}
            activeOpacity={0.7}
          >
            <View style={styles.rowLeft}>
              <Ionicons name="refresh-outline" size={20} color={colors.textDim} />
              <Text style={styles.rowLabel}>Restore purchases</Text>
            </View>
            {restoreInFlight ? (
              <ActivityIndicator color={colors.textDim} size="small" />
            ) : (
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            )}
          </TouchableOpacity>
        ) : null}
        {restoreMessage ? (
          <Text style={styles.restoreMessage}>{restoreMessage}</Text>
        ) : null}
        {proError ? (
          <Text style={styles.restoreError}>{proError}</Text>
        ) : null}
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
              maxLength={10}
              placeholderTextColor={colors.textMuted}
              placeholder="0"
            />
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data</Text>
        <TouchableOpacity style={styles.row} onPress={() => setShowModal(true)} activeOpacity={0.7}>
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

      <Modal visible={showModal} transparent animationType="fade" onRequestClose={() => setShowModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Ionicons name="warning" size={48} color={colors.primary} style={{ marginBottom: spacing.md }} />
            <Text style={styles.modalTitle}>Clear All Data?</Text>
            <Text style={styles.modalText}>
              This will permanently delete all your logs and reset settings. This action cannot be undone.
            </Text>
            <Text style={styles.modalFootnote}>
              Your Soothe Pro unlock is stored with the App Store / Play Store and will be restored automatically.
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalNoBtn} onPress={() => setShowModal(false)} activeOpacity={0.7}>
                <Text style={styles.modalNoText}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalYesBtn} onPress={handleConfirmDelete} activeOpacity={0.7}>
                <Text style={styles.modalYesText}>Yes, clear everything</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    width: '100%',
    maxWidth: 340,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  modalText: {
    fontSize: 14,
    color: colors.textDim,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  modalFootnote: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 17,
    marginBottom: spacing.lg,
  },
  modalActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    width: '100%',
  },
  modalNoBtn: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: 12,
    backgroundColor: colors.surfaceLight,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalNoText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  modalYesBtn: {
    flex: 2,
    paddingVertical: spacing.md,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
  },
  modalYesText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  rowSubLabel: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  proBadge: {
    backgroundColor: colors.green,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 6,
  },
  proBadgeText: {
    color: colors.bg,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  restoreRow: {
    marginTop: spacing.sm,
  },
  restoreMessage: {
    fontSize: 12,
    color: colors.green,
    marginTop: spacing.sm,
    paddingLeft: spacing.xs,
  },
  restoreError: {
    fontSize: 12,
    color: colors.primary,
    marginTop: spacing.sm,
    paddingLeft: spacing.xs,
  },
})
