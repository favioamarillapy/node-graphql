"use strict";

const { MongoClient } = require("mongodb");

let connection;

async function dbConnection() {
  if (connection) return connection.db();

  try {
    let client = new MongoClient(process.env.DB_CONECTION, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    connection = await client.connect();
    return connection.db();
  } catch (error) {
    console.error("Could not connect to db", process.env.DB_CONECTION, error);
    return null;
  }
}

module.exports = { dbConnection };
