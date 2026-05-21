import { useState, useMemo } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { colors, spacing } from '../theme'
import { useStorage } from '../hooks/useStorage'
import { Ionicons } from '@expo/vector-icons'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export default function AnalyticsScreen() {
  const { settings, getMonthlyTotal, getYearProjection } = useStorage()
  const insets = useSafeAreaInsets()
  const now = new Date()
  const [selectedYear, setSelectedYear] = useState(now.getFullYear())

  const currencySymbol = settings.currency === 'INR' ? '₹' : '$'

  const projection = useMemo(() => getYearProjection(selectedYear), [selectedYear, getYearProjection])

  const monthlyData = useMemo(() => {
    const data = []
    const monthsToShow = selectedYear === now.getFullYear() ? now.getMonth() + 1 : 12
    for (let m = 1; m <= monthsToShow; m++) {
      const { totalCount, totalCost } = getMonthlyTotal(selectedYear, m)
      data.push({ month: m, count: totalCount, cost: totalCost })
    }
    return data
  }, [selectedYear, getMonthlyTotal, now])

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Analytics</Text>
      </View>

      <View style={styles.yearNav}>
        <TouchableOpacity onPress={() => setSelectedYear(selectedYear - 1)} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.yearText}>{selectedYear}</Text>
        <TouchableOpacity
          onPress={() => selectedYear < now.getFullYear() && setSelectedYear(selectedYear + 1)}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-forward" size={24} color={selectedYear < now.getFullYear() ? colors.text : colors.textMuted} />
        </TouchableOpacity>
      </View>

      <View style={styles.projectionCard}>
        <Text style={styles.cardTitle}>Year Projection</Text>
        <View style={styles.projRow}>
          <View style={styles.projItem}>
            <Text style={styles.projLabel}>So far</Text>
            <Text style={styles.projValue}>{currencySymbol}{projection.yearTotalCost.toLocaleString()}</Text>
            <Text style={styles.projSub}>{projection.yearTotalCount} sticks</Text>
          </View>
          <View style={styles.projDivider} />
          <View style={styles.projItem}>
            <Text style={styles.projLabel}>Projected</Text>
            <Text style={[styles.projValue, { color: colors.gold }]}>{currencySymbol}{projection.projectedYearCost.toLocaleString()}</Text>
            <Text style={styles.projSub}>{Math.round(projection.projectedYearCount)} sticks</Text>
          </View>
        </View>
      </View>

      <View style={styles.monthlyHeader}>
        <Text style={styles.cardTitle}>Monthly Breakdown</Text>
      </View>

      <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
        {monthlyData.map((data) => (
          <View key={data.month} style={styles.monthRow}>
            <Text style={styles.monthName}>{MONTHS[data.month - 1]}</Text>
            <View style={styles.monthBar}>
              <View
                style={[
                  styles.barFill,
                  {
                    width: `${Math.min((data.cost / (projection.avgMonthlyCost || 1)) * 100, 100)}%`,
                  },
                ]}
              />
            </View>
            <View style={styles.monthStats}>
              <Text style={styles.monthCost}>{currencySymbol}{data.cost.toLocaleString()}</Text>
              <Text style={styles.monthCount}>{data.count}</Text>
            </View>
          </View>
        ))}
        {monthlyData.length === 0 && (
          <Text style={styles.emptyText}>No data yet this year</Text>
        )}
      </ScrollView>
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
  yearNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
    paddingVertical: spacing.sm,
  },
  yearText: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.text,
  },
  projectionCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    marginVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: {
    fontSize: 12,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: spacing.md,
  },
  projRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  projItem: {
    flex: 1,
    alignItems: 'center',
  },
  projLabel: {
    fontSize: 12,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  projValue: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.primary,
    marginVertical: spacing.xs,
  },
  projSub: {
    fontSize: 13,
    color: colors.textDim,
  },
  projDivider: {
    width: 1,
    height: 60,
    backgroundColor: colors.border,
    marginHorizontal: spacing.md,
  },
  monthlyHeader: {
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  list: {
    flex: 1,
  },
  monthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  monthName: {
    width: 36,
    fontSize: 13,
    color: colors.textDim,
    fontWeight: '600',
  },
  monthBar: {
    flex: 1,
    height: 8,
    backgroundColor: colors.surfaceLight,
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  monthStats: {
    width: 80,
    alignItems: 'flex-end',
  },
  monthCost: {
    fontSize: 13,
    color: colors.text,
    fontWeight: '600',
  },
  monthCount: {
    fontSize: 11,
    color: colors.textMuted,
  },
  emptyText: {
    textAlign: 'center',
    color: colors.textMuted,
    paddingVertical: spacing.xl,
  },
})
