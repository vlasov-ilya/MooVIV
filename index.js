const express = require('express'),
    morgan = require('morgan');

const app = express();

app.use(morgan('common'));

app.use(express.static('public'));

let topMovies = [
    {
        title: 'Never Back Down',
        director: 'Jeff Wadlow',
        year: 2008
    },
    {
        title: 'Step Up',
        director: 'Anne Fletcher',
        year: 2006
    },
    {
        title: 'The Fast and the Furious',
        director: 'Rob Cohen',
        year: 2001
    },
    {
        title: 'Avatar',
        director: 'James Cameron',
        year: 2009
    },
    {
        title: 'Fight Club',
        director: 'David Fincher',
        year: 1999
    },
    {
        title: 'Titanic',
        director: 'James Cameron',
        year: 1997
    },
    {
        title: 'Back to the Future',
        director: 'Robert Zemeckis',
        year: 1985
    },
    {
        title: 'Forest Gump',
        director: 'Robert Zemeckis',
        year: 1994
    },
    {
        title: 'Ghostbusters',
        director: 'Ivan Reitman',
        year: 1984
    },
    {
        title: 'Gladiator',
        director: 'Ridley Scott',
        year: 2000
    }
];

app.get('/', (req, res) =>{
    res.send('Welcome to MooVIV page!');
});

//GET all movies

app.get('/movie', (req, res) => {
    res.send('Successful GET request returning data on all movies');
});

//GET Movie by Title

app.get('/movie/:title', (req, res) =>{
    res.send('Successful GET request returning data on movie title: ' + req.params.title);
});

//GET info by Director

app.get('/movie/:director', (req, res) => {
    res.send('Successful GET request returning data on director :'+ req.params.director);
});

//POST new user

app.post('/user', (req, res) =>{
    res.send('Successful POST request registering new user');
});

// PUT updates to users info

app.put('/user/:name', (req, res) =>{
    res.send('Successful PUT request to update users: '+ req.params.name +' info');
});

// POST new movie to fav list

app.post('/user/:name/movie/:title', (req, res) =>{
    res.send('Successful POST request to add movie '+ req.params.title +' too '+ req.params.name + ' favorite list');
});

// DELETE movie from fav

app.delete('/user/:name/movie/:title', (req, res) =>{
    res.send('Successful DELETE request. movie '+ req.params.title + ' was deleted from '+ req.params.name +' favorite list');
});

// DELETE users account

app.delete('/user/:name', (req, res) =>{
    res.send('Successfully DELETE of '+ req.params.name + ' information from server');
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(8080, ()=>{
    console.log('Your app is listening on port 8080.');
});