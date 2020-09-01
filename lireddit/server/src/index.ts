import {MikroORM} from "@mikro-orm/core"
import { __prod__ } from "./constants";
import microCfg from "./mikro-orm.config"
import express from "express"
import { ApolloServer } from "apollo-server-express";
import {buildSchema} from 'type-graphql';
import { HelloResolver } from "./resolvers/HelloResolver";
import { PostResolver } from "./resolvers/post";
import "reflect-metadata";

const main = async () => {
    const orm = await MikroORM.init(microCfg)
    await orm.getMigrator().up();
   
    const app = express();

    // app.use('/', (req, res) => {
    //     res.end('hello from express!');
    // })

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [HelloResolver, PostResolver],
            validate: false
        }),
        context: () => ({em: orm.em})
    })

    apolloServer.applyMiddleware({app});

    app.listen(4000, () => {
        console.log('server started on localhost:4000')
    })
}

main().catch(err => {
    console.log(err)
});

