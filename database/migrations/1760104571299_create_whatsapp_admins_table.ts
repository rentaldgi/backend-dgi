import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'whatsapp_admins'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .enu('entity', ['RENTAL_MOTOR', 'RENTAL_IPHONE', 'SEWA_APARTMENT'], {
          useNative: true,
          enumName: 'entity', // nama enum di PostgreSQL
          existingType: true, // set true kalau enum-nya sudah ada di database
        })
        .notNullable()
      table.string('name').nullable()
      table.string('phone_number').notNullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
