module.exports = (app, mongo) => {
  const indexer = require('components/indexer')
  app.use('search', {
    async find(params) {
      const {value} = params.query;
      return indexer.index.search(value).map((result) => {
        const data = indexer.store.docs [result.ref]
        data.title = data.title.replace(/(<([^>]+)>)/ig, '')
        data.body = data.body.replace(/(<([^>]+)>)/ig, '')
        return data
      })
    }
  });

  app.use('load-indexes', {
    async get(id) {
      return indexer.store
    }
  })
}