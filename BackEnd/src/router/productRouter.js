const router = require('express').Router()
const conn = require('../connection/connection')
const multer = require('multer')
const path = require('path') // Menentukan folder uploads
const fs = require('fs') // menghapus file gambar

const uploadDir = path.join(__dirname + '/../images' )
// const uploadDirr = path.join(__dirname + '/../promo' )

const storagE = multer.diskStorage({
    
    filename : function(req, file, cb) {
        cb(null, Date.now() + file.fieldname + path.extname(file.originalname))
    },
    // Destination
    destination : function(req, file, cb) {
        cb(null, uploadDir)
    }
})
const storages = multer.diskStorage({
    
    filename : function(req, file, cb) {
        cb(null, Date.now() + file.fieldname + path.extname(file.originalname))
    },
    // Destination
    destination : function(req, file, cb) {
        cb(null, uploadDirr)
    }
})

const upload = multer ({
    storage: storages,
    limits: {
        fileSize: 100000000 // Byte
    },
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){ // will be error if the extension name is not one of these
            return cb(new Error('Please upload image file (jpg, jpeg, or png)')) 
        }
        cb(undefined, cb)
    }
})
const uploads = multer ({
    storage: storagE,
    limits: {
        fileSize: 100000000 // Byte
    },
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){ // will be error if the extension name is not one of these
            return cb(new Error('Please upload image file (jpg, jpeg, or png)')) 
        }
        cb(undefined, cb)
    }
})

// link images
router.get('/product/images/:images', (req,res) => {
    res.sendFile(`${uploadDir}/${req.params.images}`)
})

//add product
router.post('/products/add', uploads.single('images'), (req,res) => {
    const sql = `INSERT INTO products SET ?`
    
    data = req.body

    conn.query(sql,data, (err,result) => {
        if(err) return console.log(err)
        
        
        const sql2 = `UPDATE products SET image  = '${req.file.filename}' WHERE id = '${result.insertId}'`
        
        conn.query(sql2, (err) => {
            if(err) return res.send(err.sqlMessage)

            const sql3 =  `SELECT * FROM products WHERE id = '${result.insertId}'`
            
            conn.query(sql3, (err,result3) => {
                if(err) return res.send(err.sqlMessage)

                
                res.send(result3)
            })
        })


    })
})

//show all product
router.get('/products', (req,res) => {
    const sql = `SELECT p.id,product_name,stock,price,weight,a.brand_name,ps.specification_name, image 
                    FROM products p 
                        LEFT JOIN brand a ON a.id = p.brand 
                            LEFT JOIN specification ps ON ps.id = p.specification`
        
    conn.query(sql, (err,result) => {
        if(err) return res.send(err.sqlMessage)

        result.map(item =>{
            item.image = (`http://localhost:2020/product/images/${item.image}?v=` +Date.now())
        })
        
        
        res.send(result)
    })
})

//show all product new
router.get('/products/new', (req,res) => {
    const sql = `SELECT p.id,product_name,stock,price,weight,a.brand_name,ps.specification_name, image 
                    FROM products p 
                        JOIN brand a ON a.id = p.brand 
                            JOIN specification ps ON ps.id = p.specification 
                                ORDER BY created_at DESC LIMIT 8`
        
    conn.query(sql, (err,result) => {
        if(err) return res.send(err.sqlMessage)

        result.map(item =>{
            item.image = (`http://localhost:2020/product/images/${item.image}?v=` +Date.now())
        })
        
        
        res.send(result)
    })
})

//show detail product
router.get('/product/:idproduct', (req,res) => {
    const sql = `SELECT p.id, product_name, stock, price, weight, a.brand_name, ps.specification_name, description, image 
                    FROM products p 
                        JOIN brand a ON a.id = p.brand 
                            JOIN specification ps ON ps.id = p.specification WHERE p.id = ${req.params.idproduct}`
        
    conn.query(sql, (err,result) => {
        if(err) return res.send(err.sqlMessage)
        
        result.map(item =>{
            item.image = (`http://localhost:2020/product/images/${item.image}?v=` +Date.now())
        })

        res.send(result)
          
    })
})

//edit product
router.patch('/products/edit/:idproduct', uploads.single('image'), (req,res) => {
    const data = [req.body, req.params.idproduct]
    const sql = `UPDATE products SET ? WHERE id = ?`
    const sql2 = `SELECT * FROM products WHERE id = ${data[1]}`
    const sql3 = `UPDATE products SET image  = '${req.file.filename}' WHERE id = '${data[1]}'`

    conn.query(sql, data, (err) => {
        if (err) return res.send(err.message)

        conn.query(sql3,(err) => {
            if (err) return res.send(err.message)


            conn.query(sql2, (err,result3) => {
                if (err) return res.send(err.message)
                
                res.send(result3)
            })
        })
        

    })
})

