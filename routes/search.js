var express = require('express');
var router = express.Router();
const searchController = require('../Controllers/search.controller')
/* GET users listing. */
router.get('/', searchController.search);

module.exports = router;
