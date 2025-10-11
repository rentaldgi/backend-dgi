/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import ArticlesController from '#controllers/articles_controller'
import ContactsController from '#controllers/contacts_controller'
import ArticleViewsController from '#controllers/article_views_controller'
import WebsiteViewsController from '#controllers/website_views_controller'
import WhatsappClicksController from '#controllers/whatsapp_clicks_controller'
import WhatsappAdminController from '#controllers/whatsapp_admins_controller'

// Public routes
// router.on('/').render('pages/home')
router.get('/article', [ArticlesController, 'index'])
router.get('/article/:slug', [ArticlesController, 'show'])
router.post('/article', [ArticlesController, 'store'])
router.put('/article/:id', [ArticlesController, 'update'])
router.delete('/article/:id', [ArticlesController, 'destroy'])

router.post('/kontak', [ContactsController, 'kirimPesan'])

router.get('/article-views', [ArticleViewsController, 'index'])
router.get('/article-views-entity', [ArticleViewsController, 'totalPerEntity'])

// Website views
router.post('/website-views', [WebsiteViewsController, 'store'])
router.get('/website-views/stats', [WebsiteViewsController, 'stats'])

// WhatsApp Clicks
router.post('/whatsapp-clicks', [WhatsappClicksController, 'store'])
router.get('/whatsapp-clicks', [WhatsappClicksController, 'stats'])

router.get('/whatsapp-admins', [WhatsappAdminController, 'index'])
router.get('/whatsapp-admins/:id', [WhatsappAdminController, 'show'])
