const router = require('express').Router()
const bcrypt = require('bcryptjs') // LIBRARY UNTUK HASH PASSWORD
const isEmail = require('validator/lib/isEmail')
const { sendMail } = require('../email/nodemailer')
const conn = require('../connection/connection')
const multer = require('multer') // MENGUPLOAD FOTO/GAMBAR
const path = require('path') // MENENTUKAN FOLDER UNTUK UPLOAD
const fs = require('fs') // MENGHAPUS FILE

const uploadDir = path.join(__dirname + '/../uploads')
const uploadDirr = path.join(__dirname + '/../images' )

// === REGISTRASI === //
router.post('/user/register', async (req, res) => {
  // === CREATE USER === //
  var sql = `INSERT INTO user SET ?` // Tanda tanya akan digantikan oleh variable data
  var data = req.body
  

  // === CEK VALIDASI EMAIL === //
  if (!isEmail(req.body.email)) return res.status(400).send('Bukan Alamat Email') 
  
  // === MENGACAK PASSWORD === //
  req.body.password = await bcrypt.hash(req.body.password, 8)

  conn.query(sql, data, (err, result) => {
    // === APABILA TERJADI ERROR AKAN DITAMPILKAN === //
    if (err) return res.status(400).send(err.sqlMessage)

    // sendVerify(req.body.username, req.body.name, req.body.email)
    sendMail(req.body.username, req.body.email)

    const sql2 = `UPDATE user SET role = '2' WHERE id = ${result.insertId}`

    conn.query(sql2, (err, result) => {
      if (err) return res.status(400).send(err +'2')

      console.log(result)

      res.send(result)
    })
  })
})


// === VERIFIKASI STATUS EMAIL === //
router.get('/verify', (req, res) => {
  const username = req.query.username
  const sql = `UPDATE user SET status = true WHERE username = '${username}'`
  const sql2 = `SELECT * FROM user WHERE username = '${username}'`

  conn.query(sql, (err, result) => {
    if (err) return res.send(err.sqlMessage)

    conn.query(sql2, (err, result) => {
      if (err) return res.send(err.sqlMessage)

      res.sendFile(path.join(__dirname + '/verifikasi.html'))
    })
  })
})

// === USER LOGIN === //
router.post('/users/login', (req, res) => {
  const { username, password } = req.body

  const sql = `SELECT u.id, firstname, lastname, email, password, status, role, birthday, avatar, username, address, kodepos, phone_number, gender, count(s.user_id) AS cart 
                  FROM user u LEFT JOIN shopping_cart s ON u.id = s.user_id WHERE username = '${username}' GROUP BY u.id`

  conn.query(sql, async (err, result) => {
    console.log(username)
    
    if (err) return res.send(err.message + ' - 1')

    result.map(item =>{
      item.avatar = (`http://localhost:2020/users/avatar/${item.avatar}?v=` +Date.now())
    })

    const user = result[0]
    
    
    if (!user) return res.status(400).send('Pengguna tidak ditemukan!')
    
    // if (!user.status) return res.status(400).send('Mohon verifikasi terlebih dahulu Email yang didaftarkan!')
    
    const hash = bcrypt.compareSync(password, user.password)
    
    // if (!hash) return res.status(400).send('Wrong password')

    if (user.role !== 2) return res.status(400).send('Pengguna tidak ditemukan!')

    res.send(user)
  })
})



// === ADMIN LOGIN === //
router.post('/admin/login', (req, res) => {
  const { username, password } = req.body

  const sql = `SELECT * FROM user WHERE username = '${username}'`

  conn.query(sql, async (err, result) => {
    if (err) return res.send(err.message)

   

    const user = result[0]

    if (!user) return res.status(400).send('Bukan Admin!')

    // if (!user.status) return res.status(400).send('Mohon verifikasi terlebih dahulu Email yang didaftarkan!')

    const hash = await bcrypt.compare(password, user.password)

    // if (!hash) return res.status(400).send('Wrong password')

    if (user.role !== 1)
      return res
        .status(400)
        .send('Akun Anda tidak terdaftar sebagai Administrator!')

    res.send(user)
  })
})

