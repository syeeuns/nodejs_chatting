// server code

/* 설치한 express 모듈 불러오기 */
const express = require('express')

/* 설치한 socket.io 모듈 불러오기 */
const socket = require('socket.io')

/* Node.js 기본 내장 모듈 불러오기 */
const http = require('http')

/* node.js 기본 내장 모듈 불러오기*/
const fs = require('fs')

/* express 객체 생성 */
const app = express()

/* express http 서버 생성 */
const server = http.createServer(app)

/* 생성된 서버를 socket.io에 바인딩 */
const io = socket(server)

//정적파일을 제공하기 위해 미들웨어(Middleware)를 사용하는 코드
// app.use()를 사용하여 원하는 미들웨어를 추가하여 조합할 수 있음
/*기본적으로는 클라이언트가 http://서버주소/css 로 액세스 할 경우 액세스가 거부됩니다.
서버측에서는 아무런 작업을 하지않았기 때문이죠
app.use('/css', express.static('./static/css')) 를 추가해주면 실행되는 서버 코드 기준 디렉토리의 static 폴더 안의 css 폴더는 외부 클라이언트들이 /css 경로로 액세스할 수 있음 */
app.use('/css', express.static('./static/css'))
app.use('/js', express.static('./static/js'))

/* Get 방식으로 / 경로에 접속하면 실행 됨 */
app.get('/', function (request, response) {
    fs.readFile('./static/index.html', function (err, data) {
        if (err) {
            response.send('에러')
        }
        else {
            /* HTML 파일이라는 것을 알려야하기 때문에 헤더에 해당 내용을 작성해서 보내줌 */
            response.writeHead(200, { 'Content-Type': 'text/html' })
            // HTML 데이터를 보냄 
            response.write(data)
            // 완료됨을 알림 
            response.end()
            /* write를 통해 응답할 경우 꼭! end를 사용해주어야합니다. */
        }
    })
})

// connection 이라는 이벤트가 발생할 경우 콜백함수가 실행됨
// io.sockets : 접속되는 모든 소켓들
// 접속과 동시에 콜백함수로 전달되는 소켓은 접속된 해당 소켓 
io.sockets.on('connection', function (socket) {
    socket.on('newUser', function (name) {
        console.log(name + '님이 접속하였습니다.')
        socket.name = name
        io.sockets.emit('update', { type: 'connect', name: 'SERVER', message: name + '님이 접속하였습니다.' })
    })

    socket.on('message', function (data) {
        data.name = socket.name
        console.log(data)
        /* io.sockets.emit() = 모든 유저(본인 포함)
        socket.broadcast.emit() = 본인을 제외한 나머지 모두 */
        // io.sockets.emit('update', data)
        socket.broadcast.emit('update', data)
    })

    socket.on('disconnect', function () {
        console.log(socket.name + '님이 나가셨습니다.')
        // io.sockets.emit('update', { type: 'disconnect', name: 'SERVER', message: socket.name + '님이 나가셨습니다.' })
        socket.broadcast.emit('update', { type: 'disconnect', name: 'SERVER', message: socket.name + '님이 나가셨습니다.' })
    })
})


/* 서버를 8080 포트로 listen */
server.listen(8080, function () {
    console.log('서버 실행 중..')
})