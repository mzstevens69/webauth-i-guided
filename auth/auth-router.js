const router = require('express').Router();

const Users = require('../users/users-model.js');

const bcrypt = require('bcryptjs');

router.post('/register', (req, res) => {
  let user = req.body;

  const hash = bcrypt.hashSync(req.body.password, 12);

  user.password = hash;
// hash password before saving user

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
      if (user && bcrypt.compareSync(password, user.password)) {
        // check if password is valid
        
        res.status(200).json({ message: `Welcome ${user.username}!` });
      } else {
        res.status(401).json({ message: 'Invalid Credentials' });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});
router.get('/secret', (req, res, next) => {
  if(req.headers.authorization) {
    bcrypt.hash(req.headers.authorization, 12, (err, hash) => {
      if(err) {
        res.status(500).json({ err: 'oops it broke!'}); 
      } else {
        res.status(200).json({ hash });
      }
    })
  } else {
    res.status(400).json({ error: "missing header"})
  }
});

module.exports = router;
