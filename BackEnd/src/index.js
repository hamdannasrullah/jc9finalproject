const express = require('express')
const cors = require('cors')
const userRouter = require('./router/userRouter')
const productRouter = require('./router/productRouter')
const partRouter = require('./router/partRouter')
const cartRouter = require('./router/cartRouter')
const orderRouter = require('./router/orderRouter')
const bankRouter = require('./router/bankRouter')

const app = express()
const port = process.env.PORT || 2020

app.get('/', (req,res) => {
    res.send(`<h1>API sukses berjalan di Port ${port}</h1>`)
})

app.use(cors())
app.use(express.json())
app.use(userRouter)
app.use(productRouter)
app.use(partRouter)
app.use(cartRouter)
app.use(orderRouter)
app.use(bankRouter)

app.listen(port, () => {
    console.log('Running di Port', port)
    
})