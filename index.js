const express = require('express')
const uuid = require('uuid')

const port = 3000
const app = express()
app.use(express.json())

const users = []

// //Você sabe o que é um Middleware? então aqui vai um...
// const myFirstMiddleware = (request, response, next) => {
    
//     console.log("fui chamado galo!")

//     next()//aqui está a mágica meu nobre
// }

// app.use(myFirstMiddleware)//preciso falar o que isso aqui faz ? ;)

const checkUserId = (request, response, next) => {
    const { id }  = request.params

    const index = users.findIndex(user => user.id === id)

    if(index < 0){
        return response.status(404).json({ error: "User not found"})
    }

    request.userIndex = index
    request.userId = id
    next()
}

app.delete('/users/:id', checkUserId, (request, response) => {
    const index = request.userIndex

    users.splice(index,1)

    return response.status(204).json()
})

app.put('/users/:id', checkUserId, (request, response) => {
    const { name, age } = request.body
    const index = request.userIndex
    const id = request.userId

    const updateUser = {id, name, age}

    users[index] = updateUser

    return response.json(updateUser)
})

app.post('/users', (request, response) => {
    const {name, age} = request.body
    const user = {id:uuid.v4(), name, age}

    users.push(user)

    return response.status(201).json(user)
})

app.get('/users', (request, response) => {

    // ROUTE PARAMS exemplo: '/users/:id'
    // const {id} = request.params
    // console.log(id)
    //----------------------------------
    // const {name, age} = request.body
    //----------------------------------
    return response.json(users)
})

app.listen(port, () => {
    console.log(`🚀 Server started on port ${port} `)
})