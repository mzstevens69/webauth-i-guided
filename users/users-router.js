const router = require('express').Router();
const { protected } = require('../auth/auth-router')
const Users = require('./users-model.js');

router.get('/', protected, (req, res) => {
  Users.find()
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

module.exports = router;
