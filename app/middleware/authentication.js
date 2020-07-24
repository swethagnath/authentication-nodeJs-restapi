const { User } = require('../models/User')

const authenicateUser = (req, res, next) => {

  const token = req.header('x-auth')

  User.tokenVerification(token)
    .then(user => {
      if(user){
        req.user = user
        req.token = token
        next()
      }else{
        res.status('401').json({ notice: 'token not available' })
      }

    })
    .catch(err => {
      res.json({err})
    })

}

module.exports = {
  authenicateUser
}
