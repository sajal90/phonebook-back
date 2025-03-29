const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

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
	response.json(persons);
});

app.get("/api/info", (request, response) => {
	const date = new Date();
	let data = `<p>Phonebook has info for ${persons.length} people</p>`;
	data += `<p>${date.toString()}</p>`;

	response.send(data);
});

app.get("/api/persons/:id", (request, response) => {
	const id = request.params.id;

	const person = persons.find((p) => p.id === id);

	if (person) {
		response.json(person);
	} else {
		response.status(404).end();
	}
});

app.delete("/api/persons/:id", (request, response) => {
	const id = request.params.id;
	persons = persons.filter((p) => p.id != id);

	response.status(204).end();
});

const generateId = () => {
	return parseInt(Math.random() * 1000000);
};

app.post("/api/persons", (request, response) => {
	const data = request.body;

	if (!data.name || !data.number) {
		return response.status(400).json({ error: "content missing" });
	}

	const isDup = persons.find((p) => p.name === data.name);
	if (isDup) {
		return response.status(400).json({ error: "duplicate entry" });
	}

	const person = {
		name: data.name,
		number: data.number,
		id: String(generateId()),
	};

	persons = persons.concat(person);
	//	console.log(person);

	response.status(201).json(person);
});

const PORT = 3001;
app.listen(PORT);

console.log("app running on port", PORT);
