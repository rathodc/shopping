var Validator = require('jsonschema').Validator;
  var v = new Validator();
  var instance = {a:"4"};
  var schema = {"type": "object"};
  console.log(v.validate(instance, schema).errors.length);