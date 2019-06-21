const {NODE_ENV} = process.env;

if (NODE_ENV !== 'test')
{
  const dotenv = require('dotenv')
  dotenv.config({path: process.argv[process.argv.length - 1]})
}

require('@riotjs/ssr/register')()
require('components/utils/babel')()
require('./components/server')