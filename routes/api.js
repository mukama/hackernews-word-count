var express = require('express');
var router = express.Router();
var hackernews = require('../services/hackernews')

router.get('/common-in-titles', async (req, res, next) => {
  const { limit, max } = req.query;
  const recent = await hackernews.getRecent(max);
  const stories = await hackernews.getTitles(recent);
  const titles = stories
    .map(title => title)
    .reduce((a, b) => a.concat(b, ' '), '')
    .replace(/[^0-9a-z-A-Z ]/g, "").replace(/ +/, " ")
    .toLowerCase()
    .split(' ');

  // count
  const countedWords = titles.reduce((acc, curr) => {
    acc[curr] = (acc[curr] || 0) + 1;
    return acc;
  }, {});

  // sort
  const sortedWords = Object.keys(countedWords)
    .sort(function (a, b) { return countedWords[b] - countedWords[a] })
    .filter((key) => key)
    .slice(0, limit);

  // then filter
  const filtered = Object.keys(countedWords)
    .filter(key => sortedWords.includes(key))
    .reduce((obj, key) => {
      obj[key] = countedWords[key];
      return obj;
    }, {});

  res.json(filtered)
});

router.get('/common-in-comments', async (req, res, next) => {
  res.send('respond with a resource');
});

module.exports = router;
