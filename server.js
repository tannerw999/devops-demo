const express = require('express')
const app = express()
const path = require('path')
const cors = require('cors');

app.use(express.json())
app.use(cors());

// include and initialize the rollbar library with your access token
var Rollbar = require('rollbar')
var rollbar = new Rollbar({
  accessToken: '85669532598249fb9e7ad103e7be1f35',
  captureUncaught: true,
  captureUnhandledRejections: true,
})

// record a generic message and send it to Rollbar
rollbar.log('Hello world!')

const students = ['Jimmy', 'Timothy', 'Jimothy']

app.get('/', (req, res) => {
    rollbar.info("someone loaded up your html!")
    res.sendFile(path.join(__dirname, '/index.html'))
})

app.get('/api/students', (req, res) => {
    rollbar.info("Someone got the list of students to load.")
    res.status(200).send(students)
})

app.post('/api/students', (req, res) => {
   let {name} = req.body

   const index = students.findIndex(student => {
       return student === name
   })

   try {
       if (index === -1 && name !== '') {
           rollbar.log("Student added successfully", {author: "Tanner", 
           type: "manual entry"})
           students.push(name)
           res.status(200).send(students)
       } else if (name === ''){
            rollbar.errorHandler("No name provided.")   
        res.status(400).send('You must enter a name.')
       } else {
            rollbar.error("Studen already exsist")   
        res.status(400).send('That student already exists.')
       }
   } catch (err) {
       console.log(err)
   }
})

app.delete('/api/students/:index', (req, res) => {
    const targetIndex = +req.params.index
    
    students.splice(targetIndex, 1)
    rollbar.info("Student was deleted.")
    res.status(200).send(students)
})

const port = process.env.PORT || 5050

app.listen(port, () => console.log(`Server listening on ${port}`))
