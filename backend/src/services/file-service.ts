import { AbstractFileProviderService } from "@medusajs/framework/utils"
import { createClient } from '@supabase/supabase-js'
import { Readable } from 'stream'

class SupabaseFileService extends AbstractFileProviderService {
  protected supabase_
  static identifier = "supabase"

  constructor() {
    super()
    
    this.supabase_ = createClient(
      'https://nbbyjrnuwlvhshplrerd.supabase.co',
      process.env.SUPABASE_ANON_KEY || ''
    )
  }

  async upload(file) {
    const fileName = `${Date.now()}-${file.originalname?.replace(/\s/g, '-') || file.filename}`
    
    const { data, error } = await this.supabase_.storage
      .from('products')
      .upload(fileName, file.buffer, {
        contentType: file.mimetype || file.mimeType,
        upsert: false
      })

    if (error) throw error

    return {
      url: `https://nbbyjrnuwlvhshplrerd.supabase.co/storage/v1/object/public/products/${fileName}`,
      key: fileName
    }
  }

  async delete(file) {
    const key = typeof file === 'string' ? file : (file.fileKey || file.key)
    const { error } = await this.supabase_.storage
      .from('products')
      .remove([key])
    
    if (error) throw error
  }

  async getUploadStreamDescriptor(fileData) {
    throw new Error("Stream upload not supported for Supabase")
  }

  async getDownloadStream(fileData) {
    const key = fileData.fileKey || fileData.key || fileData
    const { data, error } = await this.supabase_.storage
      .from('products')
      .download(key)
    
    if (error) throw error
    
    const buffer = Buffer.from(await data.arrayBuffer())
    const stream = Readable.from(buffer)
    return stream
  }

  async getPresignedDownloadUrl(fileData) {
    const key = fileData.fileKey || fileData.key || fileData
    
    // Just return the string URL for public bucket
    return `https://nbbyjrnuwlvhshplrerd.supabase.co/storage/v1/object/public/products/${key}`
  }
}

export default SupabaseFileService