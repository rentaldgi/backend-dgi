import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Article extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

 @column()
  declare entity: 'RENTAL_MOTOR' | 'RENTAL_IPHONE' | 'SEWA_APARTMENT'

  @column()
  declare title: string

  @column()
  declare slug: string

  @column()
  declare content: string

  @column()
  declare status: boolean

  @column()
  declare thumbnail: string

  @column.date()
  declare publishedAt: DateTime

  @column()
  declare userId: number

  @column()
  declare dihapus: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}