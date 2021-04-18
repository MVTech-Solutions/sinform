
const passport = require('passport')
const passportJwt = require('passport-jwt')
const { Strategy, ExtractJwt } = passportJwt

const knex = require("../config/db");

module.exports = app => {
    const authSecret = process.env.authSecret;
    const params = {
        secretOrKey: authSecret,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    }

    const strategy = new Strategy(params, (payload, done) => {
        knex('user')
            .where({user_id: payload.user_id})
            .first()
            .then(user => done(null, user ? {...payload} : false))
            .catch(err => done(err, false))
    })

    passport.use(strategy)
    return {
        authenticate: () => passport.authenticate('jwt', {session: false})
    }
}