import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'article_views'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('article_id')
        .unsigned()
        .references('id')
        .inTable('articles')
        .onDelete('CASCADE')
      table
        .enu('entity', ['RENTAL_MOTOR', 'RENTAL_IPHONE', 'SEWA_APARTMENT'], {
          useNative: true,
          enumName: 'entity', // nama enum di PostgreSQL
          existingType: true, // set true kalau enum-nya sudah ada di database
        })
        .notNullable()
      table.string('ip_address').nullable()
      table.string('user_agent').nullable()
      table.timestamp('viewed_at').defaultTo(this.now())

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
