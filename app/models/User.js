const mongoose  = require('mongoose')
const validator = require('validator')
const Schema    = mongoose.Schema
const bcryptjs  = require('bcryptjs')
const jwt       = require('jsonwebtoken')

const userSchema = new Schema ({

  username: {
    type: String,
    required: true,
    // unique: true
  },

  email: {
    type: String,
    required: true,
    // unique: true,
    validate: {
      validator: function(value){
        return validator.isEmail(value)
      },
      messgae: function(){
        return 'invalid email format'
      }
    }
  },

  password: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 369
  },
  tokens: [
    {
      token: {
        type: String
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ]

})

userSchema.pre('save', function(next){

  const user = this
  console.log(user)
  if(user.isNew) {

    bcryptjs.genSalt(10)
      .then(function(salt){
        bcryptjs.hash(user.password, salt)
          .then(function(encryptedPassword){
            user.password = encryptedPassword
            next()
          })
      })
  }else{
    next()
  }

})

// instance methods

userSchema.methods.generateWebToken = function() {

  const user  = this

  const tokenData = {
    _id: user.id,
    username: user.username
  }

  const token = jwt.sign(tokenData, 'secret@123')

  user.tokens.push({ 'token': token })

  return user.save()
    .then(user => {
      return Promise.resolve(token)
    })
    // .catch((err) => {
    //   console.log('errpr inside')
    //   return Promise.reject(err)
    // })

}

userSchema.statics.tokenVerification = function(token) {

  const User = this
  let tokenData

  try {

    tokenData = jwt.verify(token, 'secret@123') //payload

  }catch(err) {

    return Promise.reject(err)

  }

  return User.findOne({ _id: tokenData._id, 'tokens.token': token})
    .then(user => {

      return Promise.resolve(user)

    })
    .catch(err => {

      res.json(err)

    })

}

// static methods

userSchema.statics.findByCredentials = function(email, password) {
  // this = User
    const User = this

    return User.findOne({ email })
          .then(user => {

            if(!user) {
              return Promise.reject('invalid email')
            }

            return bcryptjs.compare(password, user.password)
              .then(result => {

                if(result) {
                  return Promise.resolve(user)
                  // new Promise(function(resolve, reject){ resolve(user) })
                }else{
                  return Promise.reject('invalid password')
                }

              })

          })
          .catch(err => {
            return Promise.reject(err)
          })
}


const User = mongoose.model('User', userSchema)

module.exports = {
  User
}
