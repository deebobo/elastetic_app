var express = require('express');
var router = express.Router({mergeParams: true});
const ctrlEmailTemplates = require.main.require('../api/controllers/email_templates');

/* GET all template for current site. */
router.get('/', ctrlEmailTemplates.get);


/* add a new template. */
router.post('/', ctrlEmailTemplates.post);

/* update a template. */
router.put('/', ctrlEmailTemplates.put);

/* remove a template. */
router.delete('/', ctrlEmailTemplates.delete);

module.exports = router;
