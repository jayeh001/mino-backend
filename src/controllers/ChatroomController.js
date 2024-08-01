import {updateUser} from "../services/userService.js";
const chatroomController = async (fastify) => {
    fastify.put("/chat", async (req, res) => {
        fastify.log.info('Handling PUT request for /chat')
        const client = await fastify.pg.connect();
        try {
            const {userId,eventId} = req.body;
            const query =
                'INSERT INTO attendance (eventid, userid) VALUES ($1,$2) RETURNING *';
            if (!userId || !eventId) {
                return res.code(400).send({ error: 'userId and eventId are required' });
            }
            const values = [eventId, userId];
            const {rows} = await client.query(query,values);
            return res.code(201).send(rows);
        } finally {
            client.release();
        }
})
    fastify.get("/chat", async (req, res) => {
        fastify.log.info('Handling GET request for /chatroom')
        const client = await fastify.pg.connect();
        try {
            const userId = req.query.userId;
            const query = 'SELECT * FROM attendance a JOIN events e on a.eventid = e.id where a.userid =$1 ORDER BY posteddate DESC;'
            const values = [userId];
            const {rows} = await client.query(query,values);
            return res.code(201).send(rows);
        } finally {
            client.release()
        }

    })

}
export default chatroomController;