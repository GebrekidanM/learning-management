var express = require('express')
var cors = require('cors')
var app = express()

app.use(cors())
app.use(express.json())

app.listen(4000,()=>{
    console.log("here we go")
})