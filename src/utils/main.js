 /*
    //main.js
    //webpack配置环境
    //lv
    //2016/2/5
    //主要来设置公用url,font-size,如果需要登录，添加登陆接口
    //目前只设置了font-size,
 */
     
    var viewWidth ,//做永久存储
        html = document.documentElement;//获得html

    if (!viewWidth) {
        if (html) {
            var windowWidth = html.clientWidth / 14;
            viewWidth = windowWidth + 'px';
            // localStorage.setItem("viewWidth", viewWidth);
        }
    }
    
    html.style.fontSize=viewWidth // 设置根元素的字体大小