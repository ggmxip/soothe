import { useCallback, useEffect, useState, useRef } from 'react'
import { Platform } from 'react-native'
import { useStorage, PRODUCT_IDS } from './useStorage'

const isWeb = Platform.OS === 'web'
const isNative = Platform.OS === 'ios' || Platform.OS === 'android'

export function usePro() {
  const { isPro, setPro, proChecked, markProChecked } = useStorage()
  const [purchasing, setPurchasing] = useState(false)
  const [restoreInFlight, setRestoreInFlight] = useState(false)
  const [error, setError] = useState(null)
  const iapRef = useRef(null)

  useEffect(() => {
    if (isWeb) {
      markProChecked()
      return
    }
    if (!isNative) {
      markProChecked()
      return
    }

    let cancelled = false
    let purchaseUpdateSub = null
    let purchaseErrorSub = null

    ;(async () => {
      try {
        const iap = await import('expo-iap')
        iapRef.current = iap

        if (cancelled) return

        purchaseUpdateSub = iap.purchaseUpdatedListener(async (purchase) => {
          if (purchase?.productId === PRODUCT_IDS.lifetime) {
            try {
              await setPro(true)
              await iap.finishTransaction({ purchase, isConsumable: false })
              setError(null)
            } catch (e) {
              setError('Purchase received. If the unlock does not appear, tap Restore purchases once.')
            }
          }
        })

        purchaseErrorSub = iap.purchaseErrorListener((err) => {
          if (err?.code === 'UserCancelled' || err?.code === 'E_USER_CANCELLED') {
            return
          }
          setError(err?.message || 'Purchase failed.')
        })

        const connected = await iap.initConnection()
        if (cancelled) return

        if (connected) {
          try {
            const purchases = await iap.getAvailablePurchases({
              alsoPublishToEventListenerIOS: false,
              onlyIncludeActiveItemsIOS: true,
            })
            const owned = purchases.some(
              (p) => p?.productId === PRODUCT_IDS.lifetime
            )
            if (owned) {
              await setPro(true)
            } else if (!proChecked) {
              markProChecked()
            }
          } catch (e) {
            if (!proChecked) markProChecked()
          }
        } else if (!proChecked) {
          markProChecked()
        }
      } catch (e) {
        if (!proChecked) markProChecked()
      }
    })()

    return () => {
      cancelled = true
      try {
        purchaseUpdateSub?.remove?.()
      } catch {}
      try {
        purchaseErrorSub?.remove?.()
      } catch {}
      if (iapRef.current) {
        iapRef.current.endConnection().catch(() => {})
      }
    }
  }, [markProChecked, setPro])

  const purchase = useCallback(async () => {
    if (isWeb) {
      setError('Purchases are only available on iOS and Android.')
      return false
    }
    const iap = iapRef.current
    if (!iap) {
      setError('Store is not ready. Please try again in a moment.')
      return false
    }
    setPurchasing(true)
    setError(null)
    try {
      await iap.requestPurchase({
        request: {
          apple: { sku: PRODUCT_IDS.lifetime },
          google: { skus: [PRODUCT_IDS.lifetime] },
        },
        type: 'in-app',
      })
      return true
    } catch (e) {
      const code = e?.code
      if (code === 'UserCancelled' || code === 'E_USER_CANCELLED') {
        return false
      }
      setError(e?.message || 'Purchase failed.')
      return false
    } finally {
      setPurchasing(false)
    }
  }, [])

  const restore = useCallback(async () => {
    if (isWeb) {
      setError('Restore is only available on iOS and Android.')
      return false
    }
    const iap = iapRef.current
    if (!iap) {
      setError('Store is not ready. Please try again in a moment.')
      return false
    }
    setRestoreInFlight(true)
    setError(null)
    try {
      await iap.restorePurchases()
      const purchases = await iap.getAvailablePurchases({
        alsoPublishToEventListenerIOS: false,
        onlyIncludeActiveItemsIOS: true,
      })
      const owned = purchases.some(
        (p) => p?.productId === PRODUCT_IDS.lifetime
      )
      if (owned) {
        await setPro(true)
        return true
      }
      setError('No previous purchase found for this account.')
      return false
    } catch (e) {
      setError(e?.message || 'Restore failed.')
      return false
    } finally {
      setRestoreInFlight(false)
    }
  }, [setPro])

  const clearError = useCallback(() => setError(null), [])

  return {
    isPro,
    proChecked,
    purchasing,
    restoreInFlight,
    error,
    purchase,
    restore,
    clearError,
  }
}
