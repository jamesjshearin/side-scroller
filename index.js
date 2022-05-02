/*eslint-env es6*/

import platform from './img/platform.png'

const canvas = document.querySelector('canvas')
canvas.width = innerWidth
canvas.height = innerHeight
const context = canvas.getContext('2d')

class Vector{
    constructor(x, y){
        this.x = x
        this.y = y
    }
}

const gravity = 0.5

class Player{
    constructor(x, y, color){
        this.position = new Vector(x, y)
        this.color = color
        this.velocity = new Vector(0, 0)
        this.width = 40
        this.height = 40
    }
    
    draw(){
        context.fillStyle = this.color
        context.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
    
    update(){
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        
        if(this.position.y + this.height + this.velocity.y <= canvas.height){
            this.velocity.y += gravity
        }
        else{
            this.velocity.y = 0
        }
    }
}

class Platform{
    constructor({x, y}){
        this.position = new Vector(x, y)
        this.width = 200
        this.height = 20
    }
    
    draw(){
        context.fillStyle = 'blue'
        context.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}

const player = new Player(500, canvas.height - 40, 'red')
const platforms = [new Platform({x: 500, y: 700}), new Platform({x: 600, y: 900})]

const keys = {
    right: {
        pressed: false
    },
    left: {
        pressed: false
    }
}


let scrollOffset = 0

let animationId = 0
function animate(){
    requestAnimationFrame(animate)
    
    context.fillStyle = 'white'
    context.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    platforms.forEach(platform => {
        platform.draw()
    })
    
    if(keys.right.pressed && 
       player.position.x < 800){
        player.velocity.x = 5
    }
    else if(keys.left.pressed && 
           player.position.x > 300){
        player.velocity.x = -5
    }
    else{
        player.velocity.x = 0
        
        if(keys.right.pressed){
            scrollOffset += 5
            platforms.forEach(platform => {
                platform.position.x -= 5
            })
        }
        else if(keys.left.pressed){
            scrollOffset -= 5
            platforms.forEach(platform => {
                platform.position.x += 5
            })
        }
    }
    
    // platform collision detection
    platforms.forEach(platform => {
        if(player.position.y + player.height <= platform.position.y &&
        player.position.y + player.height + player.velocity.y >= platform.position.y && 
        player.position.x + player.width >= platform.position.x &&
        player.position.x <= platform.position.x + platform.width){
        player.velocity.y = 0
        }
    })
    
    if (scrollOffset > 2000){
        console.log("You Win!")
    }
}

addEventListener('keydown', ({ keyCode }) => {
    switch(keyCode){
            case 65:
                keys.left.pressed = true
                break
            case 83:
                player.velocity.y += 20
                break
            case 68:
                keys.right.pressed = true
                break
            case 87:
                player.velocity.y -= 20
                break
    }
})

addEventListener('keyup', ({ keyCode }) => {
    switch(keyCode){
            case 65:
                keys.left.pressed = false
                break
            case 83:
                player.velocity.y += 20
                break
            case 68:
                keys.right.pressed = false
                break
            case 87:
                player.velocity.y -= 10
                break
    }
})

console.log(player)

animate()