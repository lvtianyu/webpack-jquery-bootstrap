// var sun = new Image();
// var moon = new Image();
// var earth = new Image();
// function init() {
//   sun.src = 'https://mdn.mozillademos.org/files/1456/Canvas_sun.png';
//   moon.src = 'https://mdn.mozillademos.org/files/1443/Canvas_moon.png';
//   earth.src = 'https://mdn.mozillademos.org/files/1429/Canvas_earth.png';
//   window.requestAnimationFrame(draw);
// }

// function draw() {
//   var ctx = document.getElementById('canvas').getContext('2d');

//   ctx.globalCompositeOperation = 'destination-over';
//   ctx.clearRect(0, 0, 350, 350); // clear canvas

//   ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
//   ctx.strokeStyle = 'rgba(0, 153, 255, 0.4)';
//   ctx.save();
//   ctx.translate(150, 150);

//   // Earth
//   var time = new Date();
//   ctx.rotate(((2 * Math.PI) / 60) * time.getSeconds() + ((2 * Math.PI) / 60000) * time.getMilliseconds());
//   ctx.translate(105, 0);
//   ctx.fillRect(0, -12, 50, 24); // Shadow
//   ctx.drawImage(earth, -12, -12);

//   // Moon
//   ctx.save();
//   ctx.rotate(((2 * Math.PI) / 6) * time.getSeconds() + ((2 * Math.PI) / 6000) * time.getMilliseconds());
//   ctx.translate(0, 28.5);
//   ctx.drawImage(moon, -3.5, -3.5);
//   ctx.restore();

//   ctx.restore();
  
//   ctx.beginPath();
//   ctx.arc(150, 150, 105, 0, Math.PI * 2, false); // Earth orbit
//   ctx.stroke();
 
//   ctx.drawImage(sun, 0, 0, 300, 300);

//   window.requestAnimationFrame(draw);
// }

// init();

import $ from 'jquery'


var R = 100;//大圆半径
var r = 60;//小圆半径
var center = R

//改方法主要是根据不同的半径生成相应的点
function createPiont( ) {
   
    var sqrt3 = (Math.sqrt(3)/2)
    var Cixcle = [];
    for(var i=0;i<arguments.length;i++){
         var x = arguments[i],
             d = arguments[0]-arguments[i];//大圈和小圈的差值
         var temporarily=[
          
            [ d+0, d+x ],
            [ d+(1/2)*x, d+(1-sqrt3)*x ],
            [ d+(3/2)*x, d+(1-sqrt3)*x ],
            [ d+2*x, d+x ],
            [ d+(3/2)*x, d+(1+sqrt3)*x ],
            [ d+(1/2)*x, d+(1+sqrt3)*x ],

         ]
         Cixcle.push(temporarily)
    }

    return Cixcle
}

var ina = 0

//canvas部分

var canvas = document.createElement( "canvas" );
document.body.appendChild(canvas)
canvas.width=500;
canvas.height=500;
var cv = canvas.getContext('2d');
cv.fillStyle="green"
cv.fillRect(0,0,500,500)


function draw () {
cv.clearRect( 0,0,500,500)
cv.beginPath()
cv.arc(center,center,R,0,2*Math.PI)
cv.closePath();
cv.stroke()
cv.beginPath()
cv.arc(center,center,r,0,2*Math.PI)
cv.closePath();
cv.stroke();


//字体设置

function coreWord() {
    cv.fillStyle = "blue"
    cv.font = '48px serif'
    cv.textAlign = 'left'
    cv.textBaseline = 'middle';
    cv.strokeText("3",90,90)
}
coreWord()

//实现边线
function drawLine() {
    var Cixcle = createPiont( R,r ),
        RP = Cixcle[0],
        rP = Cixcle[1];
        if( rP.length === RP.length ) {
            let len  =rP.length-1;
            for(var i=len;i>=0;i--) {
                cv.beginPath()
                cv.moveTo( rP[i][0], rP[i][1] )
                cv.lineTo( RP[i][0], RP[i][1] )
                cv.closePath()
                cv.stroke();

            }
        }
}
drawLine();

//两圆之间实现的字体
function writeWordSideCanvas (x,y,i,deg,words) {
    
                cv.beginPath()
                cv.save()
                cv.translate( x,y )
                cv.rotate(deg);
                
                cv.fillText(words+ina,0,0)
                cv.translate(-x,-y)
                cv.restore()
                cv.closePath()
                ina+=1
}


var index = [1,0,5,4,3,2]
var middleR = (R+r)/2; //大圈小圈中间的位置
var Cixcle = createPiont( middleR );
var rP = Cixcle[0];
//运行在两圆之间的字体
function writeWordSide(j) {
        
    let len  =rP.length;
                
      cv.font = "18px serif"
      cv.textBaseline="top"
      for(var i=len-1;i>=0;i--) {
            var x = rP[ index[i] ][0]+20;  
            
            var y = rP[ index[i] ][1]+20; 

            var deg = (Math.PI/180)*((index[i]+1)*60)
             writeWordSideCanvas(x,y,i,deg,j)
            }
            
}
writeWordSide('2017-3-1')

function a(i) {
          console.log(rP)

    var x = rP[ index[i] ][0]+20;  
            
            var y = rP[ index[i] ][1]+20; 

            var deg = (Math.PI/180)*((index[i]+1)*60)
            
            //  writeWordSideCanvas(62,10,7,deg)
}

a(0)
}

draw()

// setInterval(function() {
    
//     draw()
//     // var a = new Date().getFullYear()+'4'+Math.ceil(Math.random()*10)
//     // cv.clearRect(0,0,200,200)
//     // writeWordSide(a)
// },1000)

// cv.beginPath()
// cv.rotate(Math.PI/20)
// cv.fillRect(100,220,100,100)
// cv.fontStyle='#ffffff'
// cv.textAlign="center"
// cv.textBaseline='middle'
// cv.fillText('test',100,220)

// cv.closePath()