//show part product
router.get('/product/part/:idproduct',(req,res) => {
    const data = req.params.idproduct
    const sql = `SELECT p.id, product_name, stock,price, weight, a.brand_name, ps.specification_name, description, image 
                    FROM products p 
                        JOIN brand a ON a.id = p.brand 
                            JOIN specification ps ON ps.id = p.specification 
                                WHERE p.id = ${data}`
    const sql2 = `SELECT name 
                    FROM part g 
                        JOIN product_part pg ON g.id = pg.part_id 
                            WHERE pg.product_id = ${data}`

    conn.query(sql, (err,result) => {
        if (err) return res.send(err.mess)
        
        result.map(item =>{
            item.image = (`http://localhost:2020/product/images/${item.image}?v=` +Date.now())
        })

        const product = result[0]
        conn.query(sql2,data, (err,result2) => {
            if (err) return res.send(err.mess)

            res.send({
                product,
                result2
            })
        })
    })
})

//add part product
router.post('/product/addpart', (req,res) => {
    const data = [req.body]
    
    const sql = `SELECT product_id, part_id FROM product_part WHERE product_id=${data[0].product_id} AND part_id=${data[0].part_id}`
    const sql2 = 'INSERT INTO product_part SET ?'
    const sql3 = `SELECT * FROM product_part`

            conn.query(sql,data, (err,result) => {
                if(err) return res.send(err.sqlMessage)
                if(result.length !== 0) return res.status(400).send('Part is already choosen')
                conn.query(sql2, data, (err) => {
                    if(err) return res.send(`result2 : ${err.sqlMessage} ${data[0].product_id}`)
    
                    conn.query(sql3, (err, result3) => {
                        if(err) return res.send(err.sqlMessage)
    
                        res.send(result3)

                        })
                    })
                })
            })


//edit part product
router.patch('/product/editpart/:idproduct', (req,res) => {
    const data = {}
    const idproduct = req.params.idproduct
    const partid = req.body.id
    const partidnew = req.body.idnew
    const sql = `SELECT id FROM products WHERE id = '${idproduct}'`
    const sql2 = `SELECT id FROM part WHERE id = '${partid}'`
    const sql3 = `SELECT product_id, part_id FROM product_part WHERE product_id = '${idproduct}' AND part_id = '${partid}'`
    const sql4 = `UPDATE product_part SET part_id = '${partidnew}' WHERE product_id = '${idproduct}' AND part_id = '${partid}'`
    const sql5 = `SELECT * FROM products WHERE id = '${idproduct}'`
    const sql6 = `SELECT name FROM part g JOIN product_part ug ON g.id = ug.part_id WHERE ug.product_id = ${idproduct}`

    conn.query(sql, (err, result) => {
        if(err) return res.send(err.sqlMessage)
        if(result.length === 0) return res.status(400).send('product Not Found')
        
        data.product_id = result[0].id

        conn.query(sql2, (err, result2) => {
            if(err) res.send(err.sqlMessage)
            if(result2.length === 0) return res.status(400).send('Part Not Found')
            
            data.part_id = result2[0].id

            conn.query(sql3, (err,result3) => {
                if(err) return res.send(err.sqlMessage)
                
                if(result3.length === 0) return res.status(400).send('Part Not Found')
                conn.query(sql4, data, (err) => {
                    if(err) return res.send(err.sqlMessage)
    
                    conn.query(sql5, (err, result5) => {
                        if(err) return res.send(err.sqlMessage)
    
                        const product = result5[0]
                        
                        conn.query(sql6, (err,result6) => {
                            if(err) return res.send(err.sqlMessage)
    
                            res.send({
                                product,result6
                            })
                        })
                    })
                })
            })

        })
})
})

// DELETE PRODUCT BY ID
router.delete('/products/:productid', (req, res) => {
    const sql = `DELETE FROM products WHERE id = ?`
    const data = req.params.productid

    conn.query(sql, data,  (err, result) => {
        if(err) return res.send(err)

        res.send(result)
    })
})

