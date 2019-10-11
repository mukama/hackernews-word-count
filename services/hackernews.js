var axios = require('axios');

const ENDPOINT = 'https://hacker-news.firebaseio.com/v0'
const hackernews = {
  getRecent(limit) {
    return axios.get(`${ENDPOINT}/newstories.json?print=pretty`)
      .then(response => response.data.slice(0, limit));
  },
  async getTitles(ids) {
    return await Promise.all(ids.map(id => {
      return axios.get(`${ENDPOINT}/item/${id}.json?print=pretty`)
        .then(response => response.data.title)
        .catch(() => '');
    }));
  }
}

module.exports = hackernews