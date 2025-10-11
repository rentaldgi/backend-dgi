import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class WebsiteView extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  public entity!: 'RENTAL_MOTOR' | 'RENTAL_IPHONE' | 'SEWA_APARTMENT'

  @column()
  public path!: string

  @column()
  public ipAddress!: string

  @column()
  public userAgent!: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
