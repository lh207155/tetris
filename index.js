
var app = new Vue({
  el: '#app',
  data:{
    baseMap : [
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
      ],
    square1:[{x: 3, y: 0}, {x: 4, y: 0}, {x: 5, y: 0}, {x: 6, y: 0}],
    square2:[{x:4,y:0},{x:5,y:0},{x:4,y:1},{x:5,y:1}],
    square3:[{x:4,y:0},{x:4,y:1},{x:5,y:1},{x:6,y:1}],
    square4:[{x:4,y:1},{x:5,y:1},{x:6,y:1},{x:6,y:0}],
    square5:[{x:4,y:1},{x:5,y:1},{x:6,y:1},{x:5,y:0}],
    square6:[{x:4,y:1},{x:5,y:1},{x:5,y:0},{x:6,y:0}],
    square7:[{x:4,y:0},{x:5,y:0},{x:5,y:1},{x:6,y:1}],
    initPos:[],
    lastPos:null,
    squareState:1
  },
  methods: {
    collision(){
      if(this.initPos.some(pos => pos.y>=20)){
        return true
      }
    },
    transform1() {
      if (this.squareState === 1) {
        this.clear()
        this.initPos[0].y -= 1
        this.initPos[0].x += 1
        this.initPos[1].y = this.initPos[1].y
        this.initPos[1].x = this.initPos[1].x
        this.initPos[2].y += 1
        this.initPos[2].x -= 1
        this.initPos[3].y += 2
        this.initPos[3].x -= 2
        this.render()
        this.squareState++
        return
      }
      if (this.squareState === 2) {
        this.clear()
        this.initPos[0].y += 1
        this.initPos[0].x -= 1
        this.initPos[1].y = this.initPos[1].y
        this.initPos[1].x = this.initPos[1].x
        this.initPos[2].y -= 1
        this.initPos[2].x += 1
        this.initPos[3].y -= 2
        this.initPos[3].x += 2
        this.squareState--
        this.render()
        return
      }
    },
    transform2() {

    },
    transform3() {
      if (this.squareState === 1) {
        this.clear()
        this.initPos[0].y -= 1
        this.initPos[0].x += 1
        this.initPos[1].y -= 2
        // this.initPos[1].x = this.initPos[1].x
        this.initPos[2].y -= 1
        this.initPos[2].x -= 1
        // this.initPos[3].y += 1
        this.initPos[3].x -= 2
        this.render()
        this.squareState++
        return
      }
      if (this.squareState === 2) {
        this.clear()
        this.initPos[0].y += 1
        this.initPos[0].x += 1
        // this.initPos[1].y += 1
        this.initPos[1].x += 2
        this.initPos[2].y -= 1
        this.initPos[2].x += 1
        this.initPos[3].y -= 2
        // this.initPos[3].x += 2
        this.squareState++
        this.render()
        return
      }
      if (this.squareState === 3) {
        this.clear()
        this.initPos[0].y += 1
        this.initPos[0].x -= 1
        this.initPos[1].y += 2
        // this.initPos[1].x += 2
        this.initPos[2].y += 1
        this.initPos[2].x += 1
        // this.initPos[3].y -= 1
        this.initPos[3].x += 2
        this.squareState++
        this.render()
        return
      }
      if (this.squareState === 4) {
        this.clear()
        this.initPos[0].y -= 1
        this.initPos[0].x -= 1
        // this.initPos[1].y += 1
        this.initPos[1].x -= 2
        this.initPos[2].y += 1
        this.initPos[2].x -= 1
        this.initPos[3].y += 2
        // this.initPos[3].x += 2
        this.squareState = 1
        this.render()
        return
      }
    },
    render() {
      this.initPos.forEach((block => {
        if(this.baseMap[block.y]){this.$set(this.baseMap[block.y], block.x, 1)}
      }))
      this.lastPos = this.initPos.map(block => ({x: block.x, y: block.y}))
    },
    clear() {
      if (this.lastPos) {
        this.lastPos.forEach((block => {
          if(block.y<=20){
            this.$set(this.baseMap[block.y], block.x, 0)
          }
        }))
        this.lastPos.length = 0
      }
    },
    fall() {
      let timestamp = setInterval(() => {
        this.clear()
        this.initPos.forEach((block => {
        block.y += 1
        }))
        this.render()
        if(this.collision()){
          clearInterval(timestamp)
          return
        }

      }, 200)
    },
    square() {
      this.initPos = this.square3
      this.fall()
    }
  },
  created(){
    this.square()
  }

})

