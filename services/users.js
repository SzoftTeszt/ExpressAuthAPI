const db = require("./db")

async function create(user){
    const result = await db.query(
        `insert into users (email, password) values(?,?)`,
         [user.email, user.password]
    )

    let message="Hiba a felhasználó létrehozásánál!"
    if (result.affectedRows) {
        message="A felhasználó létrehozva!"
    }
    return {message}

}

module.exports={
    create
}