import { useRef, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native'
import { CameraView, useCameraPermissions } from 'expo-camera'
import { uploadMealPhoto, getMealTime } from '../lib/storage'

interface CameraScreenProps {
  userId: string
  sprintId: string | null
  onSettings: () => void
}

type Status = 'idle' | 'preview' | 'uploading' | 'done' | 'error'

const { width, height } = Dimensions.get('window')

export default function CameraScreen({ userId, sprintId, onSettings }: CameraScreenProps) {
  const [permission, requestPermission] = useCameraPermissions()
  const [status, setStatus] = useState<Status>('idle')
  const [photoUri, setPhotoUri] = useState<string | null>(null)
  const cameraRef = useRef<CameraView>(null)

  if (!permission) return <View style={styles.container} />

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.permText}>Accès à la caméra requis</Text>
        <TouchableOpacity style={styles.permBtn} onPress={requestPermission}>
          <Text style={styles.permBtnText}>Autoriser</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const takePhoto = async () => {
    if (!cameraRef.current || status === 'uploading') return
    const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 })
    if (photo?.uri) {
      setPhotoUri(photo.uri)
      setStatus('preview')
    }
  }

  const confirmUpload = async () => {
    if (!photoUri) return
    setStatus('uploading')

    const result = await uploadMealPhoto(photoUri, userId, sprintId, getMealTime())

    if (result.success) {
      setStatus('done')
      setTimeout(() => {
        setPhotoUri(null)
        setStatus('idle')
      }, 1800)
    } else {
      setStatus('error')
      setTimeout(() => {
        setPhotoUri(null)
        setStatus('idle')
      }, 2000)
    }
  }

  const cancelPreview = () => {
    setPhotoUri(null)
    setStatus('idle')
  }

  return (
    <View style={styles.container}>

      {/* Background image ou caméra */}
      {status === 'idle' ? (
        <CameraView ref={cameraRef} style={styles.camera} facing="back" />
      ) : photoUri ? (
        <Image source={{ uri: photoUri }} style={styles.camera} resizeMode="cover" />
      ) : (
        <CameraView ref={cameraRef} style={styles.camera} facing="back" />
      )}

      {/* Overlay foncé */}
      <View style={styles.overlay} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>LONARA</Text>
        <Text style={styles.subtitle}>MY FUEL</Text>
        {status === 'idle' && (
          <TouchableOpacity style={styles.settingsBtn} onPress={onSettings}>
            <Text style={styles.settingsIcon}>⚙</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Zone centrale — bouton caméra ou état */}
      <View style={styles.center}>

        {/* Halos */}
        <View style={styles.halo1} />
        <View style={styles.halo2} />

        {(status === 'idle' || status === 'preview') && (
          <TouchableOpacity
            style={styles.shutterBtn}
            onPress={status === 'idle' ? takePhoto : confirmUpload}
            activeOpacity={0.85}
          >
            <View style={styles.shutterGlow} />
            <View style={styles.shutterRing} />
            <View style={styles.shutterInner}>
              <CameraIcon />
            </View>
          </TouchableOpacity>
        )}

        {(status === 'uploading' || status === 'done' || status === 'error') && (
          <View style={styles.statusCircle}>
            <View style={styles.shutterGlow} />
            <View style={styles.shutterRing} />
            <View style={styles.shutterInner}>
              {status === 'uploading' && (
                <View style={styles.spinner} />
              )}
              {status === 'done' && (
                <Text style={styles.checkIcon}>✓</Text>
              )}
              {status === 'error' && (
                <Text style={styles.errorIcon}>✕</Text>
              )}
            </View>
          </View>
        )}
      </View>

      {/* Zone bas */}
      <View style={styles.bottom}>
        {status === 'idle' && (
          <>
            <Text style={styles.tapText}>Tap to capture your meal</Text>
            <View style={styles.dot} />
          </>
        )}

        {status === 'preview' && (
          <View style={styles.previewActions}>
            <TouchableOpacity style={styles.cancelBtn} onPress={cancelPreview}>
              <Text style={styles.cancelText}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.tapText}>Tap to confirm</Text>
            <View style={{ width: 44 }} />
          </View>
        )}

        {status === 'uploading' && (
          <View style={styles.statusPill}>
            <Text style={styles.statusText}>Envoi en cours...</Text>
          </View>
        )}

        {status === 'done' && (
          <View style={styles.statusPill}>
            <Text style={[styles.statusText, { color: '#3DD4A0' }]}>Photo envoyée ✓</Text>
          </View>
        )}

        {status === 'error' && (
          <View style={styles.statusPill}>
            <Text style={[styles.statusText, { color: '#E24B4A' }]}>Erreur — réessayez</Text>
          </View>
        )}
      </View>

    </View>
  )
}

function CameraIcon() {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 52, color: '#69FFE4', opacity: 0.9 }}>⬤</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
 camera: { ...StyleSheet.absoluteFill },
overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 60,
    alignItems: 'center',
    zIndex: 10,
  },
  logo: {
    color: '#EAE4D5',
    fontSize: 22,
    letterSpacing: 7,
    fontWeight: '300',
  },
  subtitle: {
    color: '#3DD4A0',
    fontSize: 10,
    letterSpacing: 5,
    marginTop: 3,
    opacity: 0.8,
  },
  settingsBtn: {
    position: 'absolute',
    right: 24,
    top: 62,
    padding: 8,
  },
  settingsIcon: { fontSize: 20, color: 'rgba(255,255,255,0.4)' },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  halo1: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(57,255,208,0.05)',
  },
  halo2: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(57,255,208,0.04)',
  },
  shutterBtn: {
    width: 235,
    height: 235,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusCircle: {
    width: 235,
    height: 235,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterGlow: {
    position: 'absolute',
    width: 235,
    height: 235,
    borderRadius: 117,
    shadowColor: '#3DD4A0',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 30,
    elevation: 20,
  },
  shutterRing: {
    position: 'absolute',
    width: 235,
    height: 235,
    borderRadius: 117,
    borderWidth: 3,
    borderColor: '#7DFFE1',
  },
  shutterInner: {
    width: 219,
    height: 219,
    borderRadius: 110,
    backgroundColor: 'rgba(14,77,67,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#3DD4A0',
    borderTopColor: 'transparent',
  },
  checkIcon: { fontSize: 52, color: '#3DD4A0' },
  errorIcon: { fontSize: 52, color: '#E24B4A' },
  bottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 60,
    alignItems: 'center',
    minHeight: 100,
    justifyContent: 'center',
  },
  tapText: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 14,
    fontWeight: '300',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(78,243,192,0.85)',
    marginTop: 14,
  },
  previewActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '80%',
  },
  cancelBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: { color: 'rgba(255,255,255,0.6)', fontSize: 18 },
  statusPill: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'rgba(61,212,160,0.2)',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  statusText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    letterSpacing: 0.5,
  },
  permText: { color: '#EAE4D5', fontSize: 16, textAlign: 'center' },
  permBtn: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#3DD4A0',
  },
  permBtnText: { color: '#3DD4A0', fontSize: 13 },
})