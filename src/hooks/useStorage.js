import { useState, useEffect, useCallback, useRef } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

const STORAGE_KEYS = {
  logs: '@soothe_logs',
  settings: '@soothe_settings',
  pro: '@soothe_pro',
}

export const PRODUCT_IDS = {
  lifetime: 'soothe_lifetime',
}

const defaultSettings = {
  currency: 'INR',
  pricePerStick: 20,
}

const listeners = new Set()

function emitChange() {
  listeners.forEach((fn) => fn())
}

async function getStoredData(key) {
  const raw = await AsyncStorage.getItem(key)
  return raw ? JSON.parse(raw) : null
}

async function storeData(key, value) {
  await AsyncStorage.setItem(key, JSON.stringify(value))
}

export function useStorage() {
  const [logs, setLogs] = useState({})
  const [settings, setSettings] = useState(defaultSettings)
  const [loaded, setLoaded] = useState(false)
  const [isPro, setIsPro] = useState(false)
  const [proChecked, setProChecked] = useState(false)
  const mounted = useRef(true)

  const refresh = useCallback(async () => {
    const storedLogs = await getStoredData(STORAGE_KEYS.logs)
    const storedSettings = await getStoredData(STORAGE_KEYS.settings)
    const storedPro = await getStoredData(STORAGE_KEYS.pro)
    if (mounted.current) {
      setLogs(storedLogs || {})
      setSettings(storedSettings ? { ...defaultSettings, ...storedSettings } : defaultSettings)
      setIsPro(storedPro === true)
      setLoaded(true)
    }
  }, [])

  useEffect(() => {
    refresh()
    listeners.add(refresh)
    return () => {
      mounted.current = false
      listeners.delete(refresh)
    }
  }, [refresh])

  const setPro = useCallback(async (value) => {
    await storeData(STORAGE_KEYS.pro, !!value)
    if (mounted.current) {
      setIsPro(!!value)
      setProChecked(true)
    }
  }, [])

  const markProChecked = useCallback(() => {
    if (mounted.current) setProChecked(true)
  }, [])

  const updateLog = useCallback(async (date, data) => {
    const stored = (await getStoredData(STORAGE_KEYS.logs)) || {}
    const entry = stored[date] || { count: 0 }
    stored[date] = { ...entry, ...data }
    await storeData(STORAGE_KEYS.logs, stored)
    setLogs(stored)
    emitChange()
    return stored[date]
  }, [])

  const getLog = useCallback(
    (date) => logs[date] || { count: 0 },
    [logs]
  )

  const updateSettings = useCallback(async (partial) => {
    const stored = (await getStoredData(STORAGE_KEYS.settings)) || {}
    const merged = { ...defaultSettings, ...stored, ...partial }
    await storeData(STORAGE_KEYS.settings, merged)
    setSettings(merged)
    emitChange()
  }, [])

  const clearAllData = useCallback(async () => {
    try {
      await AsyncStorage.multiRemove([STORAGE_KEYS.logs, STORAGE_KEYS.settings])
      setLogs({})
      setSettings(defaultSettings)
      emitChange()
    } catch (e) {
      console.error('Failed to clear data:', e)
    }
  }, [])

  const getMonthLogs = useCallback(
    (year, month) => {
      const prefix = `${year}-${String(month).padStart(2, '0')}`
      return Object.entries(logs)
        .filter(([date]) => date.startsWith(prefix))
        .reduce((acc, [date, val]) => {
          acc[date] = val
          return acc
        }, {})
    },
    [logs]
  )

  const getMonthlyTotal = useCallback(
    (year, month) => {
      const monthData = getMonthLogs(year, month)
      const { currency, pricePerStick } = settings
      let totalCount = 0
      let totalCost = 0
      Object.values(monthData).forEach((entry) => {
        totalCount += entry.count || 0
        const price = entry.price ?? pricePerStick
        totalCost += (entry.count || 0) * price
      })
      return { totalCount, totalCost, currency }
    },
    [getMonthLogs, settings]
  )

  const getYearProjection = useCallback(
    (year) => {
      const now = new Date()
      const currentYear = now.getFullYear()
      const currentMonth = now.getMonth() + 1
      const monthsElapsed = year === currentYear ? currentMonth : 12

      let yearTotalCount = 0
      let yearTotalCost = 0
      const { currency, pricePerStick } = settings

      for (let m = 1; m <= monthsElapsed; m++) {
        const { totalCount, totalCost } = getMonthlyTotal(year, m)
        yearTotalCount += totalCount
        yearTotalCost += totalCost
      }

      const avgMonthlyCost = monthsElapsed > 0 ? yearTotalCost / monthsElapsed : 0
      const projectedYearCost = avgMonthlyCost * 12
      const avgMonthlyCount = monthsElapsed > 0 ? yearTotalCount / monthsElapsed : 0
      const projectedYearCount = avgMonthlyCount * 12

      return {
        yearTotalCount,
        yearTotalCost,
        avgMonthlyCost,
        projectedYearCost,
        avgMonthlyCount,
        projectedYearCount,
        currency,
        monthsElapsed,
      }
    },
    [getMonthlyTotal, settings]
  )

  return {
    logs,
    settings,
    loaded,
    isPro,
    proChecked,
    setPro,
    markProChecked,
    updateLog,
    getLog,
    updateSettings,
    clearAllData,
    getMonthLogs,
    getMonthlyTotal,
    getYearProjection,
  }
}
