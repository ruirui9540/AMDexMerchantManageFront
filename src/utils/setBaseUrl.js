//这里是一个默认的url，可以没有
let urlParams = {
    baseUrl: ""
}

switch (process.env.VUE_APP_ENV_ALIAS) {
    case 'test':
        urlParams.baseUrl = "/api"  //测试服务器地址
        break
    case 'prod':
        urlParams.baseUrl = "https://api.daccoins.com/"   //tobet.io生产环境url
        break
    default:
        urlParams.baseUrl = '/localApi' 
}

export default urlParams;