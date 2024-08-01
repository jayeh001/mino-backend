import { getUser, updateUser} from '../services/userService.js';
const userController = async (fastify) => {
    fastify.get("/user", async (req, res) => {
        fastify.log.info('Handling GET request for /user');
        const userId = req.query.userId;
        const data = await getUser(fastify, req.query);
        return res.code(201).send({data});
    })
    fastify.put("/user", async (req, res) => {
        fastify.log.info('Handling PUT request for /user')
        const data = await updateUser(fastify, req.body);
        return res.code(201).send(data);
    })

}

export default userController;