   var userAgent = (function () {

        var u = navigator.userAgent, app = navigator.appVersion, prefix, userAgentNavugator={};
        if (u.indexOf('Trident') > -1) {
            prefix = "-ms-"; //IE内核
        } else if (u.indexOf('Presto') > -1) {
            prefix = "-o-";//opera内核
        } else if (u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1) {
            prefix = "-moz-";//opera内核 //火狐内核
        } else {
            prefix = "-webkit-"
        }

        
        //判断是否是移动终端
        if (u.indexOf('Mobile') > -1) {
            userAgentNavugator.appEnvironment = "mobile"
        } else if (u.indexOf('iPad') > -1) {
            userAgentNavugator.appEnvironment = "ipad"
        } else {
            userAgentNavugator.appEnvironment = "pc"
        }
        userAgentNavugator.prefix = prefix
        return userAgentNavugator

    })();
    export default userAgent 