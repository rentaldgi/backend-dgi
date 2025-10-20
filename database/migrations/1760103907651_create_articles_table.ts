import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'articles'

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

      table.string('title').notNullable()
      table.string('slug').notNullable()
      table.text('content').notNullable()
      table.string('thumbnail').notNullable()
      table.dateTime('published_at').notNullable()
      table.boolean('status').defaultTo(false)
      table.boolean('dihapus').defaultTo(false)

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    // drop tabel
    this.schema.dropTable(this.tableName)

    // opsional: hapus tipe enum-nya juga
    this.schema.raw('DROP TYPE IF EXISTS entity')
  }
}
