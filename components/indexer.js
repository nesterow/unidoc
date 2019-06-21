const isClient = typeof window !== 'undefined'
const elasticlunr = require('elasticlunr')

const index = elasticlunr(function(){
  this.addField('title')
  this.addField('body')
  this.setRef('path')
})

module.exports = {
  documents: [],

  /** SYNC! */
  loadDocuments(){
    if(!isClient) {
      const glob = require('glob')
      const path = require('path')
      const fs = require('fs')
      const removeMd = require('remove-markdown')
      glob.sync( 'docs/**/*.md' ).forEach(( file ) => {
        const marked = fs.readFileSync(path.resolve(file), 'utf8')
        const body = removeMd(marked)
        let title = marked.match(/#.*\n/ig)
        if (title) title = title[0].replace(/#/ig, '').trim();
        else title = body.substr(0, 50) + '...';
        index.addDoc({
          path: file,
          title,
          body,
        })
      })
    }
    else {

    }
  },
  
  index: index,

  store: index.documentStore,

}