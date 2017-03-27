var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var db = mongojs('mongodb://pokemon_db:cis510_pokemon@ds111529.mlab.com:11529/teaching', ['users']);
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const config = require('../config/database');
var bcrypt = require('bcryptjs');


//update

router.put('/updateprofile',(req,res,next)=>{
	let userToBeUpdated = new User({
		id:req.body.id,
		name: req.body.name,
		email: req.body.email,
		username: req.body.username,
		password: req.body.password
		});


// Encrypt the password



	bcrypt.genSalt(10,(err,salt)=>{
		bcrypt.hash(userToBeUpdated.password,salt,(err,hash)=>{
			if(err) throw err;
			userToBeUpdated.password = hash; 

				User.updateUserByUserUsername(userToBeUpdated, (err, user) => {

					if (err) {
							res.json({
								success: false,
								msg: 'Failed to update user.',
								err:err
							});
						} else {
							res.json({
								success: true,
								msg: 'User updated successfully.'
							});
						}
					});

			
			
		});

	});








});
	







//register
router.post('/register', (req, res, next) => {
	let newUser = new User({
		name: req.body.name,
		email: req.body.email,
		username: req.body.username,
		password: req.body.password
	});


	User.addUser(newUser, (err, user) => {
		if (err) {
			res.json({
				success: false,
				msg: 'Failed to register user.'
			});
		} else {
			res.json({
				success: true,
				msg: 'User registered successfully.'
			});
		}


	})


});

//authenticate
router.post('/authenticate', (req, res, next) => {
	const username = req.body.username;
	const password = req.body.password;
	User.getUserByUsername(username, (err, user) => {
		if (err) throw err;
		if (!user) {
			return res.json({
				success: false,
				msg: 'User not found'
			});
		}

		User.comparePassword(password, user.password, (err, isMatch) => {
			if (err) throw err;
			if (isMatch) {
				const token = jwt.sign(user, config.secret, {
					expiresIn: 604800 // 1 week in seconds
				});

				res.json({
					success: true,
					token: 'JWT ' + token,
					user: {

						id: user._id,
						name: user.name,
						username: user.username,
						email: user.email
					}
				});
			} else

			{
				return res.json({
					success: false,
					msg: 'Wrong Password'
				});
			}
		});
	});

});


//profile

router.get('/profile', passport.authenticate('jwt', {
	session: false
}), (req, res, next) => {
	res.json({
		user: req.user
	});
});


module.exports = router;