var socket = io();

var animate = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (callback) {
    window.setTimeout(callback, 1000 / 60)
};
var canvas = document.createElement("canvas");
var width = 800;
var height = 600;
canvas.width = width;
canvas.height = height;
var context = canvas.getContext('2d');
var player = new Player();
var computer = new Computer();
var ball = new Ball(400, 300);



var keysDown = {};
let score1 = 0;
let score2 = 0;
let scoreboard1 = document.querySelector('.score1');
let scoreboard2 = document.querySelector('.score2');
var render = function () {
context.fillStyle = "#FEFCF5";
context.fillRect(0, 0, width, height);
context.strokeStyle = "red";
context.lineWidth = 5;
context.beginPath();
context.moveTo(0,300);
context.lineTo(800,300);
context.stroke();
player.render();
computer.render();
ball.render();
};
let p2 = {
    y:0,
    x:0,
    xspeed:0,
    yspeed:0
}
let b2 = {
    x:width/2,
    y:height/2,
}
var update = function () {
    
let data = {
    ballx: ball.x,
    bally: ball.y,
    playerx: player.paddle.x,
    playery: player.paddle.y,
    xspeed: player.paddle.x_speed,
    yspeed: player.paddle.y_speed,
    score1:score1,
    score2:score2,
}
if(player2)
{
    data.playerx = computer.paddle.x;
    data.playery = computer.paddle.y;
    data.xspeed = computer.paddle.x_speed;
    data.yspeed = computer.paddle.y_speed;
}    
socket.emit('update',data);
socket.on('update',data=>{
    p2.x = data.playerx;
    p2.y = data.playery;
    b2.x = data.ballx;
    b2.y = data.bally;
    p2.xspeed = data.xspeed;
    p2.yspeed = data.yspeed;
    if(player2)
    {
        score1 = data.score1;
        score2 = data.score2;
    }
});
if(player1)
{
    ball.update(player.paddle, computer.paddle);
    player.update();
    computer.paddle.x = p2.x;
    computer.paddle.y = p2.y;
    computer.paddle.x_speed = p2.xspeed;
    computer.paddle.y_speed = p2.yspeed;
     
}
if(player2)
{
    computer.update();
    player.paddle.x = p2.x;
    player.paddle.y = p2.y;
    player.paddle.x_speed = p2.xspeed;
    player.paddle.y_speed = p2.yspeed;
    ball.x = b2.x;
    ball.y = b2.y;
}
scoreboard1.innerHTML = `${score1}`;
scoreboard2.innerHTML = `${score2}`;

};

var step = function () {
update();
render();
animate(step);
};

function Paddle(x, y, width, height) {
this.x = x;
this.y = y;
this.width = width;
this.height = height;
this.x_speed = 0;
this.y_speed = 0;
}

Paddle.prototype.render = function () {
context.fillStyle = "#09A069";
context.fillRect(this.x, this.y, this.width, this.height);
context.fillStyle = "#19F3A4";
context.fillRect(this.x+3, this.y+3, this.width-6, this.height-6);
};

Paddle.prototype.move = function (x, y) {
this.x += x;
this.y += y;
this.x_speed = x;
this.y_speed = y;
if (this.x < 0) {
    this.x = 0;
    this.x_speed = 0;
} else if (this.x + this.width > 800) {
    this.x = 800 - this.width;
    this.x_speed = 0;
}
};

function Computer() {
this.paddle = new Paddle(355, 10, 120, 15);
}

Computer.prototype.render = function () {
this.paddle.render();
};

Computer.prototype.update = function () {
// var x_pos = ball.x;
// var diff = -((this.paddle.x + (this.paddle.width / 2)) - x_pos);
// if (diff < 0 && diff < -4) {
//     diff = -5;
// } else if (diff > 0 && diff > 4) {
//     diff = 5;
// }
// this.paddle.move(diff, 0);
// if (this.paddle.x < 0) {
//     this.paddle.x = 0;
// } else if (this.paddle.x + this.paddle.width > 800) {
//     this.paddle.x = 800 - this.paddle.width;
// }
for (var key in keysDown) {
    var value = Number(key);
    if (value == 37) {
        this.paddle.move(-4, 0);
    } else if (value == 39) {
        this.paddle.move(4, 0);
    } else {
        this.paddle.move(0, 0);
    }
}

};

