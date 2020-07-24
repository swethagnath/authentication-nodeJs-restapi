const express = require('express')
const { User } = require('../models/User')
const bcryptjs    = require('bcryptjs')

// sign up
// localhost:3000/signup
exports.signup = (req, res, next) => {

  const body = req.body
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  })

  user.save()
    .then(token => {

    })

}

// localhost:3000/login

exports.login = (req, res, next) => {

  const username = req.body.username
  const password = req.body.password
  const email    = req.body.email

  User.findByCredentials(email, password)
    .then(user => {
      return user.generateWebToken()
    })
    .then(token => {
      res.setHeader('x-auth', token)
      res.json( { msg:{} } )
    })
    .catch(err => {
      res.send( { err })
    })

}

// localhost:3000/account

exports.account = (req, res, next) => {
  const user = req.user
  res.json(user)
}

// localhost:3000/logout

exports.logout = (req, res, next) => {

  const { user, token } = req

   User.findByIdAndUpdate(user._id, { $pull: { tokens: { token: token } } })
    .then(user => {
      res.json({notice: "successfully logout"})
    })
    .catch(err => res.json(err))

}
