require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const { response } = require('express')
const Person = require('./models/person')



app.use(express.json())
app.use(express.static('build'))
app.use(cors())

app.use(morgan((tokens, req, res) => {
  return [tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    JSON.stringify(req.body)].join(' ')}))

let persons = [
      { 
        name: "Arto Hellas", 
        number: "040-123456",
        id: 1
      },
      { 
        name: "Ada Lovelace", 
        number: "39-44-5323523",
        id: 2
      },
      { 
        name: "Dan Abramov", 
        number: "12-43-234345",
        id: 3
      },
      { 
        name: "Mary Poppendieck", 
        number: "39-23-6423122",
        id: 4
      }
    ]

let date = Date()

    app.get('/info', (req, res) => {
    res.send(`Phonebook has info for ${persons.length} people` + "<br />" + date)
    
    })

    app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
      res.json(persons)
    })
    })

    app.get('/api/persons/:id', (req, res) => {
        const id = Number(req.params.id)
        const person = persons.find(person => person.id === id)

        if (person) {
            res.json(person)
          } else {
            res.status(404).end()
          }
    })

    app.delete('/api/persons/:id', (req, res) => {
        const id = Number(req.params.id)
        persons = persons.filter(person => person.id !== id)
    
        res.status(204).end()
    })
    
    const generateId = () => {
      const maxId = persons.length > 0
        ? Math.max(...persons.map(p => p.id))
        : 0
      return maxId + 1
    }
    
    app.post('/api/persons', (req, res) => {
      const body = req.body
    
      if (!body.name) {
        return res.status(400).json({ 
          error: 'name missing' 
        })
      }
      if (!body.number) {
        return res.status(400).json({ 
          error: 'number missing' 
        })
      }
    
      const person = new Person({
        name: body.name,
        number: body.number,
        id: generateId()
      })

      person.save()
        .then(savedPerson => {
          res.json(savedPerson)
        })
            
      const findPerson = persons.find(person => person.name === body.name)
      console.log(findPerson)
      if (findPerson !== undefined) {
        return res.status(400).json({ 
          error: 'name must be unique' 
        })
        
      }
      else {
        persons = persons.concat(person)
        res.json(person)
        }
      
    })

    const PORT = process.env.PORT
    app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
    })