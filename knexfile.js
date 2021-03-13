require("dotenv").config()

module.exports = {
    client: 'mysql2',
    connection: {
      host: "sinform.cxw8fxplh0eg.us-east-1.rds.amazonaws.com",
      database: 'sinform',
      user:     process.env.dbuser,
      password: process.env.dbpassword
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }


};
