import { View, ActivityIndicator, StyleSheet } from 'react-native'
import { usePro } from '../hooks/usePro'
import { colors } from '../theme'
import PaywallScreen from '../screens/PaywallScreen'

export default function ProGate({ children }) {
  const { isPro, proChecked } = usePro()

  if (!proChecked) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    )
  }

  if (!isPro) {
    return <PaywallScreen />
  }

  return children
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
