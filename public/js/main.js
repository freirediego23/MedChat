
const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// Ger username and room from URL
const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});


const socket = io();

// Joing chatroom
socket.emit('joinRoom', {username, room});


// Get room and users
socket.on('roomUsers', ({room, users}) => {
    outputRoomName(room);
    outputUsers(users);
});



// Message from server

socket.on('message', message => {
    console.log(message);
    outputMessage(message);


    // Scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;

});


// Message submit

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get Message Text
    const msg = e.target.elements.msg.value;

    console.log(msg);

    //Emit messsage to the server
    socket.emit('chatMessage', msg)

    // Clear input after writing message
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();


});


// Output Message to DOM
function outputMessage (message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}



// Add room name to DOM
function outputRoomName (room) {
    roomName.innerText = room;
}


// Add users to DOM
function outputUsers(users) {
    userList.innerHTML = `
        ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
}