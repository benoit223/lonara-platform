import { useState, useEffect } from 'react'
import { StatusBar } from 'expo-status-bar'
import * as SecureStore from 'expo-secure-store'
import * as Notifications from 'expo-notifications'

import QRScanner from './components/QRScanner'
import FaceAuth from './components/FaceAuth'
import CameraScreen from './components/CameraScreen'
import Settings from './components/Settings'

type Screen = 'qr' | 'face' | 'camera' | 'settings'

// Config notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
})

export default function App() {
  const [screen, setScreen] = useState<Screen>('qr')
  const [userId, setUserId] = useState<string | null>(null)
  const [sprintId, setSprintId] = useState<string | null>(null)

  useEffect(() => {
    checkStoredCredentials()
    requestNotificationPermission()
  }, [])

  const checkStoredCredentials = async () => {
    const storedUserId = await SecureStore.getItemAsync('lonara_userId')
    const storedSprintId = await SecureStore.getItemAsync('lonara_sprintId')
    if (storedUserId) {
      setUserId(storedUserId)
      setSprintId(storedSprintId || null)
      // Credentials déjà présents → authentification faciale
      setScreen('face')
    }
    // Sinon reste sur QR
  }

  const requestNotificationPermission = async () => {
    const { status } = await Notifications.requestPermissionsAsync()
    // Silencieux — on demande juste la permission au démarrage
  }

  const handleQRScanned = (uid: string, sid: string | null) => {
    setUserId(uid)
    setSprintId(sid)
    setScreen('face')
  }

  const handleAuthenticated = () => {
    setScreen('camera')
  }

  if (screen === 'qr') {
    return (
      <>
        <StatusBar style="light" />
        <QRScanner onScanned={handleQRScanned} />
      </>
    )
  }

  if (screen === 'face') {
    return (
      <>
        <StatusBar style="light" />
        <FaceAuth onAuthenticated={handleAuthenticated} />
      </>
    )
  }

  if (screen === 'settings') {
    return (
      <>
        <StatusBar style="light" />
        <Settings onBack={() => setScreen('camera')} />
      </>
    )
  }

  return (
    <>
      <StatusBar style="light" />
      <CameraScreen
        userId={userId!}
        sprintId={sprintId}
        onSettings={() => setScreen('settings')}
      />
    </>
  )
}