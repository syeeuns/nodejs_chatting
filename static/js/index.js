// client code 

var socket = io()

// 접속되었을 때 실행
socket.on('connect', function () {
    var name = prompt('반갑습니다!', '')
    if (!name)
        name = '익명'

    socket.emit('newUser', name)

})

socket.on('update', function (data) {
    var chat = document.getElementById('chat')
    var message = document.createElement('div')
    var node = document.createTextNode(`${data.name} : ${data.message}`)
    var className = ''

    switch (data.type) {
        case 'message':
            className = 'other'
            break
        case 'connect':
            className = 'connect'
            break
        case 'disconnect':
            className = 'disconnect'
            break
    }

    message.classList.add(className)
    message.appendChild(node)
    chat.appendChild(message)
})
// 전송함수
function send() {
    // 창에 입력된 데이터 가져오기
    var message = document.getElementById('test').value
    var username = document.getElementById('whisper').value
    // 가져왔으니 데이터창 비워주기
    document.getElementById('test').value = ''
    document.getElementById('whisper').value = ''
    var chat = document.getElementById('chat')
    var msg = document.createElement('div')
    var node = document.createTextNode(message)
    msg.classList.add('me')
    msg.appendChild(node)
    chat.appendChild(msg)
    // 서버로 sent 이벤트 전달 + 데이터 같이
    socket.emit('message', { type: 'message', message: message, username: username })
    //on은 수신, emit은 전송
    // send라는 이름의 이벤트를 전송했으면 받는곳에서는 on('send') 가 있어야 받을 수 있음
    // 이벤트명이 동일한것 끼리만 데이터 송/수신이 가능
}
