const info = (...params) => {
	console.log(...params)
}

const error = (...params) => {
	console.log(...params)
}

const morgan = require('morgan')
// custom token to output the body of requests (spec for POST)
morgan.token('req-data', (req) => {
	return JSON.stringify(req.body)
})

module.exports = {
	info, error, morgan
}