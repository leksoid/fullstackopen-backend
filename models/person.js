const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const url = process.env.MONGODB_URI

console.log('connecting to ... ', url)

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
	.then(result => {
		console.log('Connected to MongoDB')
	})
	.catch(error =>  {
		console.log('Error connecting to MongoDB:', error.message)
	})

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