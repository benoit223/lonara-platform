import { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native'
import * as LocalAuthentication from 'expo-local-authentication'

interface FaceAuthProps {
  onAuthenticated: () => void
}

export default function FaceAuth({ onAuthenticated }: FaceAuthProps) {
  const [status, setStatus] = useState<'idle' | 'authenticating' | 'failed'>('idle')
  const [supported, setSupported] = useState(true)

  useEffect(() => {
    checkSupport()
  }, [])

  const checkSupport = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync()
    const enrolled = await LocalAuthentication.isEnrolledAsync()
    if (!compatible || !enrolled) {
      setSupported(false)
      // Si pas de biométrie disponible, passe directement
      onAuthenticated()
    } else {
      authenticate()
    }
  }

  const authenticate = async () => {
    setStatus('authenticating')
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Vérification Lonara',
        fallbackLabel: 'Utiliser le code',
        cancelLabel: 'Annuler',
        disableDeviceFallback: false,
      })

      if (result.success) {
        onAuthenticated()
      } else {
        setStatus('failed')
      }
    } catch {
      setStatus('failed')
    }
  }

  return (
    <View style={styles.container}>
      {/* Logo */}
      <View style={styles.header}>
        <Text style={styles.logo}>LONARA</Text>
        <Text style={styles.subtitle}>MY FUEL</Text>
      </View>

      {/* Cercle biométrie */}
      <View style={styles.circle}>
        <View style={styles.circleGlow} />
        <View style={styles.circleInner}>
          {status === 'authenticating' ? (
            <ActivityIndicator color="#3DD4A0" size="large" />
          ) : (
            <Text style={styles.faceIcon}>
              {status === 'failed' ? '✕' : '⬡'}
            </Text>
          )}
        </View>
      </View>

      {/* Message */}
      <View style={styles.messageArea}>
        {status === 'idle' && (
          <Text style={styles.message}>Authentification requise</Text>
        )}
        {status === 'authenticating' && (
          <Text style={styles.message}>Vérification en cours...</Text>
        )}
        {status === 'failed' && (
          <>
            <Text style={styles.messageFailed}>Échec de l'authentification</Text>
            <TouchableOpacity style={styles.retryBtn} onPress={authenticate}>
              <Text style={styles.retryText}>Réessayer</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 80,
  },
  header: { alignItems: 'center' },
  logo: {
    color: '#EAE4D5',
    fontSize: 28,
    letterSpacing: 8,
    fontWeight: '300',
  },
  subtitle: {
    color: '#3DD4A0',
    fontSize: 11,
    letterSpacing: 6,
    marginTop: 4,
    opacity: 0.8,
  },
  circle: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleGlow: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(61,212,160,0.06)',
  },
  circleInner: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 2,
    borderColor: '#3DD4A0',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(2,9,11,0.95)',
  },
  faceIcon: {
    fontSize: 52,
    color: '#3DD4A0',
  },
  messageArea: { alignItems: 'center', gap: 16 },
  message: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 14,
    letterSpacing: 1,
  },
  messageFailed: {
    color: '#E24B4A',
    fontSize: 14,
  },
  retryBtn: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'rgba(61,212,160,0.4)',
  },
  retryText: {
    color: '#3DD4A0',
    fontSize: 13,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
})