// Google Drive Integration for Photo Gallery
// This uses Google Drive API to store photos

export interface GooglePhotoMetadata {
  id: string
  name: string
  caption: string
  songName?: string
  uploadedAt: number
  userId: string
}

const GOOGLE_DRIVE_FOLDER_ID = 'cute-photo-gallery' // Will be created automatically

export class GoogleDriveStorage {
  private accessToken: string | null = null
  private folderId: string | null = null

  // Initialize with Google OAuth2
  async init(accessToken: string) {
    this.accessToken = accessToken
    await this.ensureFolderExists()
  }

  // Ensure the photo gallery folder exists
  private async ensureFolderExists() {
    if (!this.accessToken) throw new Error('Not authenticated')

    try {
      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files?q=name='${GOOGLE_DRIVE_FOLDER_ID}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
        {
          headers: { Authorization: `Bearer ${this.accessToken}` }
        }
      )
      const data = await response.json()

      if (data.files && data.files.length > 0) {
        this.folderId = data.files[0].id
      } else {
        // Create folder
        const createResponse = await fetch(
          'https://www.googleapis.com/drive/v3/files',
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${this.accessToken}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              name: GOOGLE_DRIVE_FOLDER_ID,
              mimeType: 'application/vnd.google-apps.folder'
            })
          }
        )
        const createData = await createResponse.json()
        this.folderId = createData.id
      }
    } catch (error) {
      console.error('Error ensuring folder exists:', error)
      throw error
    }
  }

  // Upload photo to Google Drive
  async uploadPhoto(
    file: File,
    metadata: Omit<GooglePhotoMetadata, 'id'>
  ): Promise<string> {
    if (!this.accessToken || !this.folderId) {
      throw new Error('Not authenticated or folder not initialized')
    }

    try {
      const formData = new FormData()
      formData.append(
        'metadata',
        new Blob(
          [
            JSON.stringify({
              name: `${metadata.uploadedAt}-${metadata.userId}.jpg`,
              parents: [this.folderId],
              description: JSON.stringify(metadata)
            })
          ],
          { type: 'application/json' }
        )
      )
      formData.append('file', file)

      const response = await fetch(
        'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.accessToken}`
          },
          body: formData
        }
      )

      const data = await response.json()
      return data.id
    } catch (error) {
      console.error('Error uploading photo:', error)
      throw error
    }
  }

  // Get all photos
  async getPhotos(userId: string): Promise<GooglePhotoMetadata[]> {
    if (!this.accessToken || !this.folderId) {
      throw new Error('Not authenticated or folder not initialized')
    }

    try {
      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files?q='${this.folderId}' in parents and trashed=false&pageSize=100`,
        {
          headers: { Authorization: `Bearer ${this.accessToken}` }
        }
      )
      const data = await response.json()

      const photos: GooglePhotoMetadata[] = []
      for (const file of data.files || []) {
        const description = file.description ? JSON.parse(file.description) : {}
        if (description.userId === userId) {
          photos.push({
            id: file.id,
            name: file.name,
            caption: description.caption || '',
            songName: description.songName,
            uploadedAt: description.uploadedAt || 0,
            userId
          })
        }
      }

      return photos.sort((a, b) => b.uploadedAt - a.uploadedAt)
    } catch (error) {
      console.error('Error getting photos:', error)
      throw error
    }
  }

  // Delete photo
  async deletePhoto(photoId: string) {
    if (!this.accessToken) {
      throw new Error('Not authenticated')
    }

    try {
      await fetch(`https://www.googleapis.com/drive/v3/files/${photoId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${this.accessToken}` }
      })
    } catch (error) {
      console.error('Error deleting photo:', error)
      throw error
    }
  }

  // Update photo metadata
  async updatePhoto(
    photoId: string,
    metadata: Partial<GooglePhotoMetadata>
  ) {
    if (!this.accessToken) {
      throw new Error('Not authenticated')
    }

    try {
      await fetch(`https://www.googleapis.com/drive/v3/files/${photoId}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          description: JSON.stringify(metadata)
        })
      })
    } catch (error) {
      console.error('Error updating photo:', error)
      throw error
    }
  }
}

export default new GoogleDriveStorage()
