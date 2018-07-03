'use strict';

const express = require("express");
const app = express();
app.use(express.json());


const morgan = require("morgan");
app.use(morgan("common"));

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
 
var bodyParser = require('body-parser');

//const blogRouter = require("./blogRouter");

const {DATABASE_URL, PORT} = require('./config');
const {BlogPost} = require('./models')

//app.use(express.static("public"));

// app.get('/', (req, res) => {
//   BlogPost
//   .find()
//     .then(
//       blogPosts => {
//         console.log(blogPosts);
//       res.json(blogPosts.map(post => post.serialize()));
//     })
//     .catch(err => {
//       console.error(err);
//       res.status(500).json({ error: 'something went wrong' });
//     });
// });


app.get('/blogPosts', (req, res) => {
  BlogPost
    .find()
    .then(blogPosts => {
      res.json({
        "Blog Posts": blogPosts.map(
          (blogPost) => blogPost.serialize())
      });
    })
    .catch(
      err => {
        console.error(err);
        res.status(500).json({message: 'Internal server error'});
    });
});

//Seems to be working when excluding map function, as shown in the console log, but it is not showing up in postman
// can't get post to show up in postman
app.get('/blogPosts/:id', (req, res) => {
  BlogPost
    .findById(req.params.id)
      .then(blogPost => {
        res.json("Blog Posts": blogPosts.map(post => post.serialize());
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({ error: 'something went wrong' });
      });
});

app.post('/blogPosts', (req, res) => {
  const requiredFields = ['title', 'content', 'author'];
  console.log(req.body.title);
  console.log(req.body.content);
  console.log(req.body.author);
  //Make sure all required fields exist in body
  for (let i = 0; i < requiredFields.length; i++){

    const element = requiredFields[i];
    console.log(element);
    //If any of the required elements do not exist, advise which element is missing and
    // return 400 error message
    if(!(element in req.body)){
      return res.status(400).send(`Missing requied field: ${element}`);
    }
  }
  //Make the post 
  BlogPost
    .create({
      title: req.body.title,
      content: req.body.content,
      author: req.body.author
    })
    .then(blogPost => res.status(201).json(blogPost.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({error: 'Something went wrong'});

    });

});

app.delete('/blogPosts/:id', (req, res) => {
  BlogPost
    .findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).json({ message: 'success' });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'something went terribly wrong' });
    });
});

app.put('/blogPosts/:id', (req, res) => {
  //Check ID first - ID of req must match the post
  if(!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    res.status().json({
      error: 'Request ID must match with the Body ID'
    });
  }

const updated = {};
  const updateableFields = ['title', 'content', 'author'];
  updateableFields.forEach(field => {
    if (field in req.body) {
      updated[field] = req.body[field];
    }
  });
  //???????????????   I can't get the success message to display
  BlogPost
    .findByIdAndUpdate(req.params.id, { $set: updated }, { new: true })
    .then(updatedPost => res.status(204).json({ message: 'success' }).end())
    .catch(err => res.status(500).json({ message: 'Something went super wrong' }));

});

//Wildcard?
app.use('*', function (req, res) {
  res.status(404).json({ message: 'Not Found' });
});


let server;

function runServer(databaseUrl, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
        .on('error', err => {
          mongoose.disconnect();
          reject(err);
        });
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

// if server.js is called directly (aka, with `node server.js`), this block
// runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.
if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };