import * as FileSystem from 'expo-file-system'
import { supabase } from './supabase'

export async function uploadMealPhoto(
  photoUri: string,
  userId: string,
  sprintId: string | null,
  mealTime: string
): Promise<{ success: boolean; logId?: string; error?: string }> {
  try {
    // Lire le fichier en base64
    const base64 = await FileSystem.readAsStringAsync(photoUri, {
      encoding: FileSystem.EncodingType.Base64,
    })

    // Décoder en ArrayBuffer pour Supabase Storage
    const fileName = `fuel/${userId}/${Date.now()}.jpg`
    const byteCharacters = atob(base64)
    const byteNumbers = new Array(byteCharacters.length)
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i)
    }
    const byteArray = new Uint8Array(byteNumbers)

    // Upload vers Supabase Storage
    const { data: upload, error: uploadError } = await supabase.storage
      .from('fuel-images')
      .upload(fileName, byteArray, {
        contentType: 'image/jpeg',
        upsert: false,
      })

    if (uploadError) throw uploadError

    // Obtenir l'URL publique
const { data: urlData, error: urlError } = await supabase.storage
  .from('fuel-images')
  .createSignedUrl(fileName, 60 * 60 * 24 * 365) // 1 an

const imageUrl = urlData?.signedUrl ?? null

    // Déterminer le moment de la journée
    const hour = new Date().getHours()
    const timeOfDay = hour >= 5 && hour < 10 ? 'matin'
      : hour >= 10 && hour < 17 ? 'jour'
      : hour >= 17 && hour < 21 ? 'soir'
      : 'nuit'

    // Insérer dans fuel_logs (non analysé)
    const { data: log, error: logError } = await supabase
      .from('fuel_logs')
      .insert({
        user_id: userId,
        sprint_id: sprintId,
        meal_time: mealTime,
        time_of_day: timeOfDay,
        image_url: imageUrl,
        analyzed: false,
        source: 'capture',
      })
      .select()
      .single()

    if (logError) throw logError

    return { success: true, logId: log.id }

  } catch (error: any) {
    console.error('uploadMealPhoto error:', error)
    return { success: false, error: error.message }
  }
}

export function getMealTime(): string {
  const h = new Date().getHours()
  if (h >= 5 && h < 10) return 'breakfast'
  if (h >= 10 && h < 15) return 'lunch'
  if (h >= 15 && h < 18) return 'snack'
  return 'dinner'
}