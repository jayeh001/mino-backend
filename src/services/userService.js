import fastify from "fastify";

async function getUser(fastify, payload) {
    console.log("userService called");
    const {userId, firstName, lastName} = payload;
    const name = `${firstName} ${lastName || ''}`;

    const client = await fastify.pg.connect();
    try {
        const { rows } = await client.query('SELECT * FROM users WHERE userid = $1', [userId]);
        fastify.log.info(`the rows: ${rows[0]}`)

        if (rows.length < 1) {
            const sql = 'insert into users (userId, name) values ($1, $2) RETURNING *';
            const values = [userId, name];
            const {rows} = await client.query(sql, values)
            return rows[0]
        }
        return rows[0]
    } finally {
        client.release();
    }

}
async function updateUser(fastify, payload) {
    fastify.log.info('Handling UPDATE request for /user');
    const { userId, name, bio, interests } = payload;
    const client = await fastify.pg.connect();
    try {
        const query = `
      UPDATE users
      SET name = $1, bio = $2, interests = $3
      WHERE userid = $4
    `;
        const result = await client.query(query, [name, bio, interests, userId]);
        return result.rows; // Returns the number of rows updated
    } finally {
        client.release();
    }

}

// async function createUser(fastify, userPayload){
//     fastify.log.info("creating new user");
//     const {id, first_name, last_name} = userPayload;
//     console.log("retrieved vals: ", id, first_name, last_name);
//     const client = await fastify.pg.connect();
//     try {
//         const sql = 'insert into users (userId, firstName, lastName) values ($1, $2, $3)';
//         const values = [id, first_name, last_name];
//         return await client.query(sql, values)
//     } catch (error) {
//         fastify.log.error(error);
//         throw new error('error inserting user')
//     } finally {
//         client.release()
//     }
//
// }


export { getUser, updateUser}