const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');


//Register
router.post('/register', (req, res, next) => {

	let newUser = new User({
		nombre: req.body.nombre,
		apellido: req.body.apellido,
		correo: req.body.correo,
		rol: req.body.rol,
		contraseña: req.body.contraseña
	});
	User.addUser(newUser, (err, user) => {
		if(err){
			res.json({success:false, msg:'No funciono el registro de usuario'});
		} else {
			res.json({success:false, msg:'Usuario registrado :)'});
		}
	});
});

//Authenticate
router.post('/authenticate', (req, res, next) => {
	const correo = req.body.correo;
	const contraseña = req.body.contraseña;

	User.getUserByEmail(correo, (err, user) => {
				console.log(user);
		if(err) {
			console.log('AQUI PASO ALGO');
		}
		if(!user){
			console.log('AQUI PASO ALGO2');
			return res.json({success: false, msg:'User not found'});
		}
		User.comparePassword(contraseña, user.contraseña, (err, isMatch) => {
			console.log('estoy en comparar');
			if(err) {
				console.log('ERROR EN COMPARAR');
			}
			if(isMatch){
				const token = jwt.sign(user, config.secret, {
					expiresIn:604800 //Una semana
				});

				res.json({
					success: true,
					token: 'JWT '+token,
					user: {
						idUsuario: user.idUsuario,
						nombre: user.nombre,
						apellido: user.apellido,
						correo: user.correo,
						rol: user.rol
					}
				});
			} else {
				return res.json({success:false, msg: 'Wrong password'});
			}
		});
	});
});

//Profile
router.get('/profile', passport.authenticate('jwt', {session:false}), (req, res, next) => {
	res.json({user: req.user});
});


module.exports = router;