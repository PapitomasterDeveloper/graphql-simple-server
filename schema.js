// Requiring all the needed dependencies from graphql to create a schema
const {
	GraphQLObjectType,
	GraphQLString,
	GraphQLInt,
	GraphQLSchema,
	GraphQLList,
	GraphQLNonNull,
} = require('graphql');

// Hardcoded data
const customers = [
	{ id: '1', name: 'John Doe', email: 'jdow@gmail.com', age: 35 },
	{ id: '2', name: 'Steve Smith', email: 'steve@gmail.com', age: 25 },
	{ id: '3', name: 'Sara Williams', email: 'sara@gmail.com', age: 32 },
];

// Customer type
// A Type must have at minimum:
// A name to identify the Type
// Fields, this just need to be declared with the restrictions of Scalar Types
const CustomerType = new GraphQLObjectType({
	name: 'Customer',
	fields: () => ({
		id: { type: GraphQLString },
		email: { type: GraphQLString },
		name: { type: GraphQLString },
		age: { type: GraphQLInt },
	})
});

//Root Query
// The Root Query is the one that follows almost certain patterns of the REST spec
// The RootQuery must have a name to be identified
// The fields must contain procedures ala REST spec like
// The customer field will retrieve a single customer with the id, already declared as an argument to use and a certain type to follow, of Customer Type
// The resolve will retrieve the data, like a controller in the REST spec, making use of the args if needed
// The resolve can be also seen as the HTTP Verbs and the respective actions that will follow or execute
const RootQuery = new GraphQLObjectType({
	name: 'RootQueryType',
	fields: {
		customer: {
                	type: CustomerType,
                	args: {
                        	id: { type: GraphQLString }
                },
                resolve(parentValue, args){
                        for(let i = 0; i < customers.length; i++){
                                if(customers[i].id == args.id){
                                        return customers[i];
                                }
                        }
                }
        	},
		customers: {
			type: new GraphQLList( CustomerType ),
			resolve(parentValue, args){
				return customers;
			}
		}
	}
});

// Exporting the schema
// The RootQuery will be exported as query to access the resolvers, providing the data needed to retrieve
module.exports = new GraphQLSchema({
	query: RootQuery
});
