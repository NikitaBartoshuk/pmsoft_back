const Router = require('express')
const router = new Router()
const bookRouter = require('./bookRouter')
const userRouter = require('./userRouter')

router.use('/user', userRouter)
router.use('/book', bookRouter)

module.exports = router