let { ApolloServer, PubSub } = require("apollo-server");
let typeDefs = require("./Schema/Schema");
const db = require("./db");
let Query = require("./Resolver/Query")
let Mutation = require("./Resolver/Mutation")
let Subscription = require("./Resolver/Subscription")
let User = require("./Resolver/User")
let Post = require("./Resolver/Post")
let Comment = require("./Resolver/Comment")

const pubsub = new PubSub()

const server = new ApolloServer({
  typeDefs,
  resolvers: {Query, Mutation, Subscription, User, Post, Comment},
  context: (req, res) => ({ req, res, db, pubsub }),
  playground: true,
});

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
