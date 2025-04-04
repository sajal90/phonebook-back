const mongoose = require("mongoose");

const url = process.env.MONGODB_URI;

mongoose.set("strictQuery", true);
mongoose
	.connect(url)
	.then((r) => {
		console.log("mongodb connected");
	})
	.catch((e) => {
		console.log("error connecting: ", e);
	});

const personSchema = new mongoose.Schema({
	name: {
		type: String,
		minLength: 3,
	},
	number: String,
});

personSchema.set("toJSON", {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
	},
});

module.exports = mongoose.model("Person", personSchema);
