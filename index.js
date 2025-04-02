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

const errorHandler = (error, request, response, next) => {
	console.log(error.message);

	next(error);
};

app.use(errorHandler);

let persons = [
	{
		"id": "1",
		"name": "Arto Hellas",
		"number": "040-123456",
	},
	{
		"id": "2",
		"name": "Ada Lovelace",
		"number": "39-44-5323523",
	},
	{
		"id": "3",
		"name": "Dan Abramov",
		"number": "12-43-234345",
	},
	{
		"id": "4",
		"name": "Mary Poppendieck",
		"number": "39-23-6423122",
	},
];

app.get("/api/persons", (request, response) => {
	Person.find({}).then((person) => {
		response.json(person);
	});
});

app.get("/api/info", (request, response) => {
	const date = new Date();
	let data = `<p>Phonebook has info for ${persons.length} people</p>`;
	data += `<p>${date.toString()}</p>`;

	response.send(data);
});

app.get("/api/persons/:id", (request, response, next) => {
	Person.findById(request.params.id).then((person) => {
		response.json(person);
	})
		.catch((error) => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
	const id = request.params.id;
	Person.findByIdAndDelete(id).then((res) => {
		console.log(res);
		response.status(204).end();
	})
		.catch((error) => next(error));
});

app.post("/api/persons", (request, response) => {
	const data = request.body;

	if (!data.name || !data.number) {
		return response.status(400).json({ error: "content missing" });
	}

	const isDup = persons.find((p) => p.name === data.name);
	if (isDup) {
		return response.status(400).json({ error: "duplicate entry" });
	}

	const person = new Person({
		name: data.name,
		number: data.number,
	});

	person.save().then((p) => {
		console.log(p);
	});
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

const PORT = process.env.PORT;
app.listen(PORT);

console.log("app running on port", PORT);
