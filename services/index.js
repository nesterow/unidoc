
module.exports = function (app, mongo) {
  require('./search')(app, mongo)
  // require('./users')(app, mongo)
}
