var express = require('express');
var router = express.Router();
var hackernews = require('../services/hackernews')

router.get('/common-in-titles', async (req, res, next) => {
  const common = await hackernews.commonWords('story', 25, 250);
  res.json(common)
});

router.get('/common-in-comments', async (req, res, next) => {
  const common = await hackernews.commonWords('comment', 25, 1000, true, true);
  res.json(common)
});

module.exports = router;
