import { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Linking,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { colors, spacing } from '../theme'
import { usePro } from '../hooks/usePro'

const PRIVACY_URL = 'https://soothe.app/privacy'
const SUPPORT_EMAIL = 'mailto:adityaishan.dev@gmail.com'

export default function PaywallScreen() {
  const insets = useSafeAreaInsets()
  const { isPro, purchasing, restoreInFlight, error, purchase, restore, clearError } = usePro()
  // __DEV__ is replaced with `false` at bundle time in EAS production builds,
  // so the dev banner never ships to the App Store / Play Store. It only
  // appears in `npx expo start --web` and internal EAS dev builds.
  const [showSkipBanner, setShowSkipBanner] = useState(__DEV__ && !isPro)

  if (isPro) return null

  const handlePurchase = async () => {
    if (error) clearError()
    await purchase()
  }

  const handleRestore = async () => {
    if (error) clearError()
    await restore()
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.logoCircle}>
            <Ionicons name="flame" size={36} color={colors.primary} />
          </View>
          <Text style={styles.title}>Soothe</Text>
          <Text style={styles.subtitle}>
            A private, on-device tracker for daily habits and money spent.
          </Text>
        </View>

        <View style={styles.features}>
          <Feature
            icon="lock-closed-outline"
            title="100% on-device"
            body="No accounts, no ads, no servers. Your data never leaves your phone."
          />
          <Feature
            icon="calendar-outline"
            title="Calendar + analytics"
            body="See every day you've tracked, monthly totals, and a yearly projection."
          />
          <Feature
            icon="cash-outline"
            title="Multi-currency"
            body="Toggle between INR, USD, and other currencies. Localised number formatting."
          />
        </View>

        <View style={styles.priceCard}>
          <Text style={styles.priceLabel}>One-time purchase</Text>
          <View style={styles.priceRow}>
            <Text style={styles.currency}>$</Text>
            <Text style={styles.priceAmount}>4.99</Text>
          </View>
          <Text style={styles.priceFine}>Unlock forever. No subscription.</Text>

          <TouchableOpacity
            style={[styles.cta, purchasing && styles.ctaDisabled]}
            onPress={handlePurchase}
            disabled={purchasing}
            activeOpacity={0.8}
          >
            {purchasing ? (
              <ActivityIndicator color={colors.text} />
            ) : (
              <Text style={styles.ctaText}>Unlock for $4.99</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.restore}
            onPress={handleRestore}
            disabled={restoreInFlight}
            activeOpacity={0.7}
          >
            {restoreInFlight ? (
              <ActivityIndicator color={colors.textDim} size="small" />
            ) : (
              <Text style={styles.restoreText}>Restore purchases</Text>
            )}
          </TouchableOpacity>
        </View>

        {error ? (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle-outline" size={18} color={colors.primary} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {showSkipBanner ? (
          <View style={styles.devBanner}>
            <Text style={styles.devBannerTitle}>Dev / Web preview</Text>
            <Text style={styles.devBannerText}>
              In-app purchases need a real iOS or Android build.
            </Text>
            <Text style={styles.devBannerText}>
              This is a UI preview only. Test the purchase flow on an EAS dev build.
            </Text>
            <TouchableOpacity
              style={styles.devSkip}
              onPress={() => setShowSkipBanner(false)}
              activeOpacity={0.7}
            >
              <Text style={styles.devSkipText}>Hide this notice</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        <View style={styles.footer}>
          <TouchableOpacity onPress={() => Linking.openURL(PRIVACY_URL)} activeOpacity={0.7}>
            <Text style={styles.footerLink}>Privacy policy</Text>
          </TouchableOpacity>
          <Text style={styles.footerDot}>·</Text>
          <TouchableOpacity onPress={() => Linking.openURL(SUPPORT_EMAIL)} activeOpacity={0.7}>
            <Text style={styles.footerLink}>Support</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  )
}

function Feature({ icon, title, body }) {
  return (
    <View style={styles.featureRow}>
      <View style={styles.featureIcon}>
        <Ionicons name={icon} size={22} color={colors.primary} />
      </View>
      <View style={styles.featureText}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureBody}>{body}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  header: {
    alignItems: 'center',
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
  },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 4,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textDim,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 320,
  },
  features: {
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    flex: 1,
    paddingTop: 2,
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  featureBody: {
    fontSize: 13,
    color: colors.textDim,
    lineHeight: 18,
  },
  priceCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: spacing.lg,
    marginTop: spacing.md,
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 12,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  currency: {
    fontSize: 28,
    fontWeight: '600',
    color: colors.text,
    marginTop: 8,
  },
  priceAmount: {
    fontSize: 64,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -2,
  },
  priceFine: {
    fontSize: 13,
    color: colors.textDim,
    marginBottom: spacing.lg,
  },
  cta: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  ctaDisabled: {
    opacity: 0.6,
  },
  ctaText: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  restore: {
    paddingVertical: spacing.md,
  },
  restoreText: {
    color: colors.textDim,
    fontSize: 14,
    fontWeight: '600',
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderColor: colors.primary,
    borderWidth: 1,
    borderRadius: 10,
    padding: spacing.md,
    marginTop: spacing.md,
  },
  errorText: {
    flex: 1,
    color: colors.text,
    fontSize: 13,
    lineHeight: 18,
  },
  devBanner: {
    marginTop: spacing.lg,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 10,
    padding: spacing.md,
  },
  devBannerTitle: {
    color: colors.gold,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: spacing.xs,
  },
  devBannerText: {
    color: colors.textDim,
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 4,
  },
  devSkip: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
  },
  devSkipText: {
    color: colors.textMuted,
    fontSize: 12,
    textDecorationLine: 'underline',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xl,
    gap: spacing.sm,
  },
  footerLink: {
    color: colors.textMuted,
    fontSize: 12,
    textDecorationLine: 'underline',
  },
  footerDot: {
    color: colors.textMuted,
    fontSize: 12,
  },
})
