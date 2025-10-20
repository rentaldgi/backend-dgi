import Article from '#models/article'
import ArticleView from '#models/article_view'
import type { HttpContext } from '@adonisjs/core/http'
import { schema, rules } from '@adonisjs/validator'
import { promises as fs } from 'fs'
import { join } from 'path'

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-') // Ganti spasi & simbol dengan strip
    .replace(/^-+|-+$/g, '') // Hapus strip di awal/akhir
}
export default class ArticlesController {
  /**
   * Display a list of resource
   */
  async index({ response, request }: HttpContext) {
    try {
      const { entity } = request.qs() // ambil entity dari query string

      const query = Article.query()
        .where('dihapus', false)
        .where('status', true)
        .orderBy('createdAt', 'desc')

      // Filter berdasarkan entity jika dikirim di query string
      if (entity) {
        query.where('entity', entity)
      }

      const articles = await query

      return response.json(articles)
    } catch (error) {
      return response
        .status(500)
        .json({ message: 'Gagal mengambil data artikel', error: error.message })
    }
  }

  /**
   * Display form to create a new record
   */
  async create({}: HttpContext) {}

  /**
   * Handle form submission for the create action
   */
  public async store({ request, response }: HttpContext) {
    try {
      const payload = await request.validate({
        schema: schema.create({
          entity: schema.enum(['RENTAL_MOTOR', 'RENTAL_IPHONE', 'SEWA_APARTMENT'] as const, [
            rules.required(),
          ]),
          title: schema.string({}, [rules.required()]),
          content: schema.string({}, [rules.required()]),
          status: schema.boolean(),
          thumbnail: schema.file(
            {
              size: '2mb',
              extnames: ['jpg', 'jpeg', 'png'],
            },
            [rules.required()]
          ),
          publishedAt: schema.date({}, [rules.required()]),
        }),
        messages: {
          'entity.required': 'Entity kategori harus diisi',
          'title.required': 'Judul kategori harus diisi',
          'content.required': 'Konten kategori harus diisi',
          'status.required': 'Status kategori harus diisi',
          'thumbnail.required': 'Thumbnail kategori harus diisi',
          'thumbnail.file.size': 'Ukuran thumbnail tidak boleh lebih dari 2MB',
          'thumbnail.file.extname': 'Format thumbnail harus jpg, jpeg, atau png',
          'publishedAt.required': 'Tanggal kategori harus diisi',
        },
      })

      const slug = generateSlug(payload.title)

      const slugUsed = await Article.query()
        .where('slug', slug)
        .where('dihapus', false) // hanya cek yang aktif
        .first()

      if (slugUsed) {
        return response.unprocessableEntity({
          errors: [{ field: 'slug', message: 'Slug artikel sudah digunakan' }],
        })
      }

      const thumbnail = payload.thumbnail
      const fileName = `${Date.now()}_${thumbnail.clientName}`
      const uploadDir = join('public', 'uploads')
      const publicUrl = `/uploads/${fileName}`

      await fs.mkdir(uploadDir, { recursive: true })

      // Pindahkan file ke folder public/uploads
      await thumbnail.move(uploadDir, {
        name: fileName,
        overwrite: true,
      })

      const article = await Article.create({
        slug,
        entity: payload.entity,
        title: payload.title,
        content: payload.content,
        status: payload.status,
        thumbnail: publicUrl,
        publishedAt: payload.publishedAt,
      })

      return response.created({
        success: true,
        message: 'Artikel berhasil ditambahkan',
        data: article,
      })
    } catch (error) {
      if (error.messages) {
        return response.unprocessableEntity({
          message: 'Validasi gagal',
          errors: error.messages,
        })
      }

      return response
        .status(500)
        .json({ message: 'Gagal menambahkan artikel', error: error.message })
    }
  }

  /**
   * Show individual record
   */
  async show({ params, request, response }: HttpContext) {
    try {
      const article = await Article.query()
        .where({ slug: params.slug, dihapus: false })
        .firstOrFail()

      try {
        await ArticleView.create({
          articleId: article.id,
          entity: article.entity,
          ipAddress: request.ip(),
          userAgent: request.header('user-agent') || null,
        })
        console.log('✅ View berhasil dicatat')
      } catch (err) {
        console.error('❌ Gagal mencatat view:', err)
      }

      return { success: true, message: 'Artikel ditemukan', data: article }
    } catch (error) {
      return response.status(404).json({ message: 'Artikel tidak ditemukan', error: error.message })
    }
  }

  /**
   * Edit individual record
   */
  async edit({}: HttpContext) {}

  /**
   * Handle form submission for the edit action
   */
  async update({ request, response, params }: HttpContext) {
    try {
      const article = await Article.findOrFail(params.id)

      const payload = await request.validate({
        schema: schema.create({
          entity: schema.enum(['RENTAL_MOTOR', 'RENTAL_IPHONE', 'SEWA_APARTMENT'] as const, [
            rules.required(),
          ]),
          title: schema.string({}, [rules.required()]),
          content: schema.string({}, [rules.required()]),
          status: schema.boolean(),
          thumbnail: schema.file.optional({
            size: '2mb',
            extnames: ['jpg', 'jpeg', 'png'],
          }),
          publishedAt: schema.date({}, [rules.required()]),
          // categoryId: schema.number([rules.required()]),
        }),
        messages: {
          'entity.required': 'Entity kategori harus diisi',
          'title.required': 'Judul kategori harus diisi',
          'content.required': 'Konten kategori harus diisi',
          'status.required': 'Status kategori harus diisi',
          'thumbnail.file.size': 'Ukuran thumbnail tidak boleh lebih dari 2MB',
          'thumbnail.file.extname': 'Format thumbnail harus jpg, jpeg, atau png',
          'publishedAt.required': 'Tanggal kategori harus diisi',
          // 'categoryId.required': 'Kategori kategori harus diisi',
        },
      })
      const slug = generateSlug(payload.title)
      const slugUsed = await Article.query().where('slug', slug).whereNot('id', article.id).first()

      if (slugUsed) {
        return response.unprocessableEntity({
          errors: [{ field: 'slug', message: 'Slug artikel sudah digunakan' }],
        })
      }

      let newThumbnailUrl = article.thumbnail
      if (payload.thumbnail) {
        const fileName = `${Date.now()}_${payload.thumbnail.clientName}`
        const uploadDir = join('public', 'uploads')
        const publicUrl = `/uploads/${fileName}`

        await fs.mkdir(uploadDir, { recursive: true })

        await payload.thumbnail.move(uploadDir, {
          name: fileName,
          overwrite: true,
        })

        newThumbnailUrl = publicUrl
      }

      article.merge({
        slug,
        entity: payload.entity,
        title: payload.title,
        content: payload.content,
        status: payload.status,
        thumbnail: newThumbnailUrl,
        publishedAt: payload.publishedAt,
      })

      await article.save()

      return {
        success: true,
        message: 'Artikel berhasil diupdate',
        data: article,
      }
    } catch (error) {
      if (error.messages) {
        return response.unprocessableEntity({
          message: 'Validasi gagal',
          errors: error.messages,
        })
      }

      return response
        .status(500)
        .json({ message: 'Gagal mengupdate artikel', error: error.message })
    }
  }

  /**
   * Delete record
   */
  async destroy({ params, response }: HttpContext) {
    try {
      const article = await Article.query().where({ id: params.id }).update({ dihapus: 1 })
      return { success: true, message: 'Artikel berhasil dihapus!', data: article }
    } catch (error) {
      return response.status(500).json({ message: 'Gagal menghapus artikel', error: error.message })
    }
  }
}
