const express = require('express')
const { fetchMatches, getMatchById, getMatchOdds, getMatchOddsNow } = require('../api/soccer');
const { asyncRoute } = require('../src/util/expressUtil');
const Bet = require('../models/Bet');

const router = express.Router()

// ###########################################################################
// match information
// ###########################################################################

router.get('/:matchId', asyncRoute(async (req, res) => {
  const { matchId } = req.params;
  const match = await getMatchById(matchId);

  if (!match) {
    throw new Error(`Invalid page - match does not exist ${matchId}`);
    // return res.render('match', {
    //   match,
    //   betConfigs,
    //   // csrfToken: req.csrfToken()
    // })
  }

  const {
    id: uid,
    displayName
  } = req.user || {};

  const existingBet = await Bet.findOne({ uid, matchId });

  console.debug(`rendering match. bet = ${JSON.stringify(existingBet)}`);

  const betConfigs = [
    {
      team: match.teams[0]
    },
    {
      team: null
    },
    {
      team: match.teams[1]
    }
  ].
    map(cfg => {
      const {
        team
      } = cfg;
      const odds = getMatchOddsNow(match, team);
      return {
        matchId,
        hasBet: existingBet && existingBet.team === team ? '✅' : '',
        odds,
        teamLabel: cfg.team || 'Tie', 
        ...cfg,
      };
    });
  res.render('match', {
    uid,
    welcomeMessage: `Hi, ${displayName}!` || '(you are not logged in)',
    match,
    betConfigs,
    // csrfToken: req.csrfToken()
  })
}));


// ###########################################################################
// bets
// ###########################################################################

router.post('/bet', asyncRoute(async (req, res) => {
  // const { matchId } = req.params;
  let { team, matchId } = req.body;

  if (!team) {
    // tie!
    team = null;
  }

  // const match = await getMatchById(matchId);
  const odds = await getMatchOdds(matchId, team);

  const {
    id: uid,
    displayName
  } = req.user || {};

  if (!uid) {
    throw new Error('you are not logged in!');
  }


  // const existingBet = await Bet.findOne({ uid, matchId });
  // if (existingBet) {
  //   throw new Error(`You already bet on this match!`);
  // }

  await Bet.deleteOne({ uid, matchId });

  const bet = {
    uid,
    matchId,
    team,
    odds
  };
  const savedBet = await Bet.create(bet);

  console.debug(`user placed bet: id = [${savedBet._id}] ${displayName}: ${JSON.stringify(savedBet)}`);


  res.redirect(`/match/${matchId}`);
}));

module.exports = router;