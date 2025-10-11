import type { HttpContext } from '@adonisjs/core/http'
import WhatsappClick from '#models/whatsapp_click'
// import WhatsappAdmin from '#models/whatsapp_admin'

export default class WhatsappClicksController {
  public async store({ request }: HttpContext) {
  const { entity, adminId } = request.only(['entity', 'adminId'])

  const click = await WhatsappClick.create({
    entity,
    adminId,
    ipAddress: request.ip(),
    userAgent: request.header('user-agent') || null,
  })

  // preload relasi admin
  await click.load('admin')

  return {
    success: true,
    message: 'WhatsApp click recorded',
    data: click, // ini udah ada admin di dalamnya
  }
}


public async stats({ request }: HttpContext) {
  const { entity, adminId } = request.qs()

  const results = await WhatsappClick.query()
    .select('entity', 'admin_id')
    .count('* as total')
    .groupBy('entity', 'admin_id')
    .preload('admin')
    .if(entity, (q) => q.where('entity', entity))
    .if(adminId, (q) => q.where('admin_id', adminId))

  return results.map((row) => ({
    entity: row.entity,
    adminId: row.adminId,
    total: Number(row.$extras.total), // ambil dari $extras
    admin: row.admin,
  }))
}


}
