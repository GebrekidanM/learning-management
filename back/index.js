var express = require('express')
var cors = require('cors')
var UserRouter = require('./routes/user')


var app = express()
app.use(express.json())
app.use(cors())


app.use('/user',UserRouter)

app.listen(4000,()=>{
    console.log("here we go")
})

