require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const app = express();
const Person = require("./models/person.js");

app.use(express.json());
app.use(express.static("dist"));

morgan.token("data", (request, response) => {
	if (request.method === "POST") {
		return `${JSON.stringify(request.body)}`;
	} else {
		return " ";
	}
});

app.use(
	morgan(
		`:method :url :status :res[content-length] - :response-time ms :data`,
	),
);

app.get("/api/persons", (request, response) => {
	Person.find({}).then((person) => {
		response.json(person);
	});
});

app.get("/api/info", (request, response) => {
	const date = new Date();
	Person
		.countDocuments({})
		.then((res) => {
			let data = `<p>Phonebook has info for ${res} people</p>`;
			data += `<p>${date.toString()}</p>`;

			response.send(data);
		});
});

app.get("/api/persons/:id", (request, response, next) => {
	Person
		.findById(request.params.id)
		.then((person) => {
			response.json(person);
		})
		.catch((error) => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
	const id = request.params.id;
	Person
		.findByIdAndDelete(id)
		.then((res) => {
			console.log(res);
			response.status(204).end();
		})
		.catch((error) => next(error));
});

app.post("/api/persons", (request, response, next) => {
	const data = request.body;

	if (!data.name || !data.number) {
		return response.status(400).json({ error: "content missing" });
	}

	const person = new Person({
		name: data.name,
		number: data.number,
	});

	person
		.save()
		.then((p) => {
			response.json(p);
		})
		.catch((error) => next(error));
});

app.put("/api/persons/:id", (request, response, next) => {
	const { name, number } = request.body;

	Person.findById(request.params.id)
		.then((person) => {
			if (!person) {
				response.status(400).end();
			}

			person.name = name;
			person.number = number;

			return person.save().then((res) => {
				response.json(res);
			});
		})
		.catch((error) => next(error));
});

const errorHandler = (error, request, response, next) => {
	console.log(error.message);

	if (error.name === "ValidationError") {
		return response.status(400).json({ error: error.message });
	}

	next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT);

console.log("app running on port", PORT);
