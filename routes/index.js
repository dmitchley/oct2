const express = require('express')
const match = require('./match');
const { fetchMatches, getMatchById } = require('../api/soccer');
const { asyncRoute } = require('../src/util/expressUtil');

const router = express.Router()
const { ensureAuth, ensureGuest } = require('../middleware/auth')

// @ dec Login/Landing
// @route Get/  
router.get('/', ensureGuest, (req, res) => {
   res.render('login', {
     layout: 'login',
   })
})

// @ dec Dashboard
// @route Get/Dashboard
router.get('/dashboard', ensureAuth, asyncRoute(async (req, res) => {
   const matches = await fetchMatches();
   res.render('dashboard', {
      matches
   });
}));

// match
router.use('/match', match);


module.exports = router
