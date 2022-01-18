"use strict";

require("dotenv").config();
const { ApolloServer } = require("apollo-server");
const { makeExecutableSchema } = require("@graphql-tools/schema");

const express = require("express");
var cors = require("cors");
const { readFileSync } = require("fs");
const { join } = require("path");

const resolvers = require("./lib/resolvers");

const app = express();

const typeDefs = readFileSync(
  join(__dirname, "lib", "schema.graphql"),
  "utf-8"
);
const schema = makeExecutableSchema({ typeDefs, resolvers });

app.use(cors());

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
