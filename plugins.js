//** RiotJS plugins that supposed to work the same way on client and server */
const riot = require('riot')
const client = require('client')
const {withRouter} = require('@frontless/core/browser')
const isBrowser = typeof window !== 'undefined'
const indexer = require('components/indexer')
indexer.loadDocuments();

// First register components
if (!isBrowser) {
  const glob = require('glob')
  const path = require('path')
  const register = (file) => {
    const tag = require(path.resolve(file))
    const component = tag.default;
    riot.register(component.name, component)
  };
  glob.sync( './**/*.riot' ).forEach( ( file ) => !file.startsWith('./specs/') && register(file))
}


const ClientPlugin = (instance) => {
  Object.defineProperty(instance, 'client', {
    get: function() {
      return client.factory(this.req)
    }.bind(instance)
  })
  instance.service = function(name) {
    return this.client.service(name)
  }.bind(instance);
};



riot.install(withRouter)
riot.install(require('store'))
riot.install(ClientPlugin)
