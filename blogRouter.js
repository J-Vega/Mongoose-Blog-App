
const express = require('express');
const router = express.Router();

const {BlogPost} = require('./models');

router.get('/', (req, res) => {
  BlogPost
    .find()
    .then(posts => {
      res.json(posts.map(post => post.serialize()));
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'something went terribly wrong' });
    });
});

router.get('/:id', (req, res) => {
  BlogPost
    .findById(req.params.id)
    .then(post => res.json(post.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'something went horribly awry' });
    });
});


if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err));
}

module.exports = router;