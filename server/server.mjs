import express from "express";
import http from 'http';
import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import bodyParser from "body-parser";
import fakeData from "./fakeData/index.js";

const app = express();
const httpServer = http.createServer(app);

/**
 * GraphQL
 * 
 * Schema
 *      Document để mô tả request/response như thế nào
 *  
 *  Type
 *      Query
 *          = Get
 *      Mutation
 *          = Update, Delete
 *      Subscription
 *          = Realtime
 *  
 *  
 * Resolver
 */
const typeDefs = `#graphql
    type Author {
        id: String,
        name: String,
    }

    type Folder {
        id: String,
        name: String,
        createdAt: String,
        author: Author,
    }

    type Query {
        folders: [Folder]
    }
`;
const resolvers = {
    Query: {
        folders: () => fakeData.folders,
    },
    Folder: {
        author: (
            parent,
            args
        ) => {
            const { authorId } = parent;
            return fakeData.authors.find((author) => author.id === authorId);
        },
    }
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
});

await server.start();

app.use(cors(), bodyParser.json(), expressMiddleware(server));

await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
console.log('Server ready on port 4000')
