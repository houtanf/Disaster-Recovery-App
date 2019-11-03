var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator');
const {mongoDBuri} = require('../config.json')
const { ObjectID } = require('mongodb');

const { establishConnection } = require('../database')
const { retrieve, update, insert } = require('../dbutils')

const uri = mongoDBuri;
const connection = establishConnection(uri);

router.post('/update',[
  check('id').isString(),
  check('zipcode').isNumeric(),
  check('latitude').isDecimal(),
  check('longitude').isDecimal(),
  check('status').isString(),
], function (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  console.log(req)
  update(connection,'person',req.body.id,{
    zipcode: req.body.zipcode,
    latitude: req.body.latitude,
    longitude: req.body.longitude,
    status: req.body.status
  }).then((data) => res.send(data))

})

router.post('/insert',[], function (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  console.log(req)
  insert(connection,'person',req.body).then((data) => res.send(data))

})

router.post('/retrieve',[], function (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  console.log(req)
  retrieve(connection,'person',{_id: ObjectID(req.body.id)}).then((data) => res.send(data))

})


const everyoneNotHim = (zipcode,id) => {
  return retrieve(connection,'person',{zipcode}).then(data => data.filter((element) => element._id != id))
}

// everyoneNotHim(101016,'5dbe2db41c9d4400009c45a7').then((data) => console.log(data.length))

module.exports = router
