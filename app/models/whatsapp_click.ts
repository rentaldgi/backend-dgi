import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import WhatsappAdmin from './whatsapp_admin.js'


export default class WhatsappClick extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  public entity!: 'RENTAL_MOTOR' | 'RENTAL_IPHONE' | 'SEWA_APARTMENT' | 'PIXELNESIA'

  @column({ columnName: 'admin_id' })
  public adminId!: number // ✅ tambahin ini

  @belongsTo(() => WhatsappAdmin, {
    foreignKey: 'adminId',
  })
  declare admin: BelongsTo<typeof WhatsappAdmin>

  @column({ columnName: 'ip_address' })
  public ipAddress?: string | null

  @column({ columnName: 'user_agent' })
  public userAgent?: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
