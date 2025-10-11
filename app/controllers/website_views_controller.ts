import type { HttpContext } from '@adonisjs/core/http'
import WebsiteView from '#models/website_view'

export default class WebsiteViewsController {
  public async store({ request }: HttpContext) {
    const data = request.only(['entity', 'path'])
    await WebsiteView.create({
      entity: data.entity,
      path: data.path,
      ipAddress: request.ip(),
      userAgent: request.header('user-agent') || null,
    })
    console.log('Tracking view', data)

    return { success: true, message: 'Website view recorded' }
  }

  public async stats({ request }: HttpContext) {
    const entity = request.qs().entity

    const query = WebsiteView.query().select('entity').count('* as total').groupBy('entity')

    if (entity) query.where('entity', entity)

    return await query
  }
}
