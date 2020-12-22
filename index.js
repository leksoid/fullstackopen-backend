// get the env vars from .env file
require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

// custom token to output the body of requests (spec for POST)
morgan.token('req-data', (req) => {
	return JSON.stringify(req.body)
})

const app = express()
// middlewares
app.use(express.static('build'))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req-data'))
app.use(cors())

// GET all people
app.get('/api/persons', (req, res) => {
	Person.find({}).then(persons => {
		res.json(persons)
	})
})

// GET the person by ID
app.get('/api/persons/:id', (req, res, next) => {
	Person.findById(req.params.id).then(person => {
		console.log(person)
		if(person) {
			res.json(person)
		} else {
			res.status(404).end()
		}
	}).catch(error => next(error))
})

// DELETE the person by ID
app.delete('/api/persons/:id', (req, res, next) => {
	Person.findByIdAndRemove(req.params.id)
		.then(result => {
			res.status(204).end()
		})
		.catch(error => next(error))
})

// POST new person
app.post('/api/persons', (req, res, next) => {
	const body = req.body

	if (!body.name || !body.phone) {
		return res.status(400).json({
			error: 'missing name or phone number'
		})
	}

	const person = new Person({
		name: body.name,
		date: new Date(),
		phone: body.phone
	})
	person.save()
		.then(saved => {
			res.json(saved)
		})
		.catch(error => next(error))
})

// PUT updates for person by ID
app.put('/api/persons/:id', (req, res, next) => {
	const body = req.body

	const person = {
		phone: body.phone
	}

	Person.findByIdAndUpdate(req.params.id, person, { new: true })
		.then(updated => {
			res.json(updated)
		})
		.catch(error => next(error))
})

app.get('/info', (req, res) => {
	Person.find({}).then(persons => {
		res.send(`<p>The phonebook has ${persons.length} entries so far ...</p><p>${Date()}</p>`)
	})
})

// handle invalid URL requests, like /api/yadda
const unknownEndpoint = (req, res) => {
	res.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

// custom middleware to handle errors
const errorHandler = (error, req, res, next) => {
	console.log(error)
	if (error.name === 'CastError') {
		return res.status(400).send({ error: 'malformed id' })
	} else if (error.name === 'ValidationError') {
		return res.status(400).send({ error: error.message })
	}
	next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})