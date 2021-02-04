const router = require('express').Router()
const {indexGet, registerGet, registerPost} = require('../controllers/defaultController')



router.get('/', indexGet)
router.route('/register')
.get(registerGet)
.post(registerPost)











module.exports = router