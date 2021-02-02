import "reflect-metadata";
import "dotenv/config";

// Server imports

import { ApolloServer } from "apollo-server-express";
import express from "express";
import { createServer } from "http";
import cors from "cors";

// Orm imports

import { createConnection } from "typeorm";

// Graphql imports

import { buildSchema } from "type-graphql";

// Other

import path from "path";
import { CommunityLoader } from "./loader/communityLoader";

// Main server build

(async () => {
    const app = express();
    const server = createServer(app);

    const connection = await createConnection({
        type: "postgres",
        url: process.env.DATABASE_URL as string,
        logging: true,
        synchronize: true,
        entities: [
            path.join(__dirname, "/entities/*.*s"),
            path.join(__dirname, "/entities/**/*.*s"),
        ],
    });

    app.use(
        cors({
            origin: ["http://localhost:3000"],
            credentials: true,
        })
    );

    const apollo = new ApolloServer({
        schema: await buildSchema({
            resolvers: [path.join(__dirname, "/modules/**/*.*s")],
            validate: false,
        }),
        context: ({ req, res, connection }) => ({
            req,
            res,
            connection,
            communityLoader: CommunityLoader(),
        }),
        subscriptions: {
            onConnect: (connectionParams, WebSocket) => {},
            onDisconnect: () => {},
        },
        uploads: true,
    });

    apollo.installSubscriptionHandlers(server);
    apollo.applyMiddleware({
        app,
        cors: false,
    });

    server.listen(Number(process.env.PORT) || 4000, () =>
        console.log(`Server seated at port ${process.env.PORT || 4000}`)
    );
})();
