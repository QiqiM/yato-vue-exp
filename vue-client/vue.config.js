module.exports = {
    publicPath: process.env.NODE_ENV === 'production'
        ? '/'
        : '/',

    outputDir: '../node-server/public/',
    assetsDir: 'static',
    filenameHashing: true,

    // eslint-loader 是否在保存的时候检查
    lintOnSave: true,

    // 是否使用包含运行时编译器的Vue核心的构建
    runtimeCompiler: false,

    // 默认情况下 babel-loader 忽略其中的所有文件 node_modules
    transpileDependencies: [],

    // 生产环境 sourceMap
    productionSourceMap: false,

    // cors 相关 https://jakearchibald.com/2017/es-modules-in-browsers/#always-cors
    // corsUseCredentials: false,
    // webpack 配置，键值对象时会合并配置，为方法时会改写配置
    // https://cli.vuejs.org/guide/webpack.html#simple-configuration
    configureWebpack: (config) => {
    },

    // All options for webpack-dev-server are supported
    // https://webpack.js.org/configuration/dev-server/
    devServer: {

        disableHostCheck: true,

        //     open: true,
        //
        //     host: '127.0.0.1',
        //
        //     port: 3000,
        //
        //     https: false,
        //
        //     hotOnly: false,
        //
        proxy: `http://127.0.0.1:3000/`,

        //        proxy: {
        //          "/":{
        //              target:"http://127.0.0.1:3000/"
        //          }
        //        },

        //
        //     before: app => {
        //     }
    },
    // 构建时开启多进程处理 babel 编译
    parallel: require('os').cpus().length > 1,

    // https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa
    pwa: {},

    // 第三方插件配置
    pluginOptions: {}
};
