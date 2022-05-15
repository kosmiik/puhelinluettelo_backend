const { render } = require('express/lib/response')
const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const personName = process.argv[3]
const personNumber = process.argv[4]
const book = "phonebook:"

const url =
  `mongodb+srv://kosmiik:${password}@puhelinluettelo.5ft0s.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
  name: personName,
  number: personNumber,
})
console.log(personName)
if (personName || personNumber !== undefined) {
    person.save().then(result => {
        console.log(`added ${personName} number ${personNumber} to phonebook`)
        mongoose.connection.close()
    })
    
}

else {
    console.log('phonebook:')
    Person
        .find({})
        .then(persons => {
        persons.forEach(person => {
          console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
      })
}