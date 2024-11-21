const bcrypt = require('bcrypt');
const {pool} = require('../config/database');

const register = async (req, res) => {
  const { username, email, password } = req.body || {};
  console.log(req.body);

  if (!username || !email || !password) {
    return res.status(400).json({ error: "Invalid request. Missing fields." });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO user (username, email, password) VALUES ($1, $2, $3) RETURNING *",
      [username, email, hashedPassword]
    );
    res
      .status(201)
      .json({ message: "User registered successfully", user: result.rows[0] });
  } catch (error) {
    res
      .status(500)
      .json({ error: "User registration failed", details: error.message });
  }
};

const login = async (req, res) => {
    const {email, password} = req.body

    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1',[email]);
        const user = result.rows[0];

        if(!user) {
            return res.status(404).json({error: "user not found"});
        }

        const isValid = await bcrypt.compare(password, user.password);
        if(!isValid) {
            return res.status(401).json({error: "invalid credentials"});
        }

        const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: '7d'});
        res.json({message: 'login successful', token});  
    } catch (error) {
     res.status(500).json({ error: "login failed", details: error.message });   
    }
};

module.exports = {register, login};