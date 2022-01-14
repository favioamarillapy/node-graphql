"use strict";

require("dotenv").config();
const { graphqlHTTP } = require("express-graphql");
const { makeExecutableSchema } = require("@graphql-tools/schema");

const express = require("express");
var cors = require("cors");
const { readFileSync } = require("fs");
const { join } = require("path");

const resolvers = require("./lib/resolvers");

const app = express();
const port = process.env.PORT;
const ENV = process.env.ENVIROMENT || "";
const isDev = ENV.trim() !== "production";

const typeDefs = readFileSync(
  join(__dirname, "lib", "schema.graphql"),
  "utf-8"
);
const schema = makeExecutableSchema({ typeDefs, resolvers });

app.use(cors());

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: resolvers,
    graphiql: isDev,
  })
);

app.listen(port);