function Player() {
this.paddle = new Paddle(355, 580, 120, 15);
}

Player.prototype.render = function () {
this.paddle.render();
};

Player.prototype.update = function () {
for (var key in keysDown) {
    var value = Number(key);
    if (value == 37) {
        this.paddle.move(-4, 0);
    } else if (value == 39) {
        this.paddle.move(4, 0);
    } else {
        this.paddle.move(0, 0);
    }
}
};

function Ball(x, y) {
this.x = x;
this.y = y;
this.x_speed = 0;
this.y_speed = 3;
}

Ball.prototype.render = function () {
context.beginPath();
context.arc(this.x,this.y, 7, 2 * Math.PI, false);
context.fillStyle = "red";
context.fill();
context.beginPath();
context.arc(this.x,this.y, 5, 2 * Math.PI, false);
context.fillStyle = "white";
context.fill();
};

Ball.prototype.update = function (paddle1, paddle2) {
this.x += this.x_speed;
this.y += this.y_speed;
var top_x = this.x - 5;
var top_y = this.y - 5;
var bottom_x = this.x + 5;
var bottom_y = this.y + 5;

if (this.x - 5 < 0) {
    this.x = 5;
    this.x_speed = -this.x_speed;
} else if (this.x + 5 > 800) {
    this.x = 795;
    this.x_speed = -this.x_speed;
}

if (this.y < 0 || this.y > 600 || b2.y<0 || b2.y>600) {

    if(this.y<0)
    {
        score2 += 1;
    }
    if(this.y>600)
    {
        score1 +=1;
    }
    this.x_speed = 0;
    this.y_speed = 3;
    this.x = 400;
    this.y = 300;
}

if (top_y > 300) {
    if (top_y < (paddle1.y + paddle1.height) && bottom_y > paddle1.y && top_x < (paddle1.x + paddle1.width) && bottom_x > paddle1.x) {
        this.y_speed = -3;

        this.x_speed += (paddle1.x_speed / 2);
        this.y += this.y_speed;
    }
} else {
    if (top_y < (paddle2.y + paddle2.height) && bottom_y > paddle2.y && top_x < (paddle2.x + paddle2.width) && bottom_x > paddle2.x) {
        this.y_speed = 3;
        this.x_speed += (paddle2.x_speed / 2);
        this.y += this.y_speed;
    }
}
};
let refresh = (function() {
    var executed = false;
    return function() {
        if (!executed) {
            executed = true;
            location.reload();
        }
    };
})
let t = document.querySelector('.t');

document.body.appendChild(canvas);
let start = document.querySelector('.start');
let status = document.querySelector('.status');
let heading= document.querySelector('.heading');
let subheading = document.querySelector('.sub-heading');
let player1 = false;
let player2 = false;
start.disabled = true;
socket.on('ok',(data)=>{
    status.className = 'connected';
   status.innerHTML = `<p>CONNECTED!</p>`;
   start.disabled = false;
   if(socket.id == data[0])
   {
    status.innerHTML += `<p>PLAYER 1</p>`;
       player1 = true;
       pleyer2 = false;
   }
   if(socket.id == data[1])
   {
    status.innerHTML += `<p>PLAYER 2</p>`;
       player2= true;
       player1 = false;
   }

})
start.addEventListener('click',()=>{
    socket.emit('start',null);
})
socket.on('start',(data)=>{
   start.remove();
   subheading.className = 'sub-heading2';
   heading.className = 'heading2'; 
   animate(step);   
})
    



window.addEventListener("keydown", function (event) {
keysDown[event.keyCode] = true;
});

window.addEventListener("keyup", function (event) {
delete keysDown[event.keyCode];
});
