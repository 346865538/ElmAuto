module.exports = {
    lintOnSave: false,
    // 静态目录路径
    assetsDir: 'distVue',
    // 主页名称
    indexPath: 'index.html',
    configureWebpack: {
        performance: {
            hints: false // 关闭资源大小限制
        },
    },
    // 代理
    devServer: {
        // proxy: ''
        proxy: 'http://cangdu.org:8001'
    }
}
