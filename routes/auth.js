const express = require('express')
const passport = require('passport')
const router = express.Router()

// @ dec auth with google
// @route Get/auth/goole
router.get('/google', passport.authenticate('google', { scope: ['profile'] }))

// @ dec google auth callback
// @route Get/auth/google/callback
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
    res.redirect('/dashboard')
}
)

// Logout User
// route /auth/logout
router.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
})


module.exports = router
