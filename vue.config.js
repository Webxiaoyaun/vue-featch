module.exports = {
    publicPath: "./",
    outputDir: 'dist', // 构建输出目录
    assetsDir: './assets', // 静态资源目录 (js, css, img, fonts)
    lintOnSave: false, // 是否开启eslint保存检测，有效值：ture | false | 'error'
    runtimeCompiler: true, // 运行时版本是否需要编译
    transpileDependencies: [], // 默认babel-loader忽略mode_modules，这里可增加例外的依赖包名
    productionSourceMap: false,
    chainWebpack: config => {
        if (process.env.NODE_ENV === 'production') {
            // 清除css，js版本号
            config.output.filename('static/js/[name].js').end();
            config.output.chunkFilename('static/js/[name].js').end();
            // 为生产环境修改配置...
            config.plugin('extract-css').tap(args => [{
                filename: `static/css/[name].css`,
                chunkFilename: `static/css/[name].css`
            }])

        }
    },
    devServer: {
        open: true,
        disableHostCheck: true,
        port: 8000, // 端口
    },
    lintOnSave: false ,// 取消 eslint 验证
    css: {
        loaderOptions: {
            postcss: {
                plugins: [
                    require('postcss-pxtorem')({
                        rootValue :100, // 换算的基数
                        selectorBlackList  : ['weui','mu','el','mint-'], // 忽略转换正则匹配项
                        propList   : ['*'],
                    }),
                ]
            }
        }
    },
};