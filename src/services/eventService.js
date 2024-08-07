async function postEvent(fastify, payload){
    const {owner, title, descr, postedDate, location, dateTime} = payload;
    const isoPostedDate = new Date(postedDate).toISOString();
    console.log("hi ", isoPostedDate);
    const isoDate = new Date(dateTime).toISOString();
    const client = await fastify.pg.connect();
    try {
        //Insert into events table
        const query = `
      INSERT INTO events (owner, title, descr, posteddate, address, date)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`;
        //Insert into attendance table
        const values = [owner, title, descr, isoPostedDate, location, isoDate];
        const {rows} = await client.query(query, values);
        const newQuery = `
        INSERT INTO attendance
        VALUES ($1, $2)`
        const newValues = [rows[0].id, owner]//insert new event id into attendance with owner as attending
        await client.query(newQuery, newValues);
        return rows[0]
    } finally {
        client.release();
    }
}

async function getEvents(fastify) {
    const currDate = new Date().toISOString();
    const client = await fastify.pg.connect();
    try {
        const query =
            'SELECT * FROM events join users on events.owner = users.userid WHERE date >= CURRENT_TIMESTAMP ORDER BY posteddate DESC';
        const values = [currDate];
        const {rows} = await client.query(query);
        return rows;
    } finally {
        client.release();
    }
}

export {postEvent, getEvents};