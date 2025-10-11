import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class WhatsappAdmin extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  public entity!: 'RENTAL_MOTOR' | 'RENTAL_IPHONE' | 'SEWA_APARTMENT'

  @column()
  public name?: string | null

  @column({ columnName: 'phone_number' })
  public phoneNumber!: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}