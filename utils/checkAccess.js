const url = require('url');

function checkAccess(req, secret){
  return url.parse(req.url, true).query.secret == secret;
}

module.exports = checkAccess
