const { Router } = require("express");
const router = new Router();
const Movie = require("./sequelize-rest");

router.get("/movie?", (req, res, next) => {
	const limit = req.query.limit || 10;
	const offset = req.query.offset || 0;
	Movie.findAndCountAll({ limit, offset })
		.then(movie =>
			res.send({ movies: movie.rows, total: movie.count, offset: movie.offset })
		)
		.catch(error => next(error));
});

router.get("/movie/:movieId", (req, res, next) => {
	Movie.findByPk(parseInt(req.params.movieId))
		.then(movie => {
			if (!movie) {
				return res.status(404).send();
			} else {
				res.send(movie);
			}
		})
		.catch(err => next(err));
});

router.post("/movie", (req, res, next) => {
	//Validate if content to post exist
	if (Object.keys(req.body).length === 0) {
		return res.status(204).send();
	}

	//Initialize properties when content not provided
	let { title, yearOfRelease, synopsis } = req.body;
	{
		!title && (title = "");
	}
	{
		!yearOfRelease && (yearOfRelease = 0);
	}
	{
		!synopsis && (synopsis = "");
	}

	//Post content
	Movie.create({
		title: title,
		yearOfRelease: yearOfRelease,
		synopsis: synopsis
	})
		.then(movie => res.send(movie))
		.catch(err => next(err));
});

router.patch("/movie/:movieId", (req, res, next) => {
	Movie.findByPk(parseInt(req.params.movieId))
		.then(movie => {
			if (!movie) {
				return res.status(404).send();
			}
			if (Object.keys(req.body).length === 0) {
				return res.status(204).send();
			}
			movie
				.update(req.body)
				.then(movie => res.send(movie))
				.catch(() =>
					res.status(400).send({ message: "Error in updating record" })
				);
		})
		.catch(err => next(err));
});

router.delete("/movie/:movieId", (req, res, next) => {
	Movie.destroy({
		where: {
			id: req.params.movieId
		}
	})
		.then(delCount => res.send("Movie deleted: " + delCount))
		.catch(err => next(err));
});
module.exports = router;
