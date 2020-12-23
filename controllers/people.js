const peopleRouter = require('express').Router()
const Person = require('../models/person')

// GET all people
peopleRouter.get('/', (req, res) => {
	Person.find({}).then(persons => {
		res.json(persons)
	})
})

// GET the person by ID
peopleRouter.get('/:id', (req, res, next) => {
	Person.findById(req.params.id).then(person => {
		if(person) {
			res.json(person)
		} else {
			res.status(404).end()
		}
	}).catch(error => next(error))
})

// DELETE the person by ID
peopleRouter.delete('/:id', (req, res, next) => {
	Person.findByIdAndRemove(req.params.id)
		.then(result => {
			res.status(204).end()
		})
		.catch(error => next(error))
})

// POST new person
peopleRouter.post('/', (req, res, next) => {
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
peopleRouter.put('/:id', (req, res, next) => {
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

module.exports = peopleRouter