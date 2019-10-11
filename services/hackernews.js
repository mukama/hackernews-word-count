var axios = require('axios');

const ENDPOINT = 'https://hacker-news.firebaseio.com/v0'
const hackernews = {
  getStoryIds() {
    return axios.get(`${ENDPOINT}/newstories.json?print=pretty`)
      .then(response => response.data);
  },
  async getItems() {
    const ids = await this.getStoryIds();
    return await Promise.all(ids.map(id => {
      return axios.get(`${ENDPOINT}/item/${id}.json?print=pretty`)
        .then(response => response.data)
        .catch(() => '');
    }));
  },
  async getKids(max) {
    const items = await this.getItems();
    let ids = [];
    for (let i = 0; (ids.length >= (max || Infinity)) || (i < items.length); i++) {
      if (items[i] && items[i].kids) {
        ids.push(...items[i].kids);
      }
    }

    console.log(ids)

    return await Promise.all(ids.map(id => {
      return axios.get(`${ENDPOINT}/item/${id}.json?print=pretty`)
        .then(response => response.data)
        .catch(() => '');
    }));
  },
  async commonWords(property, limit, max, traverseKids, inText) {
    let items;
    if (traverseKids) {
      items = await this.getKids();
    } else {
      items = await this.getItems();
    }
    const allWords = items
      .filter(a => a && a.type === property)
      .slice(0, max)
      .map(a => inText ? a.text : a.title)
      .reduce((a, b) => a.concat(b, ' '), '')
      .replace(/[^0-9a-z-A-Z ]/g, "").replace(/ +/, " ")
      .toLowerCase()
      .split(' ');

    // count
    const countedWords = allWords.reduce((acc, curr) => {
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

    return filtered;
  }
}

module.exports = hackernews