module.exports = (app, mongo) => {
  const indexer = require('components/indexer')
  app.use('search', {
    async find(params) {
      const {value} = params.query;
      return indexer.index.search(value).map((result) => {
        return indexer.store.docs [result.ref]
      })
    }
  });

  app.use('load-indexes', {
    async get(id) {
      return indexer.store
    }
  })
}