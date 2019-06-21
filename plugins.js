//** RiotJS plugins that supposed to work the same way on client and server */
const riot = require('riot')
const client = require('client')
const {extend} = require('lodash')
const {withRouter} = require('components/utils')
const isBrowser = typeof window !== 'undefined'

const indexer = require('components/indexer')
indexer.loadDocuments();

const {DOM_COMPONENT_INSTANCE_PROPERTY} = riot.__.globals


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

const Global = (instance) => {
  
  instance.setTitle = function(text){
    const title = document.createElement('title')
    title.innerText = text;
    document.head.appendChild(title)
  },

  instance.DCIP = DOM_COMPONENT_INSTANCE_PROPERTY;

  instance.setGlobal = function(data) {
    if (!isBrowser) {
      const globals = JSON.parse(this.req.session.globals || '{}');
      this.req.session.globals = JSON.stringify(extend(globals, data))
    }
  }.bind(instance)

  Object.defineProperty(instance, 'globals', {
    get: function() {
      if (isBrowser) {
        const el = document.getElementById('globals')
        const data = el ? el.innerText : '{}'
        return JSON.parse(data || '{}')
      } else {
        return JSON.parse(this.req.session.globals || '{}')
      }
    }.bind(instance)
  })

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
riot.install(Global)
riot.install(ClientPlugin)
