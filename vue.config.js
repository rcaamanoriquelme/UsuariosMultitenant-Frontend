module.exports = {
    runtimeCompiler: true,
    productionSourceMap: false,
    publicPath: process.env.NODE_ENV === 'production'
          ? './'
          : '/',
    devServer: {
       proxy:   'http://190.57.145.103:8180', 
      //proxy: 'http://10.20.11.69:8180', //qa

    }
  }
  