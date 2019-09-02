// express
const express = require('express');
const app = express();
// http server
const http = require('http').Server(app);
//socket.io
const io = require('socket.io')(http);
const PORT = process.env.PORT || 5000;


// 静的ファイルはpublicフォルダに入れる
app.use(express.static('public'));

// '/'でアクセスするとviewsフォルダのindex.htmlが開く
app.get('/', function(request, response) {
    response.sendFile(__dirname + '/views/index.html');
});
app.get('/rc', function(request, response) {
    response.sendFile(__dirname + '/views/receive.html');
});


//複数のデータを受け取る配列
var dataArr = [];

var user_num;

//socket通信開始
io.on('connection', function(socket) {
    console.log('通信中' + socket.id);
    console.log('接続数' + socket.client.conn.server.clientsCount);

    var clientsCount = socket.client.conn.server.clientsCount;

    switch (clientsCount) {
        case '1':
            user_num = 1;
            break;
        case '2':
            user_num = 2;
            break;
        case '3':
            user_num = 3;
            break;
        case '4':
            user_num = 4;
            break;
        case '5':
            user_num = 5;
            break;
        default:
            user_num = 0;
    }

    //最初に送るdata
    var clientData = {
        id: socket.id,
        user: user_num,
        x: 0,
        y: 0,
        width: 0,
        height: 0
    }

    dataArr.push(clientData);

    //送信
    socket.emit('sendSocketId', clientData);
    console.log(dataArr);
    console.log('接続数' + socket.client.conn.server.clientsCount);

    //SPから送られてきたデータ
    socket.on('spToServer', function(data) {

        //for文で配列の中を回している
        for (var i = 0; i < dataArr.length; i++) {
            //socke.idの照合
            if (dataArr[i].id == data.id) {
                dataArr[i].x = data.x;
                dataArr[i].y = data.y;
                dataArr[i].user = data.user;
                dataArr[i].width = data.width;
                dataArr[i].height = data.height;
            }
        }
        console.log(dataArr);

        //pc.htmlに配列（複数人分）のデータを送信
        socket.broadcast.emit('serverToPc', dataArr);
    });


    socket.on('disconnect', function() {
        console.log('通信解除');
        for (var i = 0; i < dataArr.length; i++) {
            //socke.idの照合
            if (dataArr[i].id == socket.id) {
                // このsocket.idが解除されたらballsArrから削除する
                dataArr.splice(i, 1);
            }
        }
        console.log('配列削除' + dataArr);
    });
});



http.listen(PORT, function() {
    console.log('listening on PORT');
});

// http.listen(3000, function() {
//     console.log('listening on 3000');
// });