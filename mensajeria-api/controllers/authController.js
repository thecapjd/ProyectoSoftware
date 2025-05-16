const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const users = [];

exports.register = (req, res) => {
  const { username, password } = req.body;

  const hashedPassword = bcrypt.hashSync(password, 10);
  users.push({ username, password: hashedPassword });

  res.json({ message: 'Usuario registrado con éxito' });
};

exports.login = (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);

  if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

  const validPassword = bcrypt.compareSync(password, user.password);
  if (!validPassword) return res.status(401).json({ message: 'Contraseña incorrecta' });

  const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.json({ message: 'Login exitoso', token });
};
