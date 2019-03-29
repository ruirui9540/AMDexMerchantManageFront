let utils = {};

//保存cookie
//参数：cookie名,cookie值,有效时长(单位：天)
utils.setCookie = function(cookieName,cookieValue,cookieDates){
    var d = new Date();
	d.setDate(d.getDate() + cookieDates);
    document.cookie = cookieName + '=' + cookieValue + ';expires=' + d.toGMTString();
}

// 获取cookie
utils.getCookie = function(cookieName){
    var cookieStr = unescape(document.cookie);
    var arr = cookieStr.split(';');
    var cookieValue = '';
    for(var i = 0; i < arr.length; i++) {
        var temp = arr[i].split('=');
        if( temp[0] == cookieName ) {
            cookieValue=temp[1];
            break;
        }
    }
    return cookieValue
}


//不够10， 补0
utils.toFillZero = function(str){
    if(Number(str) < 10) {
      return '0' + str;
    }else {
      return str;
    }
}

utils.format = function(date, format) {
    if (typeof date == 'string') {
        if (date.indexOf("+08:00") >= 0) {
            date = new Date(date);
        } else {
            if (date.indexOf('T') >= 0) {
                date = date.replace('T', ' ')
            }
            date = new Date(Date.parse(date.replace(/\-/g, "/")))
        }
    }
    var o = {
        "M+": date.getMonth() + 1,
        "d+": date.getDate(),
        "h+": date.getHours(),
        "m+": date.getMinutes(),
        "s+": date.getSeconds(),
        "q+": Math.floor((date.getMonth() + 3) / 3),
        "S": date.getMilliseconds()
    };
    var w = [
        ['日', '一', '二', '三', '四', '五', '六'],
        ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
        ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
    ];
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    if (/(w+)/.test(format)) {
        format = format.replace(RegExp.$1, w[RegExp.$1.length - 1][date.getDay()]);
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
}

utils.getThirdNo = function() {
    let arr = ['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
    let _str = new Date().getTime();
    for(var i = 0; i< 3; i++) {
        let randomLen = parseInt(Math.random() * 36);
        _str += arr[randomLen];
    }
    return _str;
}

export default utils;