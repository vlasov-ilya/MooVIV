const express = require('express'),
    morgan = require('morgan');

const app = express();


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
        title: 'Avattar',
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

app.use(morgan('common'));

app.use(express.static('public'));

app.get('/', (req, res) =>{
    res.send('Welcome to MooVIV page!');
});

app.get('/movie', (req, res) => {
    res.json(topMovies);
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

app.listen(8080, ()=>{
    console.log('Your app is listening on port 8080.');
});