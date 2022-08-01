const Pool = require('pg').Pool
const pool = new Pool({
  user: 'ftlxqtzcguiika',
  host: 'ec2-54-211-77-238.compute-1.amazonaws.com',
  database: 'd86nnc4tgnlfel',
  password: 'b242f5deb225e9a407dc8f49ab2317847018f505df6062e6e44d784a20b47911',
  port: 5432,
  ssl: {
    rejectUnauthorized: false
}
})

pool.connect()


const getUsers = (request, response) => {

    console.log("getUsers is called")
    pool.query('SELECT * FROM  "TeleMed"."UserAccount" ORDER BY id ASC', (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  }


const updateUser = (request, response) => {
    const {
        minted,
        id,
    } = request.body
    console.log(minted)
    console.log(id)

    pool.query('UPDATE "TeleMed"."UserAccount" SET "Minted" = $1 WHERE "id" = $2 ',
      [minted, id],
        (error2, results2) => {
            if (error2) {
                throw error2
            }
            response.status(200).send("Sucess Set")
        })
}

// Add new farm
const addUser = (request, response) => {
  const {
      name,
      role,
      walletaddress,
      minted,
  } = request.body

  pool.query('INSERT INTO "TeleMed"."UserAccount" ("Username", "Role", "WalletAddress","Minted") VALUES ($1, $2, $3,$4)', [name, role, walletaddress,minted], (error2, results2) => {
    if (error2) {
        throw error2
    }
    response.status(201).send(`User added!`)
  })
}

const addLog = (request, response) => {
  const {
    duration,
    total_gasUsed 
  } = request.body

  pool.query('INSERT INTO "TeleMed"."Transaction" ("Latency", "Eth_used") VALUES ($1, $2)', [duration,total_gasUsed ], (error2, results2) => {
    if (error2) {
        throw error2
    }
    response.status(201).send(`Log added!`)
  })
}


const deleteAll = (request, response) => {
  const {
      plantId,
  } = request.body
  
  pool.query('DELETE FROM smartfarmdb."PlantType" as "plant" WHERE "plant"."PlantId" = $1 ',[plantId],
  (error, results) => {
      if (error) {
          throw error
      }
      response.status(200).send("delete sucess")
  })
}

  module.exports = {
    getUsers,
    addUser,
    updateUser,
    addLog
  }