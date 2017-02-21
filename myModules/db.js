const mysql = require("mysql");
const prefs = require('../prefs');

class Db{

    constructor(){
        this.pool = mysql.createPool(prefs.dbConnAttr);
    }

    query (sql, params) {

        return new Promise((resolve, reject) => {

            this.pool.getConnection(function(err, con){

                if(err)
                    return reject(err);

                let sqlFormatted = mysql.format(sql, params);

                //console.log(sqlFormatted);

                con.query(sqlFormatted, (error, results, fields) => {

                    con.release();

                    if(error)
                        return reject(error);

                    //console.log(results);

                    return resolve(results);

                });

            });

        });
    }

}

module.exports = Db;
