import { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Switch, Platform } from 'react-native'
import * as Notifications from 'expo-notifications'
import * as SecureStore from 'expo-secure-store'

interface SettingsProps {
  onBack: () => void
}

interface ReminderConfig {
  breakfast: boolean
  lunch: boolean
  dinner: boolean
  breakfastTime: string
  lunchTime: string
  dinnerTime: string
}

const DEFAULT_CONFIG: ReminderConfig = {
  breakfast: true,
  lunch: true,
  dinner: true,
  breakfastTime: '08:00',
  lunchTime: '12:30',
  dinnerTime: '19:00',
}

export default function Settings({ onBack }: SettingsProps) {
  const [config, setConfig] = useState<ReminderConfig>(DEFAULT_CONFIG)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    loadConfig()
  }, [])

  const loadConfig = async () => {
    const stored = await SecureStore.getItemAsync('lonara_reminders')
    if (stored) setConfig(JSON.parse(stored))
  }

  const saveConfig = async () => {
    await SecureStore.setItemAsync('lonara_reminders', JSON.stringify(config))
    await scheduleReminders(config)
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  const scheduleReminders = async (cfg: ReminderConfig) => {
    await Notifications.cancelAllScheduledNotificationsAsync()

    const schedule = [
      { key: 'breakfast', label: 'Petit-déjeuner', time: cfg.breakfastTime, enabled: cfg.breakfast },
      { key: 'lunch',     label: 'Déjeuner',       time: cfg.lunchTime,     enabled: cfg.lunch     },
      { key: 'dinner',    label: 'Dîner',           time: cfg.dinnerTime,    enabled: cfg.dinner    },
    ]

    for (const item of schedule) {
      if (!item.enabled) continue
      const [hour, minute] = item.time.split(':').map(Number)
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Lonara — My Fuel',
          body: `Scannez votre ${item.label.toLowerCase()} 📷`,
          sound: true,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour,
          minute,
        },
      })
    }
  }

  const toggleReminder = (key: keyof ReminderConfig) => {
    setConfig(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const reminders = [
    { key: 'breakfast' as const, label: 'Petit-déjeuner', timeKey: 'breakfastTime' as const, emoji: '🌅' },
    { key: 'lunch'     as const, label: 'Déjeuner',       timeKey: 'lunchTime'     as const, emoji: '☀️' },
    { key: 'dinner'    as const, label: 'Dîner',          timeKey: 'dinnerTime'    as const, emoji: '🌙' },
  ]

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backText}>← Retour</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Rappels</Text>
        <View style={{ width: 70 }} />
      </View>

      <Text style={styles.description}>
        Recevez une notification pour scanner vos repas
      </Text>

      {/* Rappels */}
      <View style={styles.list}>
        {reminders.map((r) => (
          <View key={r.key} style={styles.row}>
            <Text style={styles.emoji}>{r.emoji}</Text>
            <Text style={styles.label}>{r.label}</Text>
            <Text style={styles.time}>{config[r.timeKey]}</Text>
            <Switch
              value={config[r.key]}
              onValueChange={() => toggleReminder(r.key)}
              trackColor={{ false: 'rgba(255,255,255,0.1)', true: 'rgba(61,212,160,0.4)' }}
              thumbColor={config[r.key] ? '#3DD4A0' : 'rgba(255,255,255,0.3)'}
            />
          </View>
        ))}
      </View>

      {/* Bouton sauvegarder */}
      <TouchableOpacity style={styles.saveBtn} onPress={saveConfig}>
        <Text style={styles.saveBtnText}>
          {saved ? 'Sauvegardé ✓' : 'Sauvegarder'}
        </Text>
      </TouchableOpacity>

      {/* Info */}
      <Text style={styles.info}>
        Les rappels s'appliquent tous les jours à l'heure choisie
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: 60,
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  backBtn: { padding: 4 },
  backText: { color: '#3DD4A0', fontSize: 14 },
  title: {
    color: '#EAE4D5',
    fontSize: 18,
    letterSpacing: 4,
    textTransform: 'uppercase',
    fontWeight: '300',
  },
  description: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 20,
  },
  list: {
    gap: 2,
    marginBottom: 40,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    backgroundColor: 'rgba(255,255,255,0.03)',
    marginBottom: 8,
    gap: 12,
  },
  emoji: { fontSize: 18 },
  label: { flex: 1, color: '#EAE4D5', fontSize: 14, fontWeight: '300' },
  time: { color: 'rgba(255,255,255,0.35)', fontSize: 13, marginRight: 8 },
  saveBtn: {
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'rgba(61,212,160,0.5)',
    backgroundColor: 'rgba(61,212,160,0.1)',
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  saveBtnText: {
    color: '#3DD4A0',
    fontSize: 12,
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  info: {
    color: 'rgba(255,255,255,0.25)',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
})