const storagE = multer.diskStorage({
  filename: function(req, file, cb) {
    cb(null, Date.now() + file.fieldname + path.extname(file.originalname))
  },
  destination: function(req, file, cb) {
    cb(null, uploadDir)
  }
})

const upload = multer({
  storage: storagE,
  limits: {
    fileSize: 10000000 // SATUAN BYTE
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('Mohon hanya upload file gambar dengan ekstensi .jpg, .jpeg, atau .png'))
    }
    cb(undefined, cb)
  }
})

// === UPLOAD AVATAR === //
router.post('/avatar/uploads/:userid', upload.single('avatar'), (req, res) => {
  const sql = `UPDATE user SET avatar  = '${req.file.filename}' WHERE id = '${
    req.params.userid
  }'`

  conn.query(sql, (err, result) => {
    if (err) return res.send(err.sqlMessage)

    res.send({ filename: req.file.filename })
  })
})

// === LINK AVATAR YANG TELAH DI-UPLOAD === //
router.get('/users/avatar/:avatar', (req, res) => {
  res.sendFile(`${uploadDir}/${req.params.avatar}`)
})

// === MENAMPILKAN AVATAR === //
router.get('/avatar', (req, res) => {
  const sql = `SELECT * FROM user WHERE username = ?`
  var data = req.body.username

  conn.query(sql, data, (err, result) => {
    if (err) return res.send(err)
    res.send({
      users: result[0],
      photo: `http://localhost:2020/avatar/${result[0].avatar}`
    })
  })
})


// === MENGHAPUS AVATAR === //
router.get('/avatar/delete', (req, res) => {
  const sql = `SELECT * FROM user WHERE username = ?`
  const sql2 = `UPDATE user SET avatar = NULL WHERE username = ?`
  var data = req.body.username

  conn.query(sql, data, (err, result) => {
    if (err) return res.send(err)

    fs.unlink(`${uploadDir}/${result[0].avatar}`, err => {
      if (err) throw err
    })
    conn.query(sql2, data, (err, result) => {
      if (err) return res.send(err)

      res.send('Delete Success')
    })
  })
})


// === MENAMPILKAN PROFIL === //
router.get('/users/profile/:userid', (req, res) => {
  const data = req.params.userid

  const sql = `SELECT *, YEAR(CURDATE()) - YEAR(birthday) AS age FROM user WHERE id = '${data}'`

  conn.query(sql, data, (err, result) => {
    if (err) return res.send(err.message)

    const user = result[0] // RESULT BERUPA ARRAY OF OBJECT

    if (!user) return res.status(400).send('Pengguna tidak ditemukan!')

    res.send({
      user,
      photo: `http://localhost:2020/users/avatar/${user.avatar}`
    })
  })
})

// === UPDATE USER === //
router.patch('/users/:userid', (req, res) => {
  const sql = `UPDATE user SET ? WHERE id = ${req.params.userid}`
  const sql2 = `SELECT * FROM USER WHERE id = ${req.params.userid}`
  const data = [req.body]

  conn.query(sql, data, (err, result) => {
    if (err) return res.send(err.message)

    conn.query(sql2, (err, result) => {
      if (err) return res.send(err.message)
      
      res.send(result)
    })
  })
})

