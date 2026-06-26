import { useState } from 'react'
import { View, Text, StyleSheet, Alert } from 'react-native'
import { CameraView, useCameraPermissions } from 'expo-camera'
import * as SecureStore from 'expo-secure-store'

interface QRScannerProps {
  onScanned: (userId: string, sprintId: string | null) => void
}

export default function QRScanner({ onScanned }: QRScannerProps) {
  const [permission, requestPermission] = useCameraPermissions()
  const [scanned, setScanned] = useState(false)

  if (!permission) return <View style={styles.container} />

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Accès à la caméra requis</Text>
        <Text style={styles.link} onPress={requestPermission}>
          Autoriser
        </Text>
      </View>
    )
  }

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (scanned) return
    setScanned(true)

    try {
      const parsed = JSON.parse(data)
      const { userId, sprintId } = parsed

      if (!userId) throw new Error('QR invalide')

      // Stocker de façon sécurisée
      await SecureStore.setItemAsync('lonara_userId', userId)
      await SecureStore.setItemAsync('lonara_sprintId', sprintId ?? '')

      onScanned(userId, sprintId ?? null)

    } catch {
      Alert.alert('QR invalide', 'Scannez le QR code depuis My Fuel sur votre desktop.')
      setTimeout(() => setScanned(false), 2000)
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>LONARA</Text>
        <Text style={styles.subtitle}>MY FUEL</Text>
      </View>

      <View style={styles.scannerWrapper}>
        <CameraView
          style={styles.camera}
          facing="back"
          onBarcodeScanned={handleBarCodeScanned}
          barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        />
        {/* Cadre de scan */}
        <View style={styles.overlay}>
          <View style={styles.frame}>
            <View style={[styles.corner, styles.cornerTL]} />
            <View style={[styles.corner, styles.cornerTR]} />
            <View style={[styles.corner, styles.cornerBL]} />
            <View style={[styles.corner, styles.cornerBR]} />
          </View>
        </View>
      </View>

      <Text style={styles.instruction}>
        Scannez le QR code depuis{'\n'}My Fuel → Connect Phone
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 60,
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
  scannerWrapper: {
    width: 280,
    height: 280,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  camera: { flex: 1 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  frame: { width: 220, height: 220, position: 'relative' },
  corner: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderColor: '#3DD4A0',
    borderWidth: 2,
  },
  cornerTL: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0 },
  cornerTR: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0 },
  cornerBL: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0 },
  cornerBR: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0 },
  text: { color: '#EAE4D5', fontSize: 16, textAlign: 'center' },
  link: { color: '#3DD4A0', fontSize: 14, marginTop: 12 },
  instruction: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
  },
})