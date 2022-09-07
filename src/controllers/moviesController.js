const db = require('../database/models');
const moment = require("moment");

const sequelize = db.sequelize;

//Otra forma de llamar a los modelos
const Movies = db.Movie;

const moviesController = {
    list: (req, res) => {
        db.Movie.findAll()
            .then((movies) => {
                res.render('moviesList', {movies})
            })
    },
    detail: (req, res) => {
        db.Movie.findByPk(req.params.id)
            .then((movie) => {
                res.render('moviesDetail', {movie});
            });
    },
    new: (req, res) => {
        db.Movie.findAll({
            order : [
                ['release_date', 'DESC']
            ],
            limit: 5
        })
            .then((movies) => {
                res.render('newestMovies', {movies});
            });
    },
    recomended: (req, res) => {
        db.Movie.findAll({
            where: {
                rating: {[db.Sequelize.Op.gte] : 8}
            },
            order: [
                ['rating', 'DESC']
            ]
        })
            .then((movies) => {
                res.render('recommendedMovies', {movies});
            });
    }, //Aqui debemos modificar y completar lo necesario para trabajar con el CRUD
    add: function (req, res) {
        db.Genre.findAll({
            order : [
                ["name", "ASC"]
            ],
        })
            .then((genres) => {
                return res.render("moviesAdd", {
                    genres
                });
            })
            .catch(error => console.log(error))
    },
    create: function (req, res) {
        const { title, award, release_date, genre_id, rating, length } = req.body
        db.Movie.create({
            title : title.trim(),
            award : +award,
            release_date,
            rating : +rating,
            length : +length,
            genre_id : +genre_id
        })
        .then(movie => {
            console.log(movie);
            return res.redirect("/movies/detail/" + movie.id)
        })
        .catch(error => console.log(error))
    },
    edit: function(req, res) {
        let movie = db.Movie.findByPk(req.params.id)
        let genres = db.Genre.findAll({
            order : ["name"]
        })
        Promise.all([movie, genres])
            .then(([movie, genres]) => {
                /* movie.release_date = moment(movie.release_date).format("YYYY-MM-DD") */
                return res.render("moviesEdit", {
                    Movie : movie,
                    release_date : moment(movie.release_date).format("YYYY-MM-DD"),
                    genres
                })
            })
            .catch(error => console.log(error))
    },
    update: function (req,res) {
        const { title, awards, release_date, genre_id, rating, length } = req.body;
        db.Movie.update(
            {
                title : title.trim(),
                awards : +awards,
                release_date,
                rating : +rating,
                length : +length,
                genre_id : +genre_id
            },
            {
                where : {
                    id : req.params.id
                }
            }
        )
        .then(() => res.redirect("/movies/detail/" + req.params.id))
        .catch(error => console.log(error))
    },
    delete: function (req, res) {
        db.Movie.findByPk(req.params.id)
            .then(movie => res.render("moviesDelete", {
                movie
            }))
            .catch(error => console.log(error))
    },
    destroy: function (req, res) {
        db.Movie.destroy({
            where : {
                id : req.params.id
            }
        })
        .then(() => res.redirect("/movies"))
        .catch(error => console.log(error))
    }
}

module.exports = moviesController;