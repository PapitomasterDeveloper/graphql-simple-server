// Requiring express dependency
const express = require('express');

// Requiring the schema to use in the request handler express-graphql
const schema = require('./schema.js');

// Requiring express-graphql dependency
const expressGraphQL = require('express-graphql');

// Creating an instance of express
const app = express();

// Creating the entry point and using the request handler to use the GraphQL standard
app.use('/graphql', expressGraphQL({
	schema: schema,
	graphiql: true
}));

// Accessing the express instance to create a server to access to port 4000
app.listen(4000, () => {
	console.log(`Server is running on port 4000..`);
});
