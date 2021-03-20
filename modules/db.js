const { Pool } = require('pg');

//------Develop completly local use these db connectors------
//const connectionString = process.env.DATABASE_URL || "postgres://papai:Vitoria@localhost:5433/papai";
//const pool = new Pool({connectionString: connectionString});

//------Develop for HEROKU use these db connectors------
const connectionString = process.env.DATABASE_URL || "postgres://gbczdsokypniwz:092a1d25740fe968bc63b4315873510dd21cc0ad4dac65615596489aeca3abc9@ec2-54-89-49-242.compute-1.amazonaws.com:5432/d6btksl1k7f1ht";
const pool = new Pool({connectionString: connectionString, ssl: { rejectUnauthorized: false }});

module.exports = {
  pool: pool
}