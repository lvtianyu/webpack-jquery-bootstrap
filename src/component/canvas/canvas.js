var target = document.getElementById('canvas')
        


        target.onmouseenter = function (ev) {
            startX = ev.clientX;
        };
        target.onmouseleave = function (ev) {
            
    
        };
        target.onmousemove = function (ev) {
            var client = ev.clientX;//pc版
        }

var canvas = document.createElement( "canvas" );
document.body.appendChild(canvas)
var ctx = canvas.getContext('2d')

ctx.beginPath()
ctx.fillStyle="green"
ctx.fillRect(0,0,500,500)
ctx.closePath()
ctx.beginPath()
ctx.fillStyle = 'blue'
ctx.fillRect(0,0,50,50)
ctx.closePath()

