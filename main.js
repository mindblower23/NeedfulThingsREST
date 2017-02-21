
const http = require('http');
const fs = require('fs');
const url = require('url');

const actions = new (require('./myModules/actions.js'))();


var server = http.createServer(function (req, resp) {

  // Set CORS headers
  resp.setHeader('Access-Control-Allow-Origin', '*');
  resp.setHeader('Access-Control-Request-Method', '*');
  resp.setHeader('Access-Control-Allow-Methods', 'GET');
  resp.setHeader('Access-Control-Allow-Headers', '*');

    var urlObj = url.parse(req.url, true);
    var path = urlObj.pathname.substr(1);
    var queryObj = urlObj.query;

    console.log("pathname: " +  path);

    if(path === "action"){

        //Call an Action and return JSON
        actions.act(queryObj)
        .then(result => {
            resp.writeHead(200, {'Content-Type': 'application/json'});
            resp.end(JSON.stringify(result));
        })
        .catch(err => {
            console.log(err);

            resp.writeHead(200, {'Content-Type': 'application/json'});
            let jsonErr = {"Error":"Oooooooops! Something went terrible wrong!"};
            resp.end(JSON.stringify(jsonErr));
        });
    }
    else
    {
        //Send a file

        //Create Content-Type MIME
        let mime = "text/plain";

        if(path.indexOf(".html") > 0)
            mime = "text/html";
        else if(path.indexOf(".jpg") > 0)
            mime = "image/jpeg";
        else if(path.indexOf(".js") > 0)
            mime = "text/javascript";
        else if(path.indexOf(".css") > 0)
            mime = "text/css";

        console.log("MIME: " + mime);

        //Read and send file
        fs.readFile(path, function (error, pgResp) {
            if (error) {
                resp.writeHead(404);
                resp.write('File does not exist!');
            } else {
                resp.writeHead(200, { 'Content-Type': mime });
                resp.write(pgResp);
            }

            resp.end();
        });

    }
});

server.listen(3000);

console.log('Server Started listening on 3000');
