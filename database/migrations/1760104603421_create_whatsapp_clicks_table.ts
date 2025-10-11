import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'whatsapp_clicks'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.enum('entity', ['RENTAL_MOTOR', 'RENTAL_IPHONE', 'SEWA_APARTMENT']).notNullable()
      table
        .integer('admin_id')
        .unsigned()
        .references('id')
        .inTable('whatsapp_admins')
        .onDelete('CASCADE')
      table.string('ip_address').nullable()
      table.string('user_agent').nullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
