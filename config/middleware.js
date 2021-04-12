const express = require('express')
const cors = require('cors');

const corsOptions = {
    origin: (origin, callback) => origin == 'https://www.sinform.com.br' ? callback(null, true) : 'Acesso Negado!',
    optionSuccessStatus: 200
}

module.exports = app => {
    app.use(express.json())
    app.use(cors(corsOptions))
}