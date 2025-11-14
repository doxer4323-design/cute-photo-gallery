// Supabase client for cloud database
export class SupabaseClient {
  private url: string
  private key: string

  constructor(url: string, key: string) {
    this.url = url
    this.key = key
  }

  // Get photos for a user from Supabase
  async getPhotos(userId: string) {
    try {
      // Log for debugging
      console.log('Fetching photos for userId:', userId)
      
      const response = await fetch(
        `${this.url}/rest/v1/photos?user_id=eq.${userId}&order=created_at.desc`,
        {
          headers: {
            'Authorization': `Bearer ${this.key}`,
            'apikey': this.key,
            'Content-Type': 'application/json',
          }
        }
      )

      if (!response.ok) {
        console.error('Supabase response not ok:', response.status, response.statusText)
        throw new Error('Failed to fetch photos')
      }

      const data = await response.json()
      console.log('Fetched photos from Supabase:', data)
      return data
    } catch (error) {
      console.error('Supabase getPhotos error:', error)
      return [] // Return empty array on error to use localStorage fallback
    }
  }

  // Save photo to Supabase
  async savePhoto(userId: string, photo: any) {
    try {
      const id = Date.now().toString()
      console.log('Saving photo to Supabase with userId:', userId)
      
      const response = await fetch(
        `${this.url}/rest/v1/photos`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.key}`,
            'apikey': this.key,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id,
            user_id: userId,
            image: photo.image,
            caption: photo.caption,
            song: photo.song || '',
            song_name: photo.songName || '',
            created_at: new Date().toISOString()
          })
        }
      )

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Supabase save error:', response.status, errorText)
        throw new Error('Failed to save photo')
      }

      console.log('Photo saved successfully to Supabase:', id)
      return id
    } catch (error) {
      console.error('Supabase savePhoto error:', error)
      throw error
    }
  }

  // Delete photo from Supabase
  async deletePhoto(photoId: string) {
    try {
      const response = await fetch(
        `${this.url}/rest/v1/photos?id=eq.${photoId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${this.key}`,
            'apikey': this.key,
          }
        }
      )

      if (!response.ok) {
        throw new Error('Failed to delete photo')
      }
    } catch (error) {
      console.error('Supabase deletePhoto error:', error)
      throw error
    }
  }

  // Update photo in Supabase
  async updatePhoto(photoId: string, data: any) {
    try {
      const response = await fetch(
        `${this.url}/rest/v1/photos?id=eq.${photoId}`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${this.key}`,
            'apikey': this.key,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...data,
            updated_at: new Date().toISOString()
          })
        }
      )

      if (!response.ok) {
        throw new Error('Failed to update photo')
      }
    } catch (error) {
      console.error('Supabase updatePhoto error:', error)
      throw error
    }
  }
}

// Initialize Supabase client if credentials are set
let supabaseClient: SupabaseClient | null = null

export const initSupabase = (url: string, key: string) => {
  if (url && key && !url.includes('YOUR_') && !key.includes('YOUR_')) {
    supabaseClient = new SupabaseClient(url, key)
    return true
  }
  return false
}

export const getSupabaseClient = () => supabaseClient
