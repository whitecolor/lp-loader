import webpack from 'webpack'
import config from './webpack.config'
const WebpackDevServer = require('webpack-dev-server')

import getPort from 'get-port'
import open from 'open'

const run = async () => {
  const port = await getPort({})

  new WebpackDevServer(webpack(config), {
    disableHostCheck: true,
    hot: true,
    stats: { colors: true },
    port: process.env.PORT,
    historyApiFallback: {
      index: 'index.html',
    },
  }).listen(process.env.PORT || port)

  open('http://localhost:' + port)
}

run()
