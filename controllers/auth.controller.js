import config from '../config/auth.config.js';
import db from '../models/index.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
 
const User = db.User;
const Role = db.Role;
 
export const signup = async (req, res) => {
    console.log(req.body);
    
  try {
    // Create a new user
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
    });
 
    const role = await Role.findOne({name: 'user'});
    user.roles = [role._id];
 
    // Save user to the database
    await user.save();
    res.status(201).json({message: 'User was registered successfully!'});
  } catch (err) {
    res.status(500).json({message: err.message});
  }
};
 
export const signin = async (req, res) => {
  try {
    // Find user by username
    const user = await User.findOne({username: req.body.username}).populate('roles', '-__v');
 
    if (!user) {
      return res.status(404).json({message: 'Користувача не знайдено.'});
    }
 
    // Validate password
    const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsValid) {
      return res.status(401).json({
        accessToken: null,
        message: 'Неправильний пароль чи пошта!',
      });
    }
 
    // Generate JWT
    console.log(config.secret);
    
    const token = jwt.sign({id: user.id}, "NXHFngVamZmNOnnwPPUx2Vzjt5tVX4Cvl9YUaCdoLo5CI1MuxKEAn0E3NJxf4nD", {
      algorithm: 'HS256',
      expiresIn: 86400, // 24 hours
    });
 
    // Extract user roles
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