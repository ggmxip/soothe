import { useState, useMemo } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { colors, spacing } from '../theme'
import { useStorage } from '../hooks/useStorage'
import { Ionicons } from '@expo/vector-icons'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

export default function CalendarScreen() {
  const { logs, updateLog, getLog, settings } = useStorage()
  const insets = useSafeAreaInsets()
  const now = new Date()
  const [viewYear, setViewYear] = useState(now.getFullYear())
  const [viewMonth, setViewMonth] = useState(now.getMonth())
  const [selectedDate, setSelectedDate] = useState(now.toISOString().split('T')[0])

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const firstDay = new Date(viewYear, viewMonth, 1).getDay()

  const currencySymbol = settings.currency === 'INR' ? '₹' : '$'

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewYear(viewYear - 1)
      setViewMonth(11)
    } else {
      setViewMonth(viewMonth - 1)
    }
  }

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewYear(viewYear + 1)
      setViewMonth(0)
    } else {
      setViewMonth(viewMonth + 1)
    }
  }

  const handleDayPress = (day) => {
    const d = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    setSelectedDate(d)
  }

  const handleIncrement = async (date) => {
    const entry = getLog(date)
    const newCount = (entry.count || 0) + 1
    await updateLog(date, { count: newCount, price: entry.price ?? settings.pricePerStick })
  }

  const handleDecrement = async (date) => {
    const entry = getLog(date)
    if (!entry.count) return
    const newCount = entry.count - 1
    await updateLog(date, { count: newCount > 0 ? newCount : 0, price: entry.price ?? settings.pricePerStick })
  }

  const calendarDays = useMemo(() => {
    const days = []
    for (let i = 0; i < firstDay; i++) {
      days.push(null)
    }
    for (let d = 1; d <= daysInMonth; d++) {
      days.push(d)
    }
    return days
  }, [firstDay, daysInMonth])

  const selectedEntry = getLog(selectedDate)

  const monthLogs = useMemo(() => {
    const prefix = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}`
    return Object.entries(logs)
      .filter(([date]) => date.startsWith(prefix))
      .reduce((acc, [date, val]) => {
        acc[date] = val
        return acc
      }, {})
  }, [logs, viewYear, viewMonth])

  const monthTotal = useMemo(() => {
    let count = 0
    let cost = 0
    Object.values(monthLogs).forEach((entry) => {
      const c = entry.count || 0
      count += c
      cost += c * (entry.price ?? settings.pricePerStick)
    })
    return { count, cost }
  }, [monthLogs, settings.pricePerStick])

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Calendar</Text>
      </View>

      <View style={styles.monthNav}>
        <TouchableOpacity onPress={prevMonth} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.monthTitle}>
          {MONTHS[viewMonth]} {viewYear}
        </Text>
        <TouchableOpacity onPress={nextMonth} activeOpacity={0.7}>
          <Ionicons name="chevron-forward" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.weekdayRow}>
        {WEEKDAYS.map((d, i) => (
          <Text key={i} style={styles.weekday}>{d}</Text>
        ))}
      </View>

      <View style={styles.grid}>
        {calendarDays.map((day, i) => {
          if (!day) {
            return <View key={`e${i}`} style={styles.dayCell} />
          }
          const d = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
          const entry = monthLogs[d]
          const isToday = d === new Date().toISOString().split('T')[0]
          const isSelected = d === selectedDate
          return (
            <TouchableOpacity
              key={d}
              style={[
                styles.dayCell,
                isSelected && styles.selectedDay,
              ]}
              onPress={() => handleDayPress(day)}
              activeOpacity={0.7}
            >
              <Text style={[styles.dayNum, isToday && styles.todayNum]}>{day}</Text>
              {entry?.count > 0 && (
                <Text style={styles.dayCount}>{entry.count}</Text>
              )}
            </TouchableOpacity>
          )
        })}
      </View>

      <View style={styles.detailCard}>
        <Text style={styles.detailDate}>
          {selectedDate ? formatDate(selectedDate) : 'Select a date'}
        </Text>
        {selectedDate && (
          <View style={styles.detailControls}>
            <TouchableOpacity style={styles.detailSubBtn} onPress={() => handleDecrement(selectedDate)} activeOpacity={0.7}>
              <Ionicons name="remove" size={22} color={colors.text} />
            </TouchableOpacity>
            <View style={styles.detailInfo}>
              <Text style={styles.detailCount}>{selectedEntry.count || 0} sticks</Text>
              <Text style={styles.detailCost}>
                {currencySymbol}{((selectedEntry.count || 0) * (selectedEntry.price ?? settings.pricePerStick)).toLocaleString()}
              </Text>
            </View>
            <TouchableOpacity style={styles.detailAddBtn} onPress={() => handleIncrement(selectedDate)} activeOpacity={0.7}>
              <Ionicons name="add" size={22} color={colors.text} />
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.monthTotal}>
        <Text style={styles.monthTotalLabel}>Month total</Text>
        <Text style={styles.monthTotalCount}>{monthTotal.count} sticks</Text>
        <Text style={styles.monthTotalCost}>{currencySymbol}{monthTotal.cost.toLocaleString()}</Text>
      </View>
    </View>
  )
}

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  return `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`
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
  monthNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
  },
  monthTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
  },
  weekdayRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  weekday: {
    width: 40,
    textAlign: 'center',
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingVertical: spacing.xs,
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  selectedDay: {
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  dayNum: {
    fontSize: 14,
    color: colors.text,
  },
  todayNum: {
    color: colors.primary,
    fontWeight: '700',
  },
  dayCount: {
    fontSize: 10,
    color: colors.textDim,
    marginTop: 1,
  },
  detailCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    marginTop: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  detailDate: {
    fontSize: 14,
    color: colors.textDim,
    marginBottom: spacing.sm,
  },
  detailControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  detailSubBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  detailInfo: {
    alignItems: 'center',
  },
  detailCount: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.text,
  },
  detailCost: {
    fontSize: 14,
    color: colors.textDim,
    marginTop: 2,
  },
  detailAddBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthTotal: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    marginTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  monthTotalLabel: {
    fontSize: 12,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  monthTotalCount: {
    fontSize: 14,
    color: colors.textDim,
  },
  monthTotalCost: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
  },
})
