import express from "express"
//const uuid = require('uuid')

import { PrismaClient } from '@prisma/client' //prisma é um ARM

const prisma = new PrismaClient()

const port = 3000
const app = express()
app.use(express.json())

//const users = []

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

//MANEIRA ANTIGA DE FAZER
// app.put('/users/:id', checkUserId, (request, response) => {
//     const { name, age } = request.body
//     const index = request.userIndex
//     const id = request.userId

//     const updateUser = {id, name, age}

//     users[index] = updateUser

//     return response.json(updateUser)
// })

//NOVO MODE DE FAZER COM MongoDB
app.put('/usuarios/:id', async (request, response) => {

    const user = await prisma.user.update({
        where:{
            id: request.params.id
        },
         data:{
             email: request.body.email,
             age: request.body.age, 
             name: request.body.name
         }
     })
 
     response.status(200).json(user)
 })
 
 app.delete('/usuarios/:id', async (request, response) => {
    await prisma.user.delete({
        where: {
            id: request.params.id
        }
    })

    response.status(200).json({ message: "usuário deletado"})
 })

//MÓDULO ANTIGO DE NODE
// app.post('/users', (request, response) => {
//     const {name, age} = request.body
//     const user = {id:uuid.v4(), name, age}

//     users.push(user)

//     return response.status(201).json(user)
// })

//MÓDULO NOVO USANDO MONGODB
app.post('/usuarios', async (request, response) => {

   const user = await prisma.user.create({
        data:{
            email: request.body.email,
            age: request.body.age, 
            name: request.body.name
        }
    })

    console.log(user)
    response.status(201).json({ message: "Usuário criado com sucesso"})
})

app.get('/usuarios', async (request, response) => {

    // ROUTE PARAMS exemplo: '/users/:id'
    // const {id} = request.params
    // console.log(id)
    //----------------------------------
    // const {name, age} = request.body
    //----------------------------------

    //agora fazendo um belo trabalho usando banco de dados MongoDB
    const users = await prisma.user.findMany()


    response.status(200).json(users)
})

app.listen(port, () => {
    console.log(`🚀 Server started on port ${port} `)
})