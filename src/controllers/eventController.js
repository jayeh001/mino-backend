import {postEvent, getEvents} from "../services/eventService.js";

const eventController = async (fastify) =>{
    fastify.get("/events", async (req, res) => {
        fastify.log.info('Handling GET request for /events');
        try {
            const data = await getEvents(fastify);
            return res.status(200).send(data);
        } catch (error) {
            fastify.log.error(error);
            return res.status(500).send(error);
        }

    });
    fastify.post("/events", async (req, res) => {
        fastify.log.info('Handling POST request for /events')

        try {
            const result = await postEvent(fastify, req.body);

            return res.code(201).send(result);
        } catch (error) {
            fastify.log.error(error);
            return res.status(500).send(error);
        }
    })
}
export default eventController;