import Fastify from 'fastify'
import cors from '@fastify/cors'
import userController from "./controllers/userController.js";
import eventController from "./controllers/eventController.js";
import chatroomController from "./controllers/chatroomController.js";
import fastifyRedis from "@fastify/redis";
import fastifyPostgres from "@fastify/postgres"
import 'dotenv/config';
import fastifySocketIO from "fastify-socket.io"

const fastify = Fastify({
    logger: {
        transport: {
            target: "pino-pretty",
        }
    }
});
//CORS
fastify.register(cors, {
    // Specify your CORS settings here
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],

});
//SOCKET
fastify.register(fastifySocketIO, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    },
    connectionStateRecovery: {
        maxDisconnectionDuration: 2 * 60 * 1000,
        skipMiddlewares: true,
    }
})
fastify.ready().then( ()=> {
    fastify.io.on("connection", (socket) => {
        console.log("User connected: ", socket.id)
    })
})

//CrWApNJSqEpLX3Fx
//Database Access
fastify.register(fastifyRedis, {
    closeClient: true,
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    user: process.env.REDIS_USER,
    password: process.env.REDIS_PASS,
});
fastify.register(fastifyPostgres, {
    connectionString: process.env.NEON_POSTGRES_STRING,
})


//Controllers
fastify.register(userController, {prefix: '/api'});
fastify.register(eventController, {prefix: '/api'});
fastify.register(chatroomController, {prefix: '/api'})


async function main() {
    try {
        await fastify.listen({
            port: 8000,
            host: '127.0.0.1',
        })
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}
["SIGINT", "SIGTERM"].forEach((sig) => {
    process.on(sig, async () => {
        await fastify.close();
        process.exit(0)
    })
})
main()
export default fastify;