// === MERUBAH PASSWORD === //
router.patch('/password/:userid',(req,res) => {
  const data = req.body
  const sql = `select password from user where id = ${req.params.userid}`
  
  conn.query(sql, async(err,result) => {
    
    if (err) return res.send(err.message)
    
    const hash = await bcrypt.compare(data.password, result[0].password)
    
    if (!hash) return res.status(400).send('Password keliru!')    
    
    // if(data.newpass !== data.confirmpass) res.status(400).send('Password baru dan yang dikonfirmasi tidak cocok!')
    
    data.confirmpass = await bcrypt.hash(data.confirmpass, 8)
    
    const sql2 = `update user set password = '${data.confirmpass}' where id = ${req.params.userid}`

    conn.query(sql2, (err,result) => {
      if (err) return console.log(err)
      
      
      res.send(result)
    })
  })

})

router.get('/part/images/:images', (req,res) => {
  res.sendFile(`${uploadDirr}/${req.params.images}`)
})


// === MENAMPILKAN USER === //
router.get('/users', (req, res) => {
  const sql = `SELECT user.id,firstname,lastname,username,email,status, r.name AS role_name,birthday,address,k.kodepos,avatar 
                FROM user 
                  JOIN list_kodepos k ON user.kodepos = k.id 
                    JOIN role r ON user.role = r.id`
  conn.query(sql, (err, result) => {
    if (err) return res.send(err.mess)

    res.send(result)
  })
})


//kodepos
router.get('/kodepos', (req, res) => {
  const sql = `SELECT * FROM list_kodepos`

  conn.query(sql, (err, result) => {
    if (err) return res.send(err.sqlMessage)

    res.send(result)
  })
})

//detail address
router.get('/address/:id', (req, res) => {
  const sql = `SELECT * FROM list_kodepos WHERE id = '${req.params.id}'`

  conn.query(sql, (err, result) => {
    if (err) return res.send(err.sqlMessage)

    res.send(result)
  })
})

//detail address user
router.get('/user/info/:iduser', (req, res) => {
  const sql = `SELECT address, kelurahan, kecamatan, kabupaten, provinsi, list_kodepos.kodepos, list_kodepos.id, phone_number 
                FROM user LEFT JOIN list_kodepos ON user.kodepos = list_kodepos.id 
                  WHERE user.id = '${req.params.iduser}'`

  conn.query(sql, (err, result) => {
    if (err) return res.send(err.sqlMessage)

    res.send(result)
  })
})


// === MENAMPILKAN PROVINSI === //
router.get('/province', (req, res) => {
  const sql = `SELECT DISTINCT provinsi FROM list_kodepos`

  conn.query(sql, (err, result) => {
    if (err) return res.send(err.sqlMessage)

    res.send(result)
  })
})

// === MENAMPILKAN KABUPATEN === //
router.get('/kabupaten/:provinsi', (req, res) => {
  const sql = `SELECT DISTINCT kabupaten FROM list_kodepos WHERE provinsi = '${
    req.params.provinsi
  }'`

  conn.query(sql, (err, result) => {
    if (err) return res.send(err.sqlMessage)

    res.send(result)
  })
})

// === MENAMPILKAN KECAMATAN === //
router.get('/kecamatan/:kabupaten', (req, res) => {
  const sql = `SELECT DISTINCT kecamatan FROM list_kodepos WHERE kabupaten ='${
    req.params.kabupaten
  }'`

  conn.query(sql, (err, result) => {
    if (err) return res.send(err.sqlMessage)

    res.send(result)
  })
})


// === MENAMPILKAN KELURAHAN === //
router.get('/kelurahan/:kecamatan', (req, res) => {
  const sql = `SELECT kelurahan FROM list_kodepos WHERE kecamatan = '${
    req.params.kecamatan
  }'`

  conn.query(sql, (err, result) => {
    if (err) return res.send(err.sqlMessage)

    res.send(result)
  })
})


// === MENAMPILKAN KODEPOS === //
router.get('/kodepos/:kelurahan', (req, res) => {
  const sql = `SELECt id,kodepos FROM list_kodepos WHERE kelurahan = '${
    req.params.kelurahan
  }'`

  conn.query(sql, (err, result) => {
    if (err) return res.send(err.sqlMessage)

    res.send(result)
  })
})

module.exports = router
