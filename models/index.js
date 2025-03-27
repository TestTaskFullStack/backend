

import mongoose from 'mongoose';
import dbConfig from '../config/db.config.js';
 
import User from './user.model.js';
import Role from './role.model.js';
import Game from './game.model.js';
 
const db = {};
 
db.mongoose = mongoose;
db.User = User;
db.Role = Role;
db.Game = Game; 
db.ROLES = ['user', 'admin'];
db.config = dbConfig;
 
export default db;