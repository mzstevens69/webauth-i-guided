const router = require('express').Router();
const bcrypt = require('bcryptjs');
const Users = require('../users/users-model.js');
const uuid = require('uuid');

const activeSessions = [];

router.post('/register', (req, res) => {
  const { username, password } = req.body;

  const bcryptHash = bcrypt.hashSync(password, 10);
  // generating a random salt
  // hashing (password + randomsalt)
  // hashing the hash etc 2 ^ 10 times!!!!!!!
  // making the final "hash" by concatenating the following
  // <algo><numberOfRounds><theActualSalt><theHashProper>
  const user = {
    username,
    password: bcryptHash,
  };

  Users.add(user)
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

router.post('/login', (req, res) => {
  let { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
      // it's taking the bcrypt thing and breaking it into parts
      // <algo><10><foo><theactualhash>
      // recomputes the <theactualhash>
      // compares against the credentials req.body.password
      if (user && bcrypt.compareSync(password, user.password)) {
        // if the password likez
        // let's generate a unique id to simbolize this "login"
        const sessionId = uuid();
        activeSessions.push(sessionId);
        res.cookie('sessionId', sessionId, { maxAge: 900000 });
        res.status(200).json({ message: `Welcome ${user.username}!` });
      } else {
        res.status(401).json({ message: 'Invalid Credentials' });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

module.exports = router;
