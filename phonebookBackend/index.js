const express = require('express')
const app = express()
const morgan = require('morgan')

app.use(express.json())

morgan.token('postBody', function getPostBody (req) {
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :response-time ms - :postBody'))



const PORT = 3001

let persons = [
      {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
      },
      {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
      },
      {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
      },
      {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
      }
  ]

app.get('/',(request, response) => {
    response.send('<h1>Hello</h1>')
})

app.get('/api/persons',(request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id',(request, response) => {
    const id = Number(request.params.id)
    const foundPerson = persons.find( person => person.id === id)

    if(foundPerson){
        response.json(foundPerson)
    }
    else response.status(404).end()
})

app.get('/info',(request, response) => {
    const timestamp = new Date()
    response.send(`
    <p>
        Phonebook has info for ${persons.length} people
    </p>
    <p>
        ${timestamp}
    </p>`)
})

app.delete('/api/persons/:id',(request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

const generateId = () => {
    return Math.floor(Math.random() * 10000);
  }

app.post('/api/persons',(request, response) => {
    const body = request.body

    if (!body.name) {
        return response.status(400).json({ 
          error: 'name missing' 
        })
    }

    if (persons.find(person => person.name === body.name)) {
        return response.status(400).json({ 
          error: 'name must be unique' 
        })
    }

    if (!body.number) {
        return response.status(400).json({ 
          error: 'number missing' 
        })
    }

    

    console.log(body)
    const person = {
        name: body.name,
        number: body.number,
        id: generateId()
    }

    persons = persons.concat(person)

    response.json(person)
})



app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})