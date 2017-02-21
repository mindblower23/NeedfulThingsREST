const db = new (require('./db'))();

const Utils = require('./Utils');

class Actions{

    constructor(){
        this.json = "";
    }

    queryToParams(queryObj){
        var params = [];
        for (var key in queryObj) {
            if (key.substr(0,1) === '_')
                params.push(queryObj[key]);
        }
        return params;
    }

    act (queryStringObj){

        //Dispatch Actions by name in querystring
        return new Promise((resolve, reject) => {

            if (queryStringObj.name === 'getCategories') {

                //Get all categories
                db.query("call getCategories(?)", this.queryToParams(queryStringObj)).then(result => {

                  //add isActive and isCollapsed with default value false to the Category Object
                  result[0].forEach(item => {
                    item.isActive = false;
                    item.isCollapsed = false;
                  });

                  //build multidimensional array from db table
                  let categories = Utils.generateTreeViewArray(result[0], "id", "parent_categories_id");

                  return resolve(categories);
                });
            } else if (queryStringObj.name === 'getItems') {

                //Get all items for the Category
                db.query("call getItems(?)", this.queryToParams(queryStringObj)).then(result => {

                  return resolve(result[0]);
                });

            } else {
                // ERROR!!!!
                console.log("ERROR IN ACTIONS!");
                return reject(new Error('No valid Action defined in QueryString!'));
            }

        });

    }
}

module.exports = Actions;
