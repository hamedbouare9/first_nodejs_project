// Import modules, packages and data

const express = require('express')
const favicon = require('serve-favicon')
const morgan = require('morgan')
const { success, getUniqueId } = require('./helper.js')
let pokemons = require('./mock-pokemon')
const bodyParser = require('body-parser')
const app = express()
const port = 3000

const mongoose = require('mongoose')
const db_url = 'mongodb+srv://hamed:Hb77548138@cluster0.hdqaxry.mongodb.net/node-app?retryWrites=true&w=majority'

// Acces to database
mongoose.connect(db_url)
        .then ((result)=> {
            console.log('connexion etablie avec succès')
            app.listen(port, () => console.log(`Notre application Node est demarée sur http://localhost:${port}`))
        })
        .catch ((err)=>{
            console.log(err)
        })

// Middleware Express
app
    .use(favicon(__dirname+'/favicon.ico'))
    .use(morgan('dev'))
    .use(bodyParser.json())

// Api get, post, put and delete
app.get('/', (req, res) => res.send('Hello, Express Again lola !'))

app.get('/api/pokemons/:id', (req,res) => {
    const id = parseInt(req.params.id)
    const pokemon = pokemons.find(pokemon => pokemon.id === id)
    const message = 'Un pokemon a bien été trouvé'  
     res.json(success(message, pokemon))})

app.get('/api/pokemons', (req, res) => {
    const messages = 'La liste des pokemons a bien été chargée'
    res.json(success(messages, pokemons))
})

app.post('/api/pokemons', (req, res)=>{
    const id = getUniqueId(pokemons)
    const pokemonCreated = {...req.body,...{id:id, created:new Date()}}
    pokemons.push(pokemonCreated)
    const message = `Le pokemon, ${pokemonCreated.name} a été bien crée`
    res.json(success(message, pokemonCreated))}
)


app.put('/api/pokemons/:id', (req, res)=>{
    const id = parseInt(req.params.id)
    const pokemonUpdated = { ...req.body, id:id } 
    pokemons = pokemons.map(pokemon =>{
        return pokemon.id === id ? pokemonUpdated:pokemon
    })
    const message = `Le pokemon, ${pokemonUpdated.name} a été bien modifié`
    res.json(success(message, pokemonUpdated))}
)


app.delete('/api/pokemons/:id', (req, res)=> {
    const id = parseInt(req.params.id)
    const pokemonDeleted = pokemons.find(pokemon=>pokemon.id===id )
    pokemons.filter(pokemon => pokemon.id !== id)
    const message = `Le pokemon, ${pokemonDeleted.name} a été bien supprimé`
    res.json(success(message, pokemonDeleted))})

