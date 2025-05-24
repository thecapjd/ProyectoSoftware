const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);

module.exports = router;

const authMiddleware = require('../middlewares/authMiddleware');

router.get('/protected', authMiddleware, (req, res) => {
  res.json({ message: 'Accediste a una ruta protegida', user: req.user });
});
