const nodemailer = require('nodemailer')

const sendMail = (username, email) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth : {
            type: 'OAuth2',
            user: 'hamdan.nasrullah@gmail.com',
            clientId:process.env.CLIENT_ID,
            clientSecret:process.env.CLIENT_SECRET,
            refreshToken:process.env.REFRESH_TOKEN
        },

        // This config would open a connection to TLS server with self-signed or invalid TLS certificate.
        // If you know that the host does not have a valid certificate you can allow it in the transport settings with tls.rejectUnbrandized.

        tls: {
            rejectUnbrandized: false
        }
    })
    
    const mail = {
        from: 'Hamdan Nasrullah<hamdan.nasrullah@gmail.com>', // SENDER EMAIL ADDRESS
        to: email, // LIST OF RECEIVERS
        subject: 'Mohon Verifikasi Email Anda untuk Login di Kompi Komputer', // SUBJECT EMAIL
        html: `<h1><a href='http://localhost:2020/verify?uname=${username}'>Klik untuk verifikasi</h1>`
    }
    
    transporter.sendMail(mail, (err, res) => {
        if(err) return console.log(err)
        
        console.log('Email berhasil diverifikasi')
        
    })
}

module.exports = {sendMail}

