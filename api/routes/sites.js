/**
 * Created by elastetic.dev on 26/05/2017.
 * copyright 2017 elastetic.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */

const express = require('express');
const winston = require('winston');
let router = express.Router({mergeParams: true});
const ctrlSites = require.main.require('../api/controllers/sites');

router.get('/', ctrlSites.list);
router.get('/templates', ctrlSites.listTemplates);
router.get('/templates/:template', ctrlSites.getTemplateParams);
router.post('/', ctrlSites.create);

module.exports = router;
