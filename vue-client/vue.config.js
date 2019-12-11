const defaultSettings = require('./src/settings.js')
const name = defaultSettings.title || 'vue Permission Admin' // page title

// If your port is set to 80,
// use administrator privileges to execute the command line.
// For example, Mac: sudo npm run
// You can change the port by the following method:
// port = 9527 npm run dev OR npm run dev --port = 9527
const port = process.env.port || process.env.npm_config_port || 9527 // dev port

module.exports = {
    publicPath: process.env.NODE_ENV === 'production'
        ? '/'
        : '/',

    outputDir: '../node-server/public/',
    assetsDir: 'static',
    filenameHashing: true,

    // 删除eslint配置
    // chainWebpack: config => {
    //     config.module.rules.delete('eslint');
    // },

    // eslint-loader 是否在保存的时候检查
    lintOnSave: false,

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
        port: port,
        open: true,
        overlay: {
            warnings: false,
            errors: true
        },

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
        proxy: {
            // change xxx-api/login => mock/login
            // detail: https://cli.vuejs.org/config/#devserver-proxy
            [process.env.VUE_APP_BASE_API]: {
                // target: `http://localhost:3000`,
                target: `http://127.0.0.1:${port}/mock`,
                changeOrigin: true,
                pathRewrite: {
                    ['^' + process.env.VUE_APP_BASE_API]: ''
                }
            }
        },
        after: require('./mock/mock-server.js')
    },
    // 构建时开启多进程处理 babel 编译
    parallel: require('os').cpus().length > 1,

    // https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa
    pwa: {},

    // 第三方插件配置
    pluginOptions: {}
};
