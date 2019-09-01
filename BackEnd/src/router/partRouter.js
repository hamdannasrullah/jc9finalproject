const router = require('express').Router()
const conn = require('../connection/connection')
const multer = require('multer')
const path = require('path') // MENENTUKAN FOLDER UNTUK UPLOAD

const uploadDir = path.join(__dirname + '/../images' )

const storagE = multer.diskStorage({
    
    filename : function(req, file, cb) {
        cb(null, Date.now() + file.fieldname + path.extname(file.originalname))
    },
    destination : function(req, file, cb) {
        cb(null, uploadDir)
    }
})

const upload = multer ({
    storage: storagE,
    limits: {
        fileSize: 100000000 // DALAM SATUAN BYTE
    },
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){ 
            return cb(new Error('Please upload image file (jpg, jpeg, or png)')) 
        }
        cb(undefined, cb)
    }
})

router.get('/part/images/:images', (req,res) => {
    res.sendFile(`${uploadDir}/${req.params.images}`)
})


// === MENAMPILKAN PART === //
router.get('/part/:userid',(req,res) => {
    const sql = `SELECT * FROM part  WHERE id NOT IN(SELECT g.id FROM part g JOIN user_part ug ON g.id = ug.part_id WHERE ug.user_id = ${req.params.userid})`
    
    conn.query(sql,(err,result) => {
        if (err) return res.send(err.sqlMessage)

        result.map(item => {
            item.part_image = (`http://localhost:2020/part/images/${item.part_image}?v=` +Date.now())
        })
        
        
        res.send(result)
    })
})


// === MENAMPILKAN SEMUA PART === //

router.get('/part',(req,res) => {
    const sql = `SELECT * FROM part`

    conn.query(sql,(err,result) => {
        if (err) return res.send(err.sqlMessage)

        res.send(result)
    })
})

// === MENAMBAHKAN PART === //

router.post('/part/add', (req,res) => {
    sql = `INSERT INTO part SET ?`
    sql2 =  `SELECT * FROM part`
    data = req.body

    conn.query(sql,data, (err) => {
        if(err) return res.send(err.sqlMessage)
        
        conn.query(sql2, (err,result) => {
            if(err) return res.send(err.sqlMessage)
            
            res.send(result)
        })
    })
})

// === DELETE PART === //
router.delete('/part/:partid', (req, res) => {
    const sql = `DELETE FROM part WHERE id = ?`
    const data = req.params.partid

    conn.query(sql, data,  (err, result) => {
        if(err) return res.send(err)

        res.send(result)
    })
})

// === MENGEDIT PART === //
router.patch('/part/edit/:partid',(req,res) => {
    const sql = `UPDATE part SET ? WHERE id = ?`
    const data = [req.body, req.params.partid]

    conn.query(sql,data,(err,result) => {
        if (err) return res.send(err.sqlMessage)

        res.send(result)
    })
})


// === MENGEDIT PART PRODUCT === //
router.patch('/partproducts/edit/:id',(req,res) => {
    const sql = `UPDATE product_part SET ? WHERE id = ?`
    const sql2 = `SELECT * FROM product_part`

    const data = [req.body,req.params.id]
    
    conn.query(sql,data, (err,result) => {
        if (err) return res.send(err.sqlMessage)
        
        conn.query(sql2,(err,result) => {
            if (err) return res.send(err.sqlMessage)

            res.send(result)
        })
        
    })
})


// === PARTS PRODUCT === //
router.get('/partproducts',(req,res) => {
    const sql = `SELECT pg.id,product_name,name FROM product_part pg JOIN products p ON p.id = pg.product_id JOIN part g ON g.id = pg.part_id`

    conn.query(sql,(err,result) => {
        if (err) return res.send(err.sqlMessage)
        
        console.log(result)
        
        res.send(result)
    })
})


module.exports = router