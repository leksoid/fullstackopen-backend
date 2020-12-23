const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const personSchema = new mongoose.Schema({
	id: Number,
	name: {
		type: String,
		minlength: 2,
		required: true,
		unique: true
	},
	phone: {
		type: String,
		minlength: 10,
		required: true,
		unique: true
	},
	date: Date
})

personSchema.plugin(uniqueValidator)

personSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
	}
})

module.exports = mongoose.model('Person', personSchema)