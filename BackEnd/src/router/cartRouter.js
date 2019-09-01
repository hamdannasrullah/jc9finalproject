const router = require('express').Router()
const conn = require('../connection/connection')

// === ADD TO CART === //
router.post('/cart/add',(req,res) => {
    const data = req.body
    const sql = `SELECT * FROM shopping_cart WHERE user_id = ${data.user_id} AND product_id = ${data.product_id}`
    const sql2 = `INSERT INTO shopping_cart SET ?`
    const sql3 = `SELECT * FROM shopping_cart WHERE user_id = ${data.user_id}`

    conn.query(sql, (err,result) => {
        if (err) return res.send(err.message)
        
        if(result.length !== 0) return res.status(400).send('Item sudah ada di keranjang Anda')
        
        conn.query(sql2, data, (err, result2) => {
            if (err) return res.send(err.sqlMessage)
            
            conn.query(sql3,(err,result3) => {
                if (err) return res.send(err.sqlMessage)
                

                res.send(result3)
            })
            
        })

    })
})

// === SHOW CART === //

router.get(`/cart/:userid`,(req,res) => {
    const sql = ` SELECT p.id, p.product_name, p.price,p.stock, p.image, brand_name, s.quantity, p.stock 
                    FROM shopping_cart s 
                        JOIN products p ON p.id = s.product_id 
                            JOIN brand a ON a.id = p.brand 
                                WHERE s.user_id = ${req.params.userid}`

    conn.query(sql,(err,result) => {
        if (err) return res.send(err.sqlMessage)

        result.map(item =>{
            item.image = (`http://localhost:2020/product/images/${item.image}?v=` +Date.now())
        })

        res.send(result)
    })
})

// === DELETE CART === //

router.delete('/cart/delete/:productid/:userid', (req,res) => {
    const data = req.params
    const sql = `DELETE FROM shopping_cart WHERE product_id = ${data.productid} AND user_id = ${data.userid}`
    const sql2 = `SELECT count(*) AS cart FROM shopping_cart WHERE user_id = ${data.userid}`

    conn.query(sql, (err,result) => {
        if (err) return console.log(err.message)
        
        conn.query(sql2,(err,result2) => {
            if (err) return console.log(err.message)
            
            res.send(result2)
        })
    })  
})

// === EDIT CART === //

router.patch('/cart/update/:userid/:productid',(req,res) => {
    const sql = `UPDATE shopping_cart SET quantity = ${req.body.quantity} WHERE user_id = ${req.params.userid} AND product_id = ${req.params.productid}`
    const sql2 = `SELECT * FROM shopping_cart WHERE user_id = ${req.params.userid}`
    
    conn.query(sql,(err,result) => {
        console.log(req.body.quantity)
        
        if (err) return console.log(err.message + '1')

        console.log(result)
        
        
        conn.query(sql2,(err,result2) => {
            if (err) return console.log(err.message + '2')

            console.log(result2)
            

            res.send(result2)
        })

    })
})


module.exports = router