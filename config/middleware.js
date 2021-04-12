const express = require('express')
const cors = require('cors');

const corsOptions = {
    origin: 'https://www.sinform.com.br',
    optionSuccessStatus: 200
}

module.exports = app => {
    app.use(express.json())
    app.use(cors(corsOptions))
}