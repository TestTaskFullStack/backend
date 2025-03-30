import config from '../config/auth.config.js';
import db from '../models/index.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
 
const User = db.User;
const Role = db.Role;
 
export const signup = async (req, res) => {
    console.log(req.body);
    
  try {
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
    });
 
    const role = await Role.findOne({name: 'user'});
    user.roles = [role._id];
    user.achievements = [];
    user.startedGames = [];
 
    await user.save();
    res.status(201).json({message: 'User was registered successfully!'});
  } catch (err) {
    res.status(500).json({message: err.message});
  }
};
 
export const signin = async (req, res) => {
  try {
    const user = await User.findOne({username: req.body.username}).populate('roles', '-__v');
 
    if (!user) {
      return res.status(404).json({message: 'Користувача не знайдено.'});
    }
 
    const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsValid) {
      return res.status(401).json({
        accessToken: null,
        message: 'Неправильний пароль чи пошта!',
      });
    }
 
    
    const token = jwt.sign({id: user.id, username: user.username,}, config.secret, {
      algorithm: 'HS256',
      expiresIn: 86400, // 24 hours
    });
 
    const authorities = user.roles.map((role) => `ROLE_${role.name.toUpperCase()}`);
 
    res.status(200).json({
      id: user._id,
      username: user.username,
      email: user.email,
      roles: authorities,
      accessToken: token,
    });
  } catch (err) {
    res.status(500).json({message: err.message});
  }
};