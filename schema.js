// Requiring axios
const axios = require('axios');

// Requiring all the needed dependencies from graphql to create a schema
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull
} = require('graphql');

/*
// Hardcoded data
const customers = [
    {id:'1', name:'John Doe', email:'jdoe@gmail.com', age:35},
    {id:'2', name:'Steve Smith', email:'steve@gmail.com', age:25},
    {id:'3', name:'Sara Williams', email:'sara@gmail.com', age:32},
];
*/

// Customer type
// A Type must have at minimum:
// A name to identify the Type
// Fields, this just need to be declared with the restrictions of Scalar Types
const CustomerType = new GraphQLObjectType({
    name:'Customer',
    fields:() => ({
        id: {type:GraphQLString},
        name: {type: GraphQLString},
        email: {type: GraphQLString},
        age: {type: GraphQLInt},
    })
});

//Root Query
// The Root Query is the one that follows almost certain patterns of the REST spec
// The RootQuery must have a name to be identified
// The fields must contain procedures ala REST spec like
// The customer field will retrieve a single customer with the id, already declared as an argument to use and a certain type to follow, of Customer Type
// The resolve will retrieve the data, like a controller in the REST spec, making use of the args if needed
// The resolve can be also seen as the HTTP Verbs and the respective actions that will follow or execute
const RootQuery= new GraphQLObjectType({
    name:'RootQueryType',
    fields:{
        customer:{
            type:CustomerType,
            args:{
                id:{type:GraphQLString}
            },
            resolve(parentValue, args){
                /*
                for(let i = 0;i < customers.length;i++){
                    if(customers[i].id == args.id){
                        return customers[i];
                    }
                }
                */
                return axios.get('http://127.0.0.1:3000/customers/'+ args.id)
                    .then(res => res.data);

            }
        },
        customers:{
            type: new GraphQLList(CustomerType),
            resolve(parentValue, args){
                return axios.get('http://127.0.0.1:3000/customers')
                    .then(res => res.data);
            }
        }
    }
});

// Mutations
// Mutations are only used on procedures ala REST like PUT, POST, UPDATE, DELETE
// Each field is holding an identifier like addCustomer, that follows the resemblance of the HTTP verb POST on the REST spec
// The args to be used on
// And the resolve to query the data needed acording to the procedure to follow ala REST spec
const mutation = new GraphQLObjectType({
    name:'Mutation',
    fields:{
        addCustomer:{
            type:CustomerType,
            args:{
                name: {type: new GraphQLNonNull(GraphQLString)},
                email: {type: new GraphQLNonNull(GraphQLString)},
                age: {type: new GraphQLNonNull(GraphQLInt)}
            },
            resolve(parentValue, args){
                return axios.post('http://localhost:3000/customers', {
                    name:args.name,
                    email: args.email,
                    age:args.age
                })
                .then(res => res.data);
            }
        },
        deleteCustomer:{
            type:CustomerType,
            args:{
                id:{type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parentValue, args){
                return axios.delete('http://localhost:3000/customers/'+args.id)
                .then(res => res.data);
            }
        },
        editCustomer:{
            type:CustomerType,
            args:{
                id:{type: new GraphQLNonNull(GraphQLString)},
                name: {type: GraphQLString},
                email: {type: GraphQLString},
                age: {type: GraphQLInt}
            },
            resolve(parentValue, args){
                return axios.patch('http://localhost:3000/customers/'+args.id, args)
                .then(res => res.data);
            }
        },
    }
});

// Exporting the RootQuery, containing all the resolvers needed
module.exports = new GraphQLSchema({
    // GET and GET a single resource can be seen as anything that goes inside the RootQuery
    query: RootQuery,
    // POST, PATCH, PUT, UPDATE, DELETE can be seen as anything that goes inside the Mutations
    mutation
});
