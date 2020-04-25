
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
      ],
    //长条
    square1:[{x: 3, y:0 }, {x: 4, y: 0}, {x: 5, y: 0}, {x: 6, y: 0}],
    //矩形
    square2:[{x:4,y:0},{x:5,y:0},{x:4,y:1},{x:5,y:1}],
    //拐1：|_
    square3:[{x:4,y:0},{x:4,y:1},{x:5,y:1},{x:6,y:1}],
    //拐2  _|
    square4:[{x:4,y:1},{x:5,y:1},{x:6,y:1},{x:6,y:0}],
    //丁
    square5:[{x:4,y:1},{x:5,y:1},{x:6,y:1},{x:5,y:0}],
    //反Z
    square6:[{x:4,y:1},{x:5,y:1},{x:5,y:0},{x:6,y:0}],
    //正Z
    square7:[{x:4,y:0},{x:5,y:0},{x:5,y:1},{x:6,y:1}],
    //用来存放方块的实时位置
    initPos:[],
    //用来存放方块的上一次位移的位置
    lastPos:null,
    //用来记录方块变形的状态
    squareState:1,
    //用来存放当前下落的方块类型
    currentSquare:null,
    flag : 1,
    score:0,
    clearCount:0,
    timeOutId:null
  },
  methods: {
    //方块变形方法
    transform1(e) {
      if(this.initPos&&e.key==='ArrowUp'){
        //判断方块处于何种状态
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
          //变形前判断变形后是否会碰撞或触底
          //这里会报 xxx of undefined 因为方块走到上面的时候变形，可能会超过边界，所以在初始化方块时最好时往下一层
          if(this.initPos.some(block=>!this.baseMap[block.y])||(this.initPos.some(block=>this.baseMap[block.y][block.x]))||this.initPos.some(block=>block.y>20||(block.x<0||block.x>9))){
            //修正
            this.initPos[0].y += 1
            this.initPos[0].x -= 1
            this.initPos[1].y = this.initPos[1].y
            this.initPos[1].x = this.initPos[1].x
            this.initPos[2].y -= 1
            this.initPos[2].x += 1
            this.initPos[3].y -= 2
            this.initPos[3].x += 2.
            //重新渲染，并且不用抹除
            this.render()
            //直接结束本次变形，不改变方块状态
            return
          }else{
            this.render()
            //改变方块状态
            this.squareState++
            return
          }

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
          if(this.initPos.some(block=>!this.baseMap[block.y])||(this.initPos.some(block=>this.baseMap[block.y][block.x]))||this.initPos.some(block=>block.y>20||(block.x<0||block.x>9))){
            this.initPos[0].y -= 1
            this.initPos[0].x += 1
            this.initPos[1].y = this.initPos[1].y
            this.initPos[1].x = this.initPos[1].x
            this.initPos[2].y += 1
            this.initPos[2].x -= 1
            this.initPos[3].y += 2
            this.initPos[3].x -= 2
            this.render()
            return
          }else{
            this.squareState--
            this.render()
            return
          }

        }
      }
      if(this.initPos&&e.key==='ArrowLeft'){
        this.clear()
        this.initPos[0].x -= 1
        this.initPos[1].x -= 1
        this.initPos[2].x -= 1
        this.initPos[3].x -= 1
        //变形前判断变形后是否会碰撞或触底
        //这里会报 xxx of undefined 因为方块走到上面的时候变形，可能会超过边界，所以在初始化方块时最好时往下一层
        if(this.initPos.some(block=>!this.baseMap[block.y])||(this.initPos.some(block=>this.baseMap[block.y][block.x]))||this.initPos.some(block=>block.y>20||(block.x<0||block.x>9))){
          //修正
          this.initPos[0].x += 1
          this.initPos[1].x += 1
          this.initPos[2].x += 1
          this.initPos[3].x += 1
          //重新渲染，并且不用抹除
          this.render()
          //直接结束本次变形，不改变方块状态
          return
        }else{
          this.render()
          return
        }
      }
      if(this.initPos&&e.key==='ArrowRight'){
        this.clear()
        this.initPos[0].x += 1
        this.initPos[1].x += 1
        this.initPos[2].x += 1
        this.initPos[3].x += 1
        //变形前判断变形后是否会碰撞或触底
        //这里会报 xxx of undefined 因为方块走到上面的时候变形，可能会超过边界，所以在初始化方块时最好时往下一层
        if(this.initPos.some(block=>!this.baseMap[block.y])||(this.initPos.some(block=>this.baseMap[block.y][block.x]))||this.initPos.some(block=>block.y>20||(block.x<0||block.x>9))){
          //修正
          this.initPos[0].x -= 1
          this.initPos[1].x -= 1
          this.initPos[2].x -= 1
          this.initPos[3].x -= 1
          //重新渲染，并且不用抹除
          this.render()
          //直接结束本次变形，不改变方块状态
          return
        }else{
          this.render()
          return
        }
      }
    },
    transform2(e) {
      if(this.initPos&&e.key==='ArrowLeft'){
        this.clear()
        this.initPos[0].x -= 1
        this.initPos[1].x -= 1
        this.initPos[2].x -= 1
        this.initPos[3].x -= 1
        //变形前判断变形后是否会碰撞或触底
        //这里会报 xxx of undefined 因为方块走到上面的时候变形，可能会超过边界，所以在初始化方块时最好时往下一层
        if(this.initPos.some(block=>!this.baseMap[block.y])||(this.initPos.some(block=>this.baseMap[block.y][block.x]))||this.initPos.some(block=>block.y>20||(block.x<0||block.x>9))){
          //修正
          this.initPos[0].x += 1
          this.initPos[1].x += 1
          this.initPos[2].x += 1
          this.initPos[3].x += 1
          //重新渲染，并且不用抹除
          this.render()
          //直接结束本次变形，不改变方块状态
          return
        }else{
          this.render()
          return
        }
      }
      if(this.initPos&&e.key==='ArrowRight'){
        this.clear()
        this.initPos[0].x += 1
        this.initPos[1].x += 1
        this.initPos[2].x += 1
        this.initPos[3].x += 1
        //变形前判断变形后是否会碰撞或触底
        //这里会报 xxx of undefined 因为方块走到上面的时候变形，可能会超过边界，所以在初始化方块时最好时往下一层
        if(this.initPos.some(block=>!this.baseMap[block.y])||(this.initPos.some(block=>this.baseMap[block.y][block.x]))||this.initPos.some(block=>block.y>20||(block.x<0||block.x>9))){
          //修正
          this.initPos[0].x -= 1
          this.initPos[1].x -= 1
          this.initPos[2].x -= 1
          this.initPos[3].x -= 1
          //重新渲染，并且不用抹除
          this.render()
          //直接结束本次变形，不改变方块状态
          return
        }else{
          this.render()
          return
        }
      }
    },
    transform3(e) {
      if(this.initPos&&e.key==='ArrowUp'){
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
          if(this.initPos.some(block=>!this.baseMap[block.y])||(this.initPos.some(block=>this.baseMap[block.y][block.x]))||this.initPos.some(block=>block.y>20||(block.x<0||block.x>9))){
            this.initPos[0].y += 1
            this.initPos[0].x -= 1
            this.initPos[1].y += 2
            // this.initPos[1].x = this.initPos[1].x
            this.initPos[2].y += 1
            this.initPos[2].x += 1
            // this.initPos[3].y += 1
            this.initPos[3].x += 2
            this.render()
            return
          }
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
          if(this.initPos.some(block=>!this.baseMap[block.y])||(this.initPos.some(block=>this.baseMap[block.y][block.x]))||this.initPos.some(block=>block.y>20||(block.x<0||block.x>9))){
            this.initPos[0].y -= 1
            this.initPos[0].x -= 1
            // this.initPos[1].y += 1
            this.initPos[1].x -= 2
            this.initPos[2].y += 1
            this.initPos[2].x -= 1
            this.initPos[3].y += 2
            // this.initPos[3].x += 2
            this.render()
            return
          }
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
          if(this.initPos.some(block=>!this.baseMap[block.y])||(this.initPos.some(block=>this.baseMap[block.y][block.x]))||this.initPos.some(block=>block.y>20||(block.x<0||block.x>9))){
            this.initPos[0].y -= 1
            this.initPos[0].x += 1
            this.initPos[1].y -= 2
            // this.initPos[1].x += 2
            this.initPos[2].y -= 1
            this.initPos[2].x -= 1
            // this.initPos[3].y -= 1
            this.initPos[3].x -= 2
            this.render()
            return
          }
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
          if(this.initPos.some(block=>!this.baseMap[block.y])||(this.initPos.some(block=>this.baseMap[block.y][block.x]))||this.initPos.some(block=>block.y>20||(block.x<0||block.x>9))){
            this.initPos[0].y += 1
            this.initPos[0].x += 1
            // this.initPos[1].y += 1
            this.initPos[1].x += 2
            this.initPos[2].y -= 1
            this.initPos[2].x += 1
            this.initPos[3].y -= 2
            // this.initPos[3].x += 2
            this.render()
            return
          }
          this.squareState = 1
          this.render()
          return
        }
      }
      if(this.initPos&&e.key==='ArrowLeft'){
        this.clear()
        this.initPos[0].x -= 1
        this.initPos[1].x -= 1
        this.initPos[2].x -= 1
        this.initPos[3].x -= 1
        //变形前判断变形后是否会碰撞或触底
        //这里会报 xxx of undefined 因为方块走到上面的时候变形，可能会超过边界，所以在初始化方块时最好时往下一层
        if(this.initPos.some(block=>!this.baseMap[block.y])||(this.initPos.some(block=>this.baseMap[block.y][block.x]))||this.initPos.some(block=>block.y>20||(block.x<0||block.x>9))){
          //修正
          this.initPos[0].x += 1
          this.initPos[1].x += 1
          this.initPos[2].x += 1
          this.initPos[3].x += 1
          //重新渲染，并且不用抹除
          this.render()
          //直接结束本次变形，不改变方块状态
          return
        }else{
          this.render()
          return
        }
      }
      if(this.initPos&&e.key==='ArrowRight'){
        this.clear()
        this.initPos[0].x += 1
        this.initPos[1].x += 1
        this.initPos[2].x += 1
        this.initPos[3].x += 1
        //变形前判断变形后是否会碰撞或触底
        //这里会报 xxx of undefined 因为方块走到上面的时候变形，可能会超过边界，所以在初始化方块时最好时往下一层
        if(this.initPos.some(block=>!this.baseMap[block.y])||(this.initPos.some(block=>this.baseMap[block.y][block.x]))||this.initPos.some(block=>block.y>20||(block.x<0||block.x>9))){
          //修正
          this.initPos[0].x -= 1
          this.initPos[1].x -= 1
          this.initPos[2].x -= 1
          this.initPos[3].x -= 1
          //重新渲染，并且不用抹除
          this.render()
          //直接结束本次变形，不改变方块状态
          return
        }else{
          this.render()
          return
        }
      }
    },
    transform4(e) {
      if(this.initPos&&e.key==='ArrowUp'){
        if (this.squareState === 1) {
          this.clear()
          this.initPos[0].y -= 2
          // this.initPos[0].x -= 1
          this.initPos[1].y -= 1
          this.initPos[1].x -= 1
          // this.initPos[2].y -= 1
          this.initPos[2].x -= 2
          this.initPos[3].y += 1
          this.initPos[3].x -= 1
          if(this.initPos.some(block=>!this.baseMap[block.y])||(this.initPos.some(block=>this.baseMap[block.y][block.x]))||this.initPos.some(block=>block.y>20||(block.x<0||block.x>9))){
            this.initPos[0].y += 2
            // this.initPos[0].x -= 1
            this.initPos[1].y += 1
            this.initPos[1].x += 1
            // this.initPos[2].y += 1
            this.initPos[2].x += 2
            this.initPos[3].y -= 1
            this.initPos[3].x += 1
            this.render()
            return
          }
          this.render()
          this.squareState++
          return
        }
        if (this.squareState === 2) {
          this.clear()
          // this.initPos[0].y += 1
          this.initPos[0].x += 2
          this.initPos[1].y -= 1
          this.initPos[1].x += 1
          this.initPos[2].y -= 2
          // this.initPos[2].x += 1
          this.initPos[3].y -= 1
          this.initPos[3].x -= 1
          if(this.initPos.some(block=>!this.baseMap[block.y])||(this.initPos.some(block=>this.baseMap[block.y][block.x]))||this.initPos.some(block=>block.y>20||(block.x<0||block.x>9))){
            // this.initPos[0].y -= 1
            this.initPos[0].x -= 2
            this.initPos[1].y += 1
            this.initPos[1].x -= 1
            this.initPos[2].y += 2
            // this.initPos[2].x -= 1
            this.initPos[3].y += 1
            this.initPos[3].x += 1
            this.render()
            return
          }
          this.squareState++
          this.render()
          return
        }
        if (this.squareState === 3) {
          this.clear()
          this.initPos[0].y += 2
          // this.initPos[0].x -= 1
          this.initPos[1].y += 1
          this.initPos[1].x += 1
          // this.initPos[2].y += 1
          this.initPos[2].x += 2
          this.initPos[3].y -= 1
          this.initPos[3].x += 1
          if(this.initPos.some(block=>!this.baseMap[block.y])||(this.initPos.some(block=>this.baseMap[block.y][block.x]))||this.initPos.some(block=>block.y>20||(block.x<0||block.x>9))){
            this.initPos[0].y -= 2
            // this.initPos[0].x += 1
            this.initPos[1].y -= 1
            this.initPos[1].x -= 1
            // this.initPos[2].y -= 1
            this.initPos[2].x -= 2
            this.initPos[3].y += 1
            this.initPos[3].x -= 1
            this.render()
            return
          }
          this.squareState++
          this.render()
          return
        }
        if (this.squareState === 4) {
          this.clear()
          // this.initPos[0].y -= 2
          this.initPos[0].x -= 2
          this.initPos[1].y += 1
          this.initPos[1].x -= 1
          this.initPos[2].y += 2
          // this.initPos[2].x += 2
          this.initPos[3].y += 1
          this.initPos[3].x += 1
          if(this.initPos.some(block=>!this.baseMap[block.y])||(this.initPos.some(block=>this.baseMap[block.y][block.x]))||this.initPos.some(block=>block.y>20||(block.x<0||block.x>9))){
            // this.initPos[0].y += 2
            this.initPos[0].x += 2
            this.initPos[1].y -= 1
            this.initPos[1].x += 1
            this.initPos[2].y -= 2
            // this.initPos[2].x -= 2
            this.initPos[3].y -= 1
            this.initPos[3].x -= 1
            this.render()
            return
          }
          this.squareState = 1
          this.render()
          return
        }
      }
      if(this.initPos&&e.key==='ArrowLeft'){
        this.clear()
        this.initPos[0].x -= 1
        this.initPos[1].x -= 1
        this.initPos[2].x -= 1
        this.initPos[3].x -= 1
        //变形前判断变形后是否会碰撞或触底
        //这里会报 xxx of undefined 因为方块走到上面的时候变形，可能会超过边界，所以在初始化方块时最好时往下一层
        if(this.initPos.some(block=>!this.baseMap[block.y])||(this.initPos.some(block=>this.baseMap[block.y][block.x]))||this.initPos.some(block=>block.y>20||(block.x<0||block.x>9))){
          //修正
          this.initPos[0].x += 1
          this.initPos[1].x += 1
          this.initPos[2].x += 1
          this.initPos[3].x += 1
          //重新渲染，并且不用抹除
          this.render()
          //直接结束本次变形，不改变方块状态
          return
        }else{
          this.render()
          return
        }
      }
      if(this.initPos&&e.key==='ArrowRight'){
        this.clear()
        this.initPos[0].x += 1
        this.initPos[1].x += 1
        this.initPos[2].x += 1
        this.initPos[3].x += 1
        //变形前判断变形后是否会碰撞或触底
        //这里会报 xxx of undefined 因为方块走到上面的时候变形，可能会超过边界，所以在初始化方块时最好时往下一层
        if(this.initPos.some(block=>!this.baseMap[block.y])||(this.initPos.some(block=>this.baseMap[block.y][block.x]))||this.initPos.some(block=>block.y>20||(block.x<0||block.x>9))){
          //修正
          this.initPos[0].x -= 1
          this.initPos[1].x -= 1
          this.initPos[2].x -= 1
          this.initPos[3].x -= 1
          //重新渲染，并且不用抹除
          this.render()
          //直接结束本次变形，不改变方块状态
          return
        }else{
          this.render()
          return
        }
      }
    },
    transform5(e) {
      if(this.initPos&&e.key==='ArrowUp'){
        if (this.squareState === 1) {
          this.clear()
          this.initPos[0].y += 1
          this.initPos[0].x += 1
          // this.initPos[1].y -= 1
          // this.initPos[1].x -= 1
          // // this.initPos[2].y -= 1
          // this.initPos[2].x -= 2
          // this.initPos[3].y += 1
          // this.initPos[3].x -= 1
          if(this.initPos.some(block=>!this.baseMap[block.y])||(this.initPos.some(block=>this.baseMap[block.y][block.x]))||this.initPos.some(block=>block.y>20||(block.x<0||block.x>9))){
            this.initPos[0].y -= 1
            this.initPos[0].x -= 1
            // this.initPos[1].y += 1
            // this.initPos[1].x += 1
            // // this.initPos[2].y += 1
            // this.initPos[2].x += 2
            // this.initPos[3].y -= 1
            // this.initPos[3].x += 1
            this.render()
            return
          }
          this.render()
          this.squareState++
          return
        }
        if (this.squareState === 2) {
          this.clear()
          // this.initPos[0].y += 1
          // this.initPos[0].x += 2
          // this.initPos[1].y -= 1
          // this.initPos[1].x += 1
          // this.initPos[2].y -= 2
          // this.initPos[2].x -= 2
          this.initPos[3].y += 1
          this.initPos[3].x -= 1
          if(this.initPos.some(block=>!this.baseMap[block.y])||(this.initPos.some(block=>this.baseMap[block.y][block.x]))||this.initPos.some(block=>block.y>20||(block.x<0||block.x>9))){
            // this.initPos[0].y -= 1
            // this.initPos[0].x -= 2
            // this.initPos[1].y += 1
            // this.initPos[1].x -= 1
            // this.initPos[2].y += 2
            // this.initPos[2].x += 2
            this.initPos[3].y -= 1
            this.initPos[3].x += 1
            this.render()
            return
          }
          this.squareState++
          this.render()
          return
        }
        if (this.squareState === 3) {
          this.clear()
          // this.initPos[0].y += 2
          // // this.initPos[0].x -= 1
          // this.initPos[1].y += 1
          // this.initPos[1].x += 1
          this.initPos[2].y -= 1
          this.initPos[2].x -= 1
          // this.initPos[3].y -= 1
          // this.initPos[3].x += 1
          if(this.initPos.some(block=>!this.baseMap[block.y])||(this.initPos.some(block=>this.baseMap[block.y][block.x]))||this.initPos.some(block=>block.y>20||(block.x<0||block.x>9))){
            // this.initPos[0].y -= 2
            // // this.initPos[0].x += 1
            // this.initPos[1].y -= 1
            // this.initPos[1].x -= 1
            this.initPos[2].y += 1
            this.initPos[2].x += 1
            // this.initPos[3].y += 1
            // this.initPos[3].x -= 1
            this.render()
            return
          }
          this.squareState++
          this.render()
          return
        }
        if (this.squareState === 4) {
          this.clear()
          this.initPos[0].y -= 1
          this.initPos[0].x += 1
          // this.initPos[1].y += 1
          // this.initPos[1].x -= 1
          // this.initPos[2].y += 2
          // // this.initPos[2].x += 2
          // this.initPos[3].y += 1
          // this.initPos[3].x += 1
          if(this.initPos.some(block=>!this.baseMap[block.y])||(this.initPos.some(block=>this.baseMap[block.y][block.x]))||this.initPos.some(block=>block.y>20||(block.x<0||block.x>9))){
            this.initPos[0].y += 1
            this.initPos[0].x -= 1
            // this.initPos[1].y -= 1
            // this.initPos[1].x += 1
            // this.initPos[2].y -= 2
            // // this.initPos[2].x -= 2
            // this.initPos[3].y -= 1
            // this.initPos[3].x -= 1
            this.render()
            return
          }
          this.squareState = 1
          this.render()

          //不对称单元变换,索引变了,..难受,再把索引调回去
          let index = this.initPos[0]
          this.initPos[0] = this.initPos[3]
          this.initPos[3] = this.initPos[2]
          this.initPos[2] = index
          return
        }
      }
      if(this.initPos&&e.key==='ArrowLeft'){
        this.clear()
        this.initPos[0].x -= 1
        this.initPos[1].x -= 1
        this.initPos[2].x -= 1
        this.initPos[3].x -= 1
        //变形前判断变形后是否会碰撞或触底
        //这里会报 xxx of undefined 因为方块走到上面的时候变形，可能会超过边界，所以在初始化方块时最好时往下一层
        if(this.initPos.some(block=>!this.baseMap[block.y])||(this.initPos.some(block=>this.baseMap[block.y][block.x]))||this.initPos.some(block=>block.y>20||(block.x<0||block.x>9))){
          //修正
          this.initPos[0].x += 1
          this.initPos[1].x += 1
          this.initPos[2].x += 1
          this.initPos[3].x += 1
          //重新渲染，并且不用抹除
          this.render()
          //直接结束本次变形，不改变方块状态
          return
        }else{
          this.render()
          return
        }
      }
      if(this.initPos&&e.key==='ArrowRight'){
        this.clear()
        this.initPos[0].x += 1
        this.initPos[1].x += 1
        this.initPos[2].x += 1
        this.initPos[3].x += 1
        //变形前判断变形后是否会碰撞或触底
        //这里会报 xxx of undefined 因为方块走到上面的时候变形，可能会超过边界，所以在初始化方块时最好时往下一层
        if(this.initPos.some(block=>!this.baseMap[block.y])||(this.initPos.some(block=>this.baseMap[block.y][block.x]))||this.initPos.some(block=>block.y>20||(block.x<0||block.x>9))){
          //修正
          this.initPos[0].x -= 1
          this.initPos[1].x -= 1
          this.initPos[2].x -= 1
          this.initPos[3].x -= 1
          //重新渲染，并且不用抹除
          this.render()
          //直接结束本次变形，不改变方块状态
          return
        }else{
          this.render()
          return
        }
      }
    },
    transform6(e) {
      if(this.initPos&&e.key==='ArrowUp'){
        //判断方块处于何种状态
        if (this.squareState === 1) {
          this.clear()
          this.initPos[0].y -= 1
          // this.initPos[0].x += 1
          // this.initPos[1].y = this.initPos[1].y
          this.initPos[1].x -= 1
          this.initPos[2].y += 1
          // this.initPos[2].x -= 1
          this.initPos[3].y += 2
          this.initPos[3].x -= 1
          //变形前判断变形后是否会碰撞或触底
          //这里会报 xxx of undefined 因为方块走到上面的时候变形，可能会超过边界，所以在初始化方块时最好时往下一层
          if(this.initPos.some(block=>!this.baseMap[block.y])||(this.initPos.some(block=>this.baseMap[block.y][block.x]))||this.initPos.some(block=>block.y>20||(block.x<0||block.x>9))){
            //修正
            this.initPos[0].y += 1
            // this.initPos[0].x -= 1
            // this.initPos[1].y = this.initPos[1].y
            this.initPos[1].x += 1
            this.initPos[2].y -= 1
            // this.initPos[2].x += 1
            this.initPos[3].y -= 2
            this.initPos[3].x += 1
            //重新渲染，并且不用抹除
            this.render()
            //直接结束本次变形，不改变方块状态
            return
          }else{
            this.render()
            //改变方块状态
            this.squareState++
            return
          }

        }
        if (this.squareState === 2) {
          this.clear()
          this.initPos[0].y += 1
          // this.initPos[0].x -= 1
          // this.initPos[1].y = this.initPos[1].y
          this.initPos[1].x += 1
          this.initPos[2].y -= 1
          // this.initPos[2].x += 1
          this.initPos[3].y -= 2
          this.initPos[3].x += 1
          if(this.initPos.some(block=>!this.baseMap[block.y])||(this.initPos.some(block=>this.baseMap[block.y][block.x]))||this.initPos.some(block=>block.y>20||(block.x<0||block.x>9))){
            this.initPos[0].y -= 1
            // this.initPos[0].x += 1
            // this.initPos[1].y = this.initPos[1].y
            this.initPos[1].x -= 1
            this.initPos[2].y += 1
            // this.initPos[2].x -= 1
            this.initPos[3].y += 2
            this.initPos[3].x -= 1
            this.render()
            return
          }else{
            this.squareState--
            this.render()
            return
          }

        }
      }
      if(this.initPos&&e.key==='ArrowLeft'){
        this.clear()
        this.initPos[0].x -= 1
        this.initPos[1].x -= 1
        this.initPos[2].x -= 1
        this.initPos[3].x -= 1
        //变形前判断变形后是否会碰撞或触底
        //这里会报 xxx of undefined 因为方块走到上面的时候变形，可能会超过边界，所以在初始化方块时最好时往下一层
        if(this.initPos.some(block=>!this.baseMap[block.y])||(this.initPos.some(block=>this.baseMap[block.y][block.x]))||this.initPos.some(block=>block.y>20||(block.x<0||block.x>9))){
          //修正
          this.initPos[0].x += 1
          this.initPos[1].x += 1
          this.initPos[2].x += 1
          this.initPos[3].x += 1
          //重新渲染，并且不用抹除
          this.render()
          //直接结束本次变形，不改变方块状态
          return
        }else{
          this.render()
          return
        }
      }
      if(this.initPos&&e.key==='ArrowRight'){
        this.clear()
        this.initPos[0].x += 1
        this.initPos[1].x += 1
        this.initPos[2].x += 1
        this.initPos[3].x += 1
        //变形前判断变形后是否会碰撞或触底
        //这里会报 xxx of undefined 因为方块走到上面的时候变形，可能会超过边界，所以在初始化方块时最好时往下一层
        if(this.initPos.some(block=>!this.baseMap[block.y])||(this.initPos.some(block=>this.baseMap[block.y][block.x]))||this.initPos.some(block=>block.y>20||(block.x<0||block.x>9))){
          //修正
          this.initPos[0].x -= 1
          this.initPos[1].x -= 1
          this.initPos[2].x -= 1
          this.initPos[3].x -= 1
          //重新渲染，并且不用抹除
          this.render()
          //直接结束本次变形，不改变方块状态
          return
        }else{
          this.render()
          return
        }
      }
    },
    transform7(e) {
      if(this.initPos&&e.key==='ArrowUp'){
        //判断方块处于何种状态
        if (this.squareState === 1) {
          this.clear()
          // this.initPos[0].y -= 1
          this.initPos[0].x += 2
          this.initPos[1].y += 1
          this.initPos[1].x += 1
          // this.initPos[2].y += 1
          // this.initPos[2].x -= 1
          this.initPos[3].y += 1
          this.initPos[3].x -= 1
          //变形前判断变形后是否会碰撞或触底
          //这里会报 xxx of undefined 因为方块走到上面的时候变形，可能会超过边界，所以在初始化方块时最好时往下一层
          if(this.initPos.some(block=>!this.baseMap[block.y])||(this.initPos.some(block=>this.baseMap[block.y][block.x]))||this.initPos.some(block=>block.y>20||(block.x<0||block.x>9))){
            //修正
            // this.initPos[0].y += 1
            this.initPos[0].x -= 2
            this.initPos[1].y -= 1
            this.initPos[1].x -= 1
            // this.initPos[2].y -= 1
            // this.initPos[2].x += 1
            this.initPos[3].y -= 1
            this.initPos[3].x += 1
            //重新渲染，并且不用抹除
            this.render()
            //直接结束本次变形，不改变方块状态
            return
          }else{
            this.render()
            //改变方块状态
            this.squareState++
            return
          }

        }
        if (this.squareState === 2) {
          this.clear()
          // this.initPos[0].y += 1
          this.initPos[0].x -= 2
          this.initPos[1].y -= 1
          this.initPos[1].x -= 1
          // this.initPos[2].y -= 1
          // this.initPos[2].x += 1
          this.initPos[3].y -= 1
          this.initPos[3].x += 1
          if(this.initPos.some(block=>!this.baseMap[block.y])||(this.initPos.some(block=>this.baseMap[block.y][block.x]))||this.initPos.some(block=>block.y>20||(block.x<0||block.x>9))){
            // this.initPos[0].y -= 1
            this.initPos[0].x += 2
            this.initPos[1].y += 1
            this.initPos[1].x += 1
            // this.initPos[2].y += 1
            // this.initPos[2].x -= 1
            this.initPos[3].y += 1
            this.initPos[3].x -= 1
            this.render()
            return
          }else{
            this.squareState--
            this.render()
            return
          }

        }
      }
      if(this.initPos&&e.key==='ArrowLeft'){
        this.clear()
        this.initPos[0].x -= 1
        this.initPos[1].x -= 1
        this.initPos[2].x -= 1
        this.initPos[3].x -= 1
        //变形前判断变形后是否会碰撞或触底
        //这里会报 xxx of undefined 因为方块走到上面的时候变形，可能会超过边界，所以在初始化方块时最好时往下一层
        if(this.initPos.some(block=>!this.baseMap[block.y])||(this.initPos.some(block=>this.baseMap[block.y][block.x]))||this.initPos.some(block=>block.y>20||(block.x<0||block.x>9))){
          //修正
          this.initPos[0].x += 1
          this.initPos[1].x += 1
          this.initPos[2].x += 1
          this.initPos[3].x += 1
          //重新渲染，并且不用抹除
          this.render()
          //直接结束本次变形，不改变方块状态
          return
        }else{
          this.render()
          return
        }
      }
      if(this.initPos&&e.key==='ArrowRight'){
        this.clear()
        this.initPos[0].x += 1
        this.initPos[1].x += 1
        this.initPos[2].x += 1
        this.initPos[3].x += 1
        //变形前判断变形后是否会碰撞或触底
        //这里会报 xxx of undefined 因为方块走到上面的时候变形，可能会超过边界，所以在初始化方块时最好时往下一层
        if(this.initPos.some(block=>!this.baseMap[block.y])||(this.initPos.some(block=>this.baseMap[block.y][block.x]))||this.initPos.some(block=>block.y>20||(block.x<0||block.x>9))){
          //修正
          this.initPos[0].x -= 1
          this.initPos[1].x -= 1
          this.initPos[2].x -= 1
          this.initPos[3].x -= 1
          //重新渲染，并且不用抹除
          this.render()
          //直接结束本次变形，不改变方块状态
          return
        }else{
          this.render()
          return
        }
      }
      if(this.initPos&&e.key==='ArrowDown'){
        clearInterval(this.timeOutId)
        this.fall(30)
      }
      if(this.initPos&&e.key==='Space'){}
    },
    keyEvent(e){
      switch (this.currentSquare) {
        case 'square1':this.transform1(e)
          break
        case 'square2':this.transform2(e)
          break
        case 'square3':this.transform3(e)
          break
        case 'square4':this.transform4(e)
          break
        case 'square5':this.transform5(e)
          break
        case 'square6':this.transform6(e)
          break
        case 'square7':this.transform7(e)
          break
      }
    },
    render() {
      //遍历方块数组的坐标对象，并渲染地图
      this.initPos.forEach((block => {
        this.$set(this.baseMap[block.y], block.x, 1)
      }))
      //渲染完成后，把该坐标存到上次移动坐标的数组里，在下落的函数里抹除
      this.lastPos = this.initPos.map(block => ({x: block.x, y: block.y}))
    },
    clear() {
      //先判断是否存在上一次移动的位置，否则会报错
      if (this.lastPos!=null) {
        this.lastPos.forEach((block => {
            //抹除
            this.$set(this.baseMap[block.y], block.x, 0)

        }))
        //清除上一次的坐标
        this.lastPos = null
      }
    },
    fall(delay=300) {
      //设置定时器
      this.timeOutId = setInterval(() => {
        //渲染之前先抹除上一次移动的坐标
        this.clear()
        //遍历方块实时坐标,并给每个小单元y坐标+1
        this.initPos.forEach((block => {
        block.y += 1
        }))
        //判断是否碰撞或者触底
        //1. this.initPos.some(block=>!this.baseMap[block.y]) 判断实时位置的单元坐标y轴是否不存在,防止xxx of und...
        //2. this.initPos.some(block=>this.baseMap[block.y][block.x]) 判断实时位置单元坐标是否存在其他方块单元
        //3. this.initPos.some(block=>block.y>20||(block.x<0||block.x>9)) 判断实时位置单元坐标x,y轴是否越界
        if(this.initPos.some(block=>!this.baseMap[block.y])||(this.initPos.some(block=>this.baseMap[block.y][block.x]))||this.initPos.some(block=>block.y>20||(block.x<0||block.x>9))){
          this.initPos.forEach((block => {
            //修正
            block.y -= 1
          }))
          //重新渲染
          this.render()
          //结束下降
          clearInterval(this.timeOutId)
          //把用来抹除的数组清零,避免已经落下的方块被抹除
          this.lastPos.length =0
          //设置flag并监听flag,判断isgameover?游戏结束即flag就是下落的方块数,
          // 游戏没有结束继续加flag,flag变动就自动调用square方法
          this.flag = this.isGameOver()? this.flag:++this.flag
          this.isClear()
          this.score = (this.flag-1)*10+this.clearCount*100
          //
          return
        }else{
          //否则直接渲染
          this.render()
        }

      }, delay)
    },
    isClear(){
      let tempCol = this.baseMap.findIndex(col=>col.every(block=>block===1))
      if(tempCol!=-1){
        this.clearCount++
        console.log(tempCol)
        this.baseMap.splice(tempCol,1)
        this.baseMap.unshift(new Array(10).fill(0))
        this.isClear()
      }
    },
    isGameOver(){
      //col.some只要一列里有一个1就返回真,baseMap.every只要每一行都有1就返回真
      //条件满足游戏结束
      if(this.baseMap.every((col)=>col.some((block)=>block===1))){
        return true
      }
    },
    square() {
      this.squareState = 1
      this.currentSquare = 'square'+Math.floor(Math.random()*7+1)
      // console.log(num)
      //this.currentSquare = 'square7'
      this.initPos = this[this.currentSquare].map((block)=>({x:block.x,y:block.y}))
      // console.log(this.currentSquare)
      this.fall()
    }

  },
  computed:{

  },
  watch:{
    flag:'square',
  },
  created(){
    this.square()
    document.onkeydown = this.keyEvent
  }

})

