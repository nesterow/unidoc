const {createStore, getInitial} = require('riot-state')


const name = 'showdown'

const state = getInitial(name) || {
  navItems: []
};

const actions = {
  getItems(from){
    const headers = Array.from(from.querySelectorAll(`h1,h2,h3,h4`));
    this.navItems = headers.map((e, i) => {
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
  }
};

module.exports = createStore({
  name,
  state,
  actions
})