// DELETE PART PRODUCT
router.delete('/product/deletepart/:idproduct', (req,res) => {
    const idproduct = req.params.idproduct
    const partid = req.body.id
    const sql = `DELETE FROM product_part WHERE product_id = '${idproduct}' AND part_id = '${partid}'`
    const sql2 = `SELECT * FROM products WHERE id = ${idproduct}`
    const sql3 = `SELECT name FROM part g JOIN product_part ug ON g.id = ug.part_id WHERE ug.product_id = ${idproduct}`

    conn.query(sql, (err) => {
        if(err) return res.send(err.sqlMessage)
        
        conn.query(sql2, (err,result2) => {
            if(err) return res.send(err.sqlMessage)

            const product = result2[0]
            
            conn.query(sql3, (err,result3) => {
                if(err) return res.send(err.sqlMessage)
                
                res.send({product,result3})
                
            })
        })
    })
})

//product by user part
router.get('/products/:part',(req,res) => {
    const data = req.params.part
    const sql = `SELECT id FROM part WHERE name = '${data}'`
    
    
    conn.query(sql, (err,result) => {
        
        const partid = result[0].id
        
        const sql2 = `SELECT p.id,product_name,stock,price,weight,a.brand_name,ps.specification_name, image 
                        FROM products p 
                            JOIN brand a ON a.id = p.brand 
                                JOIN specification ps ON ps.id = p.specification 
                                    JOIN product_part pg ON p.id = pg.product_id 
                                        WHERE pg.part_id = ${partid} `

    
        conn.query(sql2, (err,result2) => {
            if(err) return res.send(err.sqlMessage)

            result2.map(item =>{
                item.image = (`http://localhost:2020/product/images/${item.image}?v=` +Date.now())
            })
            
            res.send(result2)
        })
        
    })
})

//product by user part recommended
router.get('/product/recommended/:id', (req, res) => {
    const data = req.params.id
    const sql = `SELECT * FROM products p 
                    JOIN brand a ON a.id = p.brand 
                        JOIN product_part pg ON p.id = pg.product_id 
                            WHERE pg.part_id IN(SELECT part_id FROM user_part WHERE user_id = ${data}) 
                                ORDER BY updated_at ASC LIMIT 8 `
                                
    conn.query(sql, (err, result) => {
        if (err) return res.send(err.sqlMessage)

        result.map(item =>{
            item.image = (`http://localhost:2020/product/images/${item.image}?v=` +Date.now())
        })

        res.send(result)

        
      })
})

//show brand
router.get('/brand',(req,res) => {
    const sql = `SELECT * FROM brand`

    conn.query(sql,(err,result) => {
        if (err) return res.send(err.sqlMessage)

        res.send(result)
    })
})

//edit brand
router.patch('/brand/edit/:brandid',(req,res) => {
    const sql = `UPDATE brand SET ? WHERE id = ?`
    const data = [req.body, req.params.brandid]

    conn.query(sql,data,(err,result) => {
        if (err) return res.send(err.sqlMessage)

        res.send(result)
    })
})

//add brand
router.post('/brand/add', (req,res) => {
    sql = `INSERT INTO brand SET ?`
    sql2 =  `SELECT * FROM brand`
    data = req.body

    conn.query(sql,data, (err) => {
        if(err) return res.send(err.sqlMessage)
        
        conn.query(sql2, (err,result) => {
            if(err) return res.send(err.sqlMessage)
            
            res.send(result)
        })
    })
})

// DELETE BRAND BY ID
router.delete('/brand/:brandid', (req, res) => {
    const sql = `DELETE FROM brand WHERE id = ?`
    const data = req.params.brandid

    conn.query(sql, data,  (err, result) => {
        if(err) return res.send(err)

        res.send(result)
    })
})

//add specification
router.post('/specification/add', (req,res) => {
    sql = `INSERT INTO specification SET ?`
    sql2 =  `SELECT * FROM specification`
    data = req.body

    conn.query(sql,data, (err) => {
        if(err) return res.send(err.sqlMessage)
        
        conn.query(sql2, (err,result) => {
            if(err) return res.send(err.sqlMessage)
            
            res.send(result)
        })
    })
})

//edit specification
router.patch('/specification/edit/:specificationid',(req,res) => {
    const sql = `UPDATE specification SET ? WHERE id = ?`
    const data = [req.body, req.params.specificationid]

    conn.query(sql,data,(err,result) => {
        if (err) return res.send(err.sqlMessage)

        res.send(result)
    })
})

//show specification
router.get('/specification',(req,res) => {
    const sql = `SELECT * FROM specification`

    conn.query(sql,(err,result) => {
        if (err) return res.send(err.sqlMessage)

        res.send(result)
    })
})

// DELETE SPECIFICATION BY ID
router.delete('/specification/:specificationid', (req, res) => {
    const sql = `DELETE FROM specification WHERE id = ?`
    const data = req.params.specificationid

    conn.query(sql, data, (err, result) => {
        if(err) return res.send(err)

        res.send(result)
    })
})


module.exports = router