const mongoose = require("mongoose");

if (process.argv.length < 2) {
	console.log("give password to connect");
	process.exit(1);
}

const password = process.argv[2];

const url =
	`mongodb+srv://sajal:${password}@cluster0.y9okr5b.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.connect(url);

const personSchema = new mongoose.Schema({
	name: String,
	number: String,
});

const Person = mongoose.model("Person", personSchema);

if (process.argv.length < 4) {
	Person
		.find({})
		.then((res) => {
			res.forEach((p) => {
				console.log(p);
			});
			mongoose.connection.close();
		});
} else {
	const name = process.argv[3];
	const number = process.argv[4];

	const person = new Person({ name, number });

	person.save().then((result) => {
		console.log(result);
		mongoose.connection.close();
	});
}
