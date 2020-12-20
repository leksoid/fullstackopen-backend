let persons = [
    {
        "name": "Alessandro Gonzaler",
        "id": 1,
        "phone": "567-435-6567"
    },
    {
        "name": "Alex Jones",
        "id": 2,
        "phone": "567-453-1245"
    },
    {
        "name": "Federico Fellini",
        "id": 3,
        "phone": "234-232-1323"
    },
    {
        "name": "Alexandro Tunarino",
        "id": 4,
        "phone": "777-789-1245"
    }
]

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

morgan.token('req-data', (req) => {
    return JSON.stringify(req.body)
})

const app = express()
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req-data'))
app.use(cors())
app.use(express.static('build'))

const generateId = () => {
    const id = Math.random() * (10 ** 20)
    return id
}

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(entry => entry.id === id)
    if (person) {
        res.json(person)
    } else res.status(404).end()
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(entry => entry.id !== id)
    res.status(204).end()
})

app.post('/api/persons', (req, res) => {
    const body = req.body

    if (!body.name || !body.phone) {
        return res.status(400).json({ 
          error: 'missing name or phone number' 
        })
      }
    
    if (persons.find(entry => entry.name === body.name)) {
        return res.status(400).json({
            error: 'etry already exists'
        })
    }

    const entry = {
        name: body.name,
        date: new Date(),
        phone: body.phone,
        id: generateId()
    }

    persons = persons.concat(entry)
    res.json(entry)
})

app.get('/info', (req, res) => {
    res.send(`<p>The phonebook has ${persons.length} entries so far ...</p><p>${Date()}</p>`)
})

const unknownEndpoint = (req, res) => {
    res.status(404).send({error: 'unknown endpoint'})
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001 
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})