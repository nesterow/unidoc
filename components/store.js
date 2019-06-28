const {isBrowser} = require('@frontless/core')
const store = require('@frontless/redux')

if (isBrowser) {
  document.__GLOBAL = {}
}

const state = isBrowser && document.__GLOBAL_SHARED_STATE || {
  title: '',
  navItems: [],
}

const actions = {

  TITLE: function(state, {title}) {
    state.title = title
  },

  NAV: function(state, {from}) {
    const headers = Array.from(from.querySelectorAll(`h1,h2,h3,h4`));
    state.navItems = headers.map((e, i) => {
      const fallback = document.createElement('div')
      const icon = (e.querySelector('i') || fallback).getAttribute('class')
      const img = (e.querySelector('img') || fallback).getAttribute('src')
      return {
        id: e.getAttribute('id'),
        content: e.textContent,
        icon,
        img,
      }
    })
  },

}



module.exports = store({
  state,
  actions,
})