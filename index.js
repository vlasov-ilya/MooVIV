const express = require('express'),
    morgan = require('morgan');

const app = express();

const mongoose = require('mongoose');
const Models = require('./models.js');

app.use(morgan('common'));

app.use(express.static('public'));

const Movies = Models.Movies;
const Users = Models.Users;

mongoose.connect('mongodb://localhost:27017/moovivdb', { useNewUrlParser: true, useUnifiedTopology: true });


app.get('/', (req, res) =>{
    res.send('Welcome to MooVIV page!');
});

//GET all movies

app.get('/movies', (req, res) => {
    Movies.find()
        .then((Movies) => {
            res.status(201).json(Movies);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error: " + err);
        });
});

// Get all users

app.get('/users', (req, res) => {
  Users.find()
    .then((Users) => {
      res.status(201).json(Users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Get User bu Username

app.get('/users/:Username', (req, res) => {
  Users.findOne({ Username: req.params.Username })
    .then((Users) => {
      res.json(Users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//GET Movie by Title

app.get('/movie/:title', (req, res) =>{
    Movies.findOne({ Title:req.params.Title})
        .then((Movies) => {
            res.status(201).json(Movies)
        })
        .catch((err) =>{
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

//GET info about Director

app.get('/movie/Director/:Name', (req, res) => {
    Movies.findOne({ "Director.Name" : req.params.Name})
    .then((Movies) => {
        res.status(201).json(Movies.Director.Name + ": " + Movies.Director.Bio);
    })
    .catch((err) =>{
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

//POST new user

app.post('/users', (req, res) => {
  Users.findOne({ Username: req.body.Username })
    .then((Users) => {
      if (Users) {
        return res.status(400).send(req.body.Username + 'already exists');
      } else {
        Users
          .create({
            Username: req.body.Username,
            Password: req.body.Password,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
          .then((Users) =>{res.status(201).json(Users) })
        .catch((error) => {
          console.error(error);
          res.status(500).send('Error: ' + error);
        })
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

// PUT updates to users info

app.put('/users/:Username', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, { $set:
    {
      Username: req.body.Username,
      Password: req.body.Password,
      Email: req.body.Email,
      Birthday: req.body.Birthday
    }
  },
  { new: true },
  (err, updatedUsers) => {
    if(err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUsers);
    }
  });
});

// POST new movie to fav list

app.post('/users/:Username/Movies/:MovieID', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
     $push: { FavoriteMovies: req.params.MovieID }
   },
   { new: true },
  (err, updatedUsers) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUsers);
    }
  });
});

// Put updates to user information
app.put('/users/:Username', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username},
    { $set: {
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthdate: req.body.Birthdate
      }
    },
    {new: true},
    (err, updatedUsers) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.status(201).json(updatedUsers);
      }
    });
  });

// DELETE movie from fav

app.delete('/users/:Username/Favorites/:MovieID', (req, res) =>{
       Users.findOneAndUpdate(  
         { Username: req.params.Username},
      { $pull: { FavoriteMovies: req.params.MovieID}
    },
    {new: true},
     (err, updatedUsers) => {
      if(err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
     } else {
       res.json(updatedUsers);
     }
   });
 });

// DELETE users account

app.delete('/users/:Username', (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
    .then((Users) => {
      if (!Users) {
        res.status(400).send(req.params.Username + ' was not found');
      } else {
        res.status(200).send(req.params.Username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(8080, ()=>{
    console.log('Your app is listening on port 8080.');
});