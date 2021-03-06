var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator');
const {mongoDBuri} = require('../config.json');
const { establishConnection } = require('../database');
const { ObjectID } = require('mongodb');
const {update, retrieve, insert} = require('../dbutils');

const uri = mongoDBuri;
const connection = establishConnection(uri);


router.post('/update', [
  check('id').isString(),
  check('name').isString(),
  check('desc').isString(),
  check('zipcode').isNumeric().isLength({ max: 5}),
  check('latitude').isDecimal(),
  check('longitude').isDecimal(),
  check('isSafe').isBoolean()
], function(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  console.log(req)
  update(connection,'location',req.body.id,{
    name: req.body.name,
    zipcode: parseInt(req.body.zipcode),
    latitude: parseFloat(req.body.latitude),
    longitude: parseFloat(req.body.longitude),
    desc: req.body.desc,
    isSafe: (req.body.isSafe == 'true')
  }).then((data) => res.send(data))

})


router.post('/insert',[
  check('name').isString(),
  check('desc').isString(),
  check('zipcode').isNumeric(),
  check('latitude').isDecimal(),
  check('longitude').isDecimal(),
  check('isSafe').isBoolean()
], function (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  insert(connection,'location',{
    name: req.body.name,
    zipcode: parseInt(req.body.zipcode),
    latitude: parseFloat(req.body.latitude),
    longitude: parseFloat(req.body.longitude),
    desc: req.body.desc,
    isSafe: (req.body.isSafe == 'true')
  }).then((data) => res.send(data))

})

router.post('/retrieve',[], function (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  retrieve(connection,'location',{_id: ObjectID(req.body.id)}).then((data) => res.send(data))

})

const everyoneNotHer = (zipcode) => {
  return retrieve(connection,'location',{zipcode})
}

module.exports = {router,everyoneNotHer};
