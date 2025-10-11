import type { HttpContext } from '@adonisjs/core/http'
import WhatsappAdmin from '#models/whatsapp_admin'

export default class WhatsappAdminController {
  // GET /whatsapp-admins
  public async index({ response }: HttpContext) {
    const admins = await WhatsappAdmin.all()
    return response.json(admins)
  }

  // GET /whatsapp-admins/:id
  public async show({ params, response }: HttpContext) {
    const admin = await WhatsappAdmin.find(params.id)
    if (!admin) {
      return response.notFound({ message: 'Admin not found' })
    }
    return response.json(admin)
  }
}
