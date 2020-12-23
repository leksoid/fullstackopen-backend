// handle invalid URL requests, like /api/yadda
const unknownEndpoint = (req, res) => {
	res.status(404).send({ error: 'unknown endpoint' })
}

// custom middleware to handle errors
const errorHandler = (error, req, res, next) => {
	if (error.name === 'CastError') {
		return res.status(400).send({ error: 'malformed id' })
	} else if (error.name === 'ValidationError') {
		return res.status(400).send({ error: error.message })
	}
	next(error)
}

module.exports = {
	unknownEndpoint,
	errorHandler
}