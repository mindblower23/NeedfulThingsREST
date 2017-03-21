const formidable = require('formidable');

const db = new (require('./db'))();
const Utils = require('./Utils');

class Actions{

  constructor(){
      this.json = "";
  }

  queryToParams(queryObj){
    let params = [];
    for (var key in queryObj) {
      if (key.substr(0,1) === '_')
        params.push(queryObj[key]);
    }
    return params;
  }

  postToParams(request){
    let params = [];
    let form = new formidable.IncomingForm();
    form.parse(request, (err, fields) => {
      for(let key in fields)
        params.push(fields[key]);
    })
    return params;
  }

  act (queryStringObj, request){

    //Dispatch Actions by name in querystring
    return new Promise((resolve, reject) => {

      if (queryStringObj.name === 'loadCategories') {

        //Get all categories
        db.query(
          "call get_categories(?,?)",
          this.queryToParams(queryStringObj)
        )
        .then(result => {
          //build multidimensional array from db table
          let categories = Utils.generateTreeViewArray(result[0], "id", "parent_categories_id");

          return resolve(categories);
        })
        .catch(err => {
          return reject(err);
        });
      } else if (queryStringObj.name === 'getThings') {

        //Get all items for the Category
        db.query(
          "call get_things(?)",
          this.queryToParams(queryStringObj)
        )
        .then(result => {
          return resolve(result[0]);
        })
        .catch(err => {
          return reject(err);
        });
      } else if (queryStringObj.name === 'saveNewCategory') {

        //insert category in db
        db.query(
          "call insert_category(?,?)",
          this.postToParams(request)
        )
        .then(result => {
          console.log(JSON.stringify(result));
          return resolve(result[0]);
        })
        .catch(err => {
          return reject(err);
        });

      } else {
        // ERROR!!!!
        console.log("ERROR IN ACTIONS!");
        return reject('No valid Action defined in QueryString!');
      }

    });

  }
}

module.exports = Actions;
