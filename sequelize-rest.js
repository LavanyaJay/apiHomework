const Sequelize = require("sequelize");
const databaseUrl = "postgres://postgres:secret@localhost:5432/postgres";
const db = new Sequelize(databaseUrl);
const Movie = db.define("movie", {
	title: {
		type: Sequelize.STRING
	},
	yearOfRelease: {
		type: Sequelize.INTEGER
	},
	synopsis: {
		type: Sequelize.STRING
	}
});
db.sync()
	.then(() => console.log("Database Started"))
	.then(() => {
		Movie.bulkCreate([
			{
				title: "The Lion King",
				yearOfRelease: 1994,
				synopsis:
					"This Disney animated feature follows the adventures of the young lion Simba"
			},
			{
				title: "Toy Story",
				yearOfRelease: 1995,
				synopsis:
					"Toy Story is about the 'secret life of toys' when people are not around."
			},
			{
				title: "Despicable Me",
				yearOfRelease: 2010,
				synopsis:
					"It follows the story of Gru, a super-villain who adopts three girls from an orphanage"
			}
		]).then(movies => movies.map(movie => console.log(movie.dataValues)));
	})

	.catch(err => {
		console.log("DB error...shuting down database", err);
		process.exit(1);
	});

module.exports = db;
module.exports = Movie;
