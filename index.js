const bodyParser = require('body-parser');
const express = require('express'),
    morgan = require('morgan'),
    mongoose = require('mongoose'),
    Models = require('./models.js'),
    passport = require('passport');

    const Movies = Models.Movie;
    const Users = Models.User;
    require('./passport');

    mongoose.connect('mongodb://localhost:27017/moovivdb', { useNewUrlParser: true, useUnifiedTopology: true });

    const app = express();

app.use(morgan('common'));
app.use(bodyParser.json());
app.use(express.static('public'));
let auth = require('./auth')(app);





app.get('/', (req, res) =>{
    res.send('Welcome to MooVIV page!');
});

//GET all movies

app.get('/movies', passport.authenticate('jwt', { session: false}), (req, res) => {
    Movies.find()
        .then((movies) => {
            res.status(201).json(movies);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error: " + err);
        });
});

//GET Movie by Title

app.get('/movies/:Title', passport.authenticate('jwt',{session: false}), (req, res) =>{
  Movies.findOne({ Title:req.params.Title})
      .then((movie) => {
          res.status(201).json(movie)
      })
      .catch((err) =>{
          console.error(err);
          res.status(500).send('Error: ' + err);
      });
});

// GET genre by title

app.get('/movies/Genres/:Title', passport.authenticate('jwt',{session: false}), (req, res) =>{
  Movies.findOne({ Title : req.params.Title})
  .then((movie) => {
    res.status(201).json(movie.Genre.Name + ": " + movie.Genre.Description);
  })
  .catch((err) =>{
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

//GET info about Director

app.get('/movies/Directors/:Name', passport.authenticate('jwt',{session: false}), (req, res) => {
  Movies.findOne({ "Director.Name" : req.params.Name})
  .then((movie) => {
      res.status(201).json(movie.Director.Name + ": " + movie.Director.Bio);
  })
  .catch((err) =>{
      console.error(err);
      res.status(500).send('Error: ' + err);
  });
});

// Get all users

app.get('/users', passport.authenticate('jwt',{session: false}), (req, res) => {
  Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Get User bu Username

app.get('/users/:Username', passport.authenticate('jwt',{session: false}), (req, res) => {
  Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//POST new user

app.post('/users', (req, res) => {
  Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + 'already exists');
      } else {
        Users
          .create({
            Username: req.body.Username,
            Password: req.body.Password,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
          .then((user) =>{res.json(user) })
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

app.put('/users/:Username', passport.authenticate('jwt',{session: false}), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username},
    { $set: {
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthdate: req.body.Birthdate
      }
    },
    {new: true},
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedUser);
      }
    });
  });

// POST new movie to fav list

app.post('/users/:Username/Movies/:MovieID', passport.authenticate('jwt',{session: false}), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
    $push: { FavoriteMovies: req.params.MovieID }
  },
  { new: true },
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.status(201).json(updatedUser);
    }
  });
});

// DELETE movie from fav

app.delete('/users/:Username/Favorites/:MovieID', passport.authenticate('jwt',{session: false}), (req, res) =>{
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

app.delete('/users/:Username', passport.authenticate('jwt',{session: false}), (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
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