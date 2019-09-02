//socket.ioの保存
var socket = io();
var myPhoto;
var imageWidth;
var imageHeight;
var hue, sat, bri;

function preload() {
    myPhoto = loadImage('assets/cat.png', setSize);
}

function setSize(loadedImage) {
    imageWidth = loadedImage.width;
    imageHeight = loadedImage.height;
}

//受け取り用のオブジェクト
var myData = {};

socket.on('sendSocketId', function(data) {
    myData.id = data.id;
    myData.user = data.user;
    myData.x = imageWidth / 2;
    myData.y = imageHeight / 2;
    console.log(myData);
});


function setup() {
    createCanvas(imageWidth, imageHeight);
    noCursor();
    noStroke();
    background(255);
    colorMode(HSB, 360, 100, 100, 100);

}

function draw() {
    myPhoto.loadPixels(); // 画像全体の色情報を配列pixelsとして読み込み
    // x,y座標に現在のマウスの位置を代入 x,yの値が画像サイズを超えないようにconstrain関数を利用
    var x = constrain(myData.x, 0, myPhoto.width-1);
    var y = constrain(myData.y, 0, myPhoto.height-1);

    // マウス位置の色情報を取得
    var r = myPhoto.pixels[(y*width+x)*4];
    var g = myPhoto.pixels[(y*width+x)*4+1];
    var b = myPhoto.pixels[(y*width+x)*4+2];
    var a = myPhoto.pixels[(y*width+x)*4+3];

    console.log(r,g,b,a);

    if (r == g == b) {
        hue = 0;
    } else if (Math.max(r, g, b) == r) {
        if (Math.min(g,b) == g) {
            hue = 60 * ((g - b) / (r - g));
        } else {
            hue = 60 * ((g - b) / (r - b));
        }  
    } else if (Math.max(r,g,b) == g) {
        if (Math.min(r,b) == r) {
            hue = 60 * ((b - r) / (g - r)) + 120;
        } else {
            hue = 60 * ((b - r) / (g - b)) + 120;
        }
    } else {
        if (Math.min(r,g) == r) {
            hue = 60 * ((r - g) / (b - r)) + 240;
        } else {
            hue = 60 * ((r - g) / (b - g)) + 240;
        }
    }

    if (hue < 0) {
        hue = hue + 360;
    }

    if (Math.max(r,g,b) == r) {
        if (Math.min(g,b) == g) {
            sat = (r - g) / r;
        } else {
            sat = (r - b) / r;
        }
    } else if (Math.max(g,b) == g) {
        if (Math.min(r,b) == r) {
            sat = (g - r) / g;
        } else {
            sat = (g - b) / g;
        }
    } else {
        if (Math.min(r,g) == r) {
            sat = (b - r) / b;
        } else {
            sat = (b - g) / b;
        }
    }

    sat = sat * 100;

    if (Math.max(r,g,b) == r) {
        bri = r / 255 * 100;
    } else if (Math.max(g,b) == g) {
        bri = g / 255 * 100;
    } else {
        bri = b / 255 * 100;
    }

    console.log(hue,sat,bri);

    if (hue > 30) {
        fill(hue, sat ,bri ,100);
        ellipse(x, y, 15, 15);
    }


}

function mouseDragged() {
    myData.x = mouseX;
    myData.y = mouseY;

    //serverに送るデータ
    var sendData = {
        id: myData.id,
        user: myData.user,
        x: myData.x,
        y: myData.y,
        width: imageWidth,
        height: imageHeight
    }
    //serverにデータを送信
    socket.emit('spToServer', sendData);
}


// function windowResized() {
//     resizeCanvas(windowWidth, windowHeight);
// }