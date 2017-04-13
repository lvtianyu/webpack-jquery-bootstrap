
import './index.css'
import '../../styles/b.css';
import '../../utils/main.js';
import $ from 'jquery'

//为了以后拓展将方法都抽离出来了，应变准备

  window.onload=function(){



//招聘启事部分的点击功能，事件委派
      $('#jionUs').delegate('.jion-us-title','click',function(event){
      var _btn = $(this).children().last(),
          _isActive = _btn.attr('class'),
          _brother = $(this).next();

          if(!_isActive){
            _btn.attr({'class':'unActive'})
            _brother.attr({"style":"display:block"});
          }else{
            _btn.removeClass()
            _brother.attr({"style": "display:none"});

          }
    })

//轮播部分方法

  
};
