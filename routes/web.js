const authController = require('../app/http/controllers/authController')
const cartController = require('../app/http/controllers/customers/cartController')
const orderController = require('../app/http/controllers/customers/orderController')
const homeController = require('../app/http/controllers/homeController')
const guest = require('../app/http/middleware/guest')
const auth = require('../app/http/middleware/auth')
const AdminorderController = require('../app/http/controllers/admin/orderController')


function initRoutes(app){
    app.get('/', homeController().index)
    app.get('/login',guest,authController().login)
    app.post('/login',authController().postLogin)
    app.get('/register',guest,authController().register)
    app.post('/register',authController().postRegister)
    app.post('/logout',authController().logout)

    app.get('/cart',cartController().cart)
    app.post('/update-cart', cartController().update)

    //Customer routes
    app.post('/orders', auth, orderController().store)
    app.get('/customers/orders',auth, orderController().index)

    //Admin routes
    app.get('/admin/orders', auth, AdminorderController().index)
}

module.exports = initRoutes