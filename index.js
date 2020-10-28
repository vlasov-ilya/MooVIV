const express = require('express'),
    morgan = require('morgan'),
    mongoose = require('mongoose'),
    Models = require('./models.js');

    const Movies = Models.Movie;
    const Users = Models.User;

    mongoose.connect('mongodb://localhost:27017/moovivdb', { useNewUrlParser: true, useUnifiedTopology: true });


    const app = express();


app.use(morgan('common'));

app.use(express.static('public'));





app.get('/', (req, res) =>{
    res.send('Welcome to MooVIV page!');
});

//GET all movies

app.get('/movies', (req, res) => {
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

app.get('/movies/:Title', (req, res) =>{
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

app.get('/movies/Genres/:Title', (req, res) =>{
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

app.get('/movies/Directors/:Name', (req, res) => {
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

app.get('/users', (req, res) => {
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

app.get('/users/:UserName', (req, res) => {
  Users.findOne({ UserName: req.params.UserName })
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
    Users.findOne({ UserName: req.body.UserName })
      .then((user) => {
        if (user) {
          return res.status(400).send(req.body.UserName + 'already exists');
        } else {
          Users.create({
            UserName: req.body.UserName,
            Password: req.body.Password,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
            .then((user) => { res.status(201).json(user); })
            .catch((err) => {
              console.error(err);
              res.status(500).send('Error: ' + err);
            });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      });
  });

// PUT updates to users info
app.put('/users/:UserName', (req, res) => {
  Users.findOneAndUpdate({ UserName: req.params.UserName},
    { $set: {
        UserName: req.body.UserName,
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
        res.status(201).json(updatedUser);
      }
    });
  });

// POST new movie to fav list

app.post('/users/:UserName/Movies/:MovieID', (req, res) => {
  Users.findOneAndUpdate({ UserName: req.params.UserName }, {
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

app.delete('/users/:UserName/Favorites/:MovieID', (req, res) =>{
       Users.findOneAndUpdate(  
         { UserName: req.params.UserName},
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

app.delete('/users/:UserName', (req, res) => {
  Users.findOneAndRemove({ UserName: req.params.UserName })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.UserName + ' was not found');
      } else {
        res.status(200).send(req.params.UserName + ' was deleted.');
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