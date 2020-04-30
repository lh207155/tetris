const sound = new Howl({
  src: ['./audio/music.wav'],
  sprite: {
    clear:[0,700],
    fallen:[1300,200],
    trans:[2200,100],
    move:[2900,100],
    start:[3700,3500],
    fail: [8100,1100],
  },
  volume:1
});
Vue.prototype.$sound = sound
var app = new Vue({
  el: '#app',
  data:{
    scale2:'',
    scale:'',
    audioID:null,
    //音效
    audio:true,
    //速度
    speed:1,
    //小恐龙动画的计时器
    timeoutID:'',
    //得分计分板css style
    currentScoreBG:['number00','number00','number00','number00','number00','number0'],
    //最高分计分板css style
    maxScoreBG:['number00','number00','number00','number00','number00','number0'],
    //speed level
    speedLevel:'number1',
    //小恐龙动画脚本
    bgDragon:'',
    //初始化地图 new Array(20).fill(new Array(10).fill(0)):引用出错
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
    //下一个图形的矩阵
    nextSquare:[
      [0,0,0,0],
      [0,0,0,0],
    ],
    //存放一个即将要下落的方块的类型，在下落时会push一个下次要落下的方块，用来显示下一个方块的矩阵
    readySquare:['square' + Math.floor(Math.random() * 7 + 1)],
    //长条
    square1:[{x: 3, y:-1 }, {x: 4, y: -1}, {x: 5, y: -1}, {x: 6, y: -1}],
    //矩形
    square2:[{x:4,y:-1},{x:5,y:-1},{x:4,y:0},{x:5,y:0}],
    //拐1：|_
    square3:[{x:4,y:-1},{x:4,y:0},{x:5,y:0},{x:6,y:0}],
    //拐2  _|
    square4:[{x:4,y:0},{x:5,y:0},{x:6,y:0},{x:6,y:-1}],
    //丁
    square5:[{x:4,y:0},{x:5,y:0},{x:6,y:0},{x:5,y:-1}],
    //反Z
    square6:[{x:4,y:0},{x:5,y:0},{x:5,y:-1},{x:6,y:-1}],
    //正Z
    square7:[{x:4,y:-1},{x:5,y:-1},{x:5,y:0},{x:6,y:0}],
    //用来存放方块的实时位置
    initPos:[],
    //用来存放方块的上一次位移的位置
    lastPos:[],
    //用来记录方块变形的状态
    squareState:1,
    //用来存放当前下落的方块类型
    currentSquare:null,
    //下落方块总数，用来触发继续下落任务和记分
    squareSum : 1,
    //分数
    score:0,
    historyScore:[],
    //清除的行数
    clearCount:0,
    //自然下落定时器ID
    nativeFallingID:null,
    //左右移动定时器ID
    //左右下移动定时器是否正在进行中
    leftMoveID:null,
    leftMoving:false,
    rightMoveID:null,
    rightMoving:false,
    falling:false,
    //暂停标记
    pause:false,
    //刷新中标记
    refreshing:false,
    //游戏中标记
    playing:false,
    //消除停顿标记
    halt:false
  },
  methods: {
    //方块变形方法
    transform1() {
        //判断方块处于何种状态
        if (this.squareState === 1) {
          this.clear()
          this.initPos[0].y -= 1
          this.initPos[0].x += 1
          this.initPos[2].y += 1
          this.initPos[2].x -= 1
          this.initPos[3].y += 2
          this.initPos[3].x -= 2
          //变形前判断变形后是否会碰撞或触底
          if (this.isCollision()) {
            //尝试左右移动，传递一个将要移动的方向和告知函数此次调用是变形移动优化
            if(this.move('l',true)){
              //成功，切换方块状态
              this.squareState++
              //结束此次变形
              return
            }else if(this.move('r',true)){
              this.squareState++
              return
            }else {
              //尝试移动失败，则修正
              this.initPos[0].y += 1
              this.initPos[0].x -= 1
              this.initPos[2].y -= 1
              this.initPos[2].x += 1
              this.initPos[3].y -= 2
              this.initPos[3].x += 2
              //重新渲染，并且不用抹除
              this.render()
              //直接结束本次变形，不改变方块状态
              return
            }
          } else {
            //直接变形成功
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
          this.initPos[2].y -= 1
          this.initPos[2].x += 1
          this.initPos[3].y -= 2
          this.initPos[3].x += 2
          if (this.isCollision()) {
            if(this.move('l',true)){
              this.squareState--
              return
            }else if(this.move('r',true)){
              this.squareState--
              return
            }else {
              this.initPos[0].y -= 1
              this.initPos[0].x += 1
              this.initPos[2].y += 1
              this.initPos[2].x -= 1
              this.initPos[3].y += 2
              this.initPos[3].x -= 2
              this.render()
              return
            }
          } else {
            //一个变形周期，初始化方块状态
            this.squareState--
            this.render()
            return
          }
        }
    },
    //矩形无变形
    transform2() {},
    transform3() {
        if (this.squareState === 1) {
          this.clear()
          this.initPos[0].y -= 1
          this.initPos[0].x += 1
          this.initPos[1].y -= 2
          this.initPos[2].y -= 1
          this.initPos[2].x -= 1
          this.initPos[3].x -= 2
          if (this.isCollision()) {
            if(this.move('l',true)){
              this.squareState++
              return
            }else if(this.move('r',true)){
              this.squareState++
              return
            }else {
              this.initPos[0].y += 1
              this.initPos[0].x -= 1
              this.initPos[1].y += 2
              this.initPos[2].y += 1
              this.initPos[2].x += 1
              this.initPos[3].x += 2
              this.render()
              return
            }
          }
          this.render()
          this.squareState++
          return
        }
        if (this.squareState === 2) {
          this.clear()
          this.initPos[0].y += 1
          this.initPos[0].x += 1
          this.initPos[1].x += 2
          this.initPos[2].y -= 1
          this.initPos[2].x += 1
          this.initPos[3].y -= 2
          if (this.isCollision()) {
            if(this.move('l',true)){
              this.squareState++
              return
            }else if(this.move('r',true)){
              this.squareState++
              return
            }else {
              this.initPos[0].y -= 1
              this.initPos[0].x -= 1
              this.initPos[1].x -= 2
              this.initPos[2].y += 1
              this.initPos[2].x -= 1
              this.initPos[3].y += 2
              this.render()
              return
            }
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
          this.initPos[2].y += 1
          this.initPos[2].x += 1
          this.initPos[3].x += 2
          if (this.isCollision()) {
            if(this.move('l',true)){
              this.squareState++
              return
            }else if(this.move('r',true)){
              this.squareState++
              return
            }else {
              this.initPos[0].y -= 1
              this.initPos[0].x += 1
              this.initPos[1].y -= 2
              this.initPos[2].y -= 1
              this.initPos[2].x -= 1
              this.initPos[3].x -= 2
              this.render()
              return
            }
          }
          this.squareState++
          this.render()
          return
        }
        if (this.squareState === 4) {
          this.clear()
          this.initPos[0].y -= 1
          this.initPos[0].x -= 1
          this.initPos[1].x -= 2
          this.initPos[2].y += 1
          this.initPos[2].x -= 1
          this.initPos[3].y += 2
          if (this.isCollision()) {
            if(this.move('l',true)){
              this.squareState=1
              return
            }else if(this.move('r',true)){
              this.squareState=1
              return
            }else {
              this.initPos[0].y += 1
              this.initPos[0].x += 1
              this.initPos[1].x += 2
              this.initPos[2].y -= 1
              this.initPos[2].x += 1
              this.initPos[3].y -= 2
              this.render()
              return
            }
          }
          this.squareState = 1
          this.render()
          return
        }
    },
    transform4() {
        if (this.squareState === 1) {
          this.clear()
          this.initPos[0].y -= 2
          this.initPos[1].y -= 1
          this.initPos[1].x -= 1
          this.initPos[2].x -= 2
          this.initPos[3].y += 1
          this.initPos[3].x -= 1
          if (this.isCollision()) {
            if(this.move('l',true)){
              this.squareState++
              return
            }else if(this.move('r',true)){
              this.squareState++
              return
            }else {
              this.initPos[0].y += 2
              this.initPos[1].y += 1
              this.initPos[1].x += 1
              this.initPos[2].x += 2
              this.initPos[3].y -= 1
              this.initPos[3].x += 1
              this.render()
              return
            }
          }
          this.render()
          this.squareState++
          return
        }
        if (this.squareState === 2) {
          this.clear()
          this.initPos[0].x += 2
          this.initPos[1].y -= 1
          this.initPos[1].x += 1
          this.initPos[2].y -= 2
          this.initPos[3].y -= 1
          this.initPos[3].x -= 1
          if (this.isCollision()) {
            if(this.move('l',true)){
              this.squareState++
              return
            }else if(this.move('r',true)){
              this.squareState++
              return
            }else {
              this.initPos[0].x -= 2
              this.initPos[1].y += 1
              this.initPos[1].x -= 1
              this.initPos[2].y += 2
              this.initPos[3].y += 1
              this.initPos[3].x += 1
              this.render()
              return
            }
          }
          this.squareState++
          this.render()
          return
        }
        if (this.squareState === 3) {
          this.clear()
          this.initPos[0].y += 2
          this.initPos[1].y += 1
          this.initPos[1].x += 1
          this.initPos[2].x += 2
          this.initPos[3].y -= 1
          this.initPos[3].x += 1
          if (this.isCollision()) {
            if(this.move('l',true)){
              this.squareState++
              return
            }else if(this.move('r',true)){
              this.squareState++
              return
            }else {
              this.initPos[0].y -= 2
              this.initPos[1].y -= 1
              this.initPos[1].x -= 1
              this.initPos[2].x -= 2
              this.initPos[3].y += 1
              this.initPos[3].x -= 1
              this.render()
              return
            }
          }
          this.squareState++
          this.render()
          return
        }
        if (this.squareState === 4) {
          this.clear()
          this.initPos[0].x -= 2
          this.initPos[1].y += 1
          this.initPos[1].x -= 1
          this.initPos[2].y += 2
          this.initPos[3].y += 1
          this.initPos[3].x += 1
          if (this.isCollision()) {
            if(this.move('l',true)){
              this.squareState=1
              return
            }else if(this.move('r',true)){
              this.squareState=1
              return
            }else {
              this.initPos[0].x += 2
              this.initPos[1].y -= 1
              this.initPos[1].x += 1
              this.initPos[2].y -= 2
              this.initPos[3].y -= 1
              this.initPos[3].x -= 1
              this.render()
              return
            }
          }
          this.squareState = 1
          this.render()
          return
        }
    },
    transform5() {
        if (this.squareState === 1) {
          this.clear()
          this.initPos[0].y += 1
          this.initPos[0].x += 1
          if (this.isCollision()) {
            if(this.move('l',true)){
              this.squareState++
              return
            }else if(this.move('r',true)){
              this.squareState++
              return
            }else {
              this.initPos[0].y -= 1
              this.initPos[0].x -= 1
              this.render()
              return
            }
          }
          this.render()
          this.squareState++
          return
        }
        if (this.squareState === 2) {
          this.clear()
          this.initPos[3].y += 1
          this.initPos[3].x -= 1
          if (this.isCollision()) {
            if(this.move('l',true)){
              this.squareState++
              return
            }else if(this.move('r',true)){
              this.squareState++
              return
            }else {
              this.initPos[3].y -= 1
              this.initPos[3].x += 1
              this.render()
              return
            }
          }
          this.squareState++
          this.render()
          return
        }
        if (this.squareState === 3) {
          this.clear()
          this.initPos[2].y -= 1
          this.initPos[2].x -= 1
          if (this.isCollision()) {
            if(this.move('l',true)){
              this.squareState++
              return
            }else if(this.move('r',true)){
              this.squareState++
              return
            }else {
              this.initPos[2].y += 1
              this.initPos[2].x += 1
              this.render()
              return
            }
          }
          this.squareState++
          this.render()
          return
        }
        if (this.squareState === 4) {
          this.clear()
          this.initPos[0].y -= 1
          this.initPos[0].x += 1
          if (this.isCollision()) {
            if(this.move('l',true)){
              this.squareState=1
              return
            }else if(this.move('r',true)){
              this.squareState=1
              return
            }else {
              this.initPos[0].y += 1
              this.initPos[0].x -= 1
              this.render()
              return
            }
          }
          this.squareState = 1
          this.render()
          //不对称单元变换,索引变了,再把索引调回去
          let index = this.initPos[0]
          this.initPos[0] = this.initPos[3]
          this.initPos[3] = this.initPos[2]
          this.initPos[2] = index
          return
        }
    },
    transform6() {
        if (this.squareState === 1) {
          this.clear()
          this.initPos[0].y -= 1
          this.initPos[1].x -= 1
          this.initPos[2].y += 1
          this.initPos[3].y += 2
          this.initPos[3].x -= 1
          if (this.isCollision()) {
            if(this.move('l',true)){
              this.squareState++
              return
            }else if(this.move('r',true)){
              this.squareState++
              return
            }else {
              this.initPos[0].y += 1
              this.initPos[1].x += 1
              this.initPos[2].y -= 1
              this.initPos[3].y -= 2
              this.initPos[3].x += 1
              this.render()
              return
            }
          } else {
            this.render()
            this.squareState++
            return
          }
        }
        if (this.squareState === 2) {
          this.clear()
          this.initPos[0].y += 1
          this.initPos[1].x += 1
          this.initPos[2].y -= 1
          this.initPos[3].y -= 2
          this.initPos[3].x += 1
          if (this.isCollision()) {
            if(this.move('l',true)){
              this.squareState--
              return
            }else if(this.move('r',true)){
              this.squareState--
              return
            }else {
              this.initPos[0].y -= 1
              this.initPos[1].x -= 1
              this.initPos[2].y += 1
              this.initPos[3].y += 2
              this.initPos[3].x -= 1
              this.render()
              return
            }
          } else {
            this.squareState--
            this.render()
            return
          }
        }
      },
    transform7() {
      //判断方块处于何种状态
      if (this.squareState === 1) {
        this.clear()
        this.initPos[0].x += 2
        this.initPos[1].y += 1
        this.initPos[1].x += 1
        this.initPos[3].y += 1
        this.initPos[3].x -= 1
        //变形前判断变形后是否会碰撞或触底
        if (this.isCollision()) {
          //先尝试能否向左或者向右移动一格
          //传递一个方向，并告知函数是否是变形移动优化
          if(this.move('l',true)){
            //成功，切换方块状态并结束此次变形
            this.squareState++
            return
          }else if(this.move('r',true)){
            this.squareState++
            return
          }else{
            //尝试移动失败，则修正
          this.initPos[0].x -= 2
          this.initPos[1].y -= 1
          this.initPos[1].x -= 1
          this.initPos[3].y -= 1
          this.initPos[3].x += 1
          //重新渲染，并且不用抹除
          this.render()
          //直接结束本次变形，不改变方块状态
          return
          }
        } else {
          //变形成功
          this.render()
          //改变方块状态
          this.squareState++
          return
        }
      }
      if (this.squareState === 2) {
        this.clear()
        this.initPos[0].x -= 2
        this.initPos[1].y -= 1
        this.initPos[1].x -= 1
        this.initPos[3].y -= 1
        this.initPos[3].x += 1
        if (this.isCollision()) {
          if(this.move('l',true)){
            this.squareState--
            return
          }else if(this.move('r',true)){
            this.squareState--
            return
          }else{
            this.initPos[0].x += 2
            this.initPos[1].y += 1
            this.initPos[1].x += 1
            this.initPos[3].y += 1
            this.initPos[3].x -= 1
            this.render()
            return
          }
        } else {
          //一个变形周期，初始化方块状态
          this.squareState--
          this.render()
          return
        }
      }
    },
    //碰撞判定
    isCollision() {
      //判断是否碰撞或者触底
      //1. this.initPos.some(block=>!this.baseMap[block.y]) 判断实时位置的单元坐标y轴是否不存在,防止后续判断出现 xxx of undefined
      //2. this.initPos.some(block=>this.baseMap[block.y][block.x]) 判断实时位置单元坐标是否存在其他方块单元
      //3. this.initPos.some(block=>block.y>20||(block.x<0||block.x>9)) 判断实时位置单元坐标x,y轴是否越界
      return (this.initPos.some(block => !this.baseMap[block.y]) || this.initPos.some(block => this.baseMap[block.y][block.x]) || this.initPos.some(block => block.y > 20 || (block.x < 0 || block.x > 9)))
    },
    //设置移动定时器
    move(direction,correction) {
      //判断是不是变形移动优化，避免在这里清除变形的位移，造成不该清除的单元被清除
      correction ? null :this.clear()
      //横轴坐标改变,判断方向
      this.initPos.forEach(block => {
        //根据l或者r尝试给x+1或—1
        direction === 'l' ? block.x -= 1 : direction === 'r' ? block.x += 1 : null
      })
      //判断变形后是否会碰撞或触底
      if (this.isCollision()) {
        //修正
        this.initPos.forEach(block => {
          direction === 'l' ? block.x += 1 : direction === 'r' ? block.x -= 1 : null
        })
        //是否是变形碰撞优化?,若是，就不对此次移动渲染，防止会抹除掉旁边的单元
        //** 因为如果变形优化进入到此判断，会传递进来transform阶段initPos还未修正的值，而实际上还没做出优化动作
        //此时如果渲染transform变形之后的值，会在elseif进入下一个move的时候clear抹除，造成抹除不该抹除的单元
        correction ? null :this.render()
        //变形优化调用时，失败返回false，
        return false
      }else{
        //变形优化调用时，成功，直接渲染，返回true，
        this.render()
        return true
      }
      //  **注意**
      // 在调用move函数时，如果是变形移动的优化调用，要注意clear和render的配合，如果失败，则clear和render都不在此处调用
      //如果成功，则只render一次，clear工作放到后续的处理里，
    },
    //按键按下开启移动
    startMove(e) {
      //避免报错，先判断需要的数据是否存在,是否在暂停，是否在刷新中，是否在消除的停顿中

      if (this.initPos && !this.pause && !this.refreshing&&!this.halt&&this.playing) {
        //这里只需要结束下落定时器，并设置新的下落定时器
        if (e.key === 'ArrowDown') {
          //主动下落，先关掉被动下落定时器，再自行调用并设置参数
          //判断是否正在主动下落中
          if (!this.falling) {
            //音效
            clearInterval(this.audioID)
            this.audioID = setInterval(()=>{
              this.$sound.play('move')
            },50)
            clearInterval(this.nativeFallingID)
            //正在主动下落
            this.falling = true
            //调用下落函数，延时50ms
            this.fall(50)
          }
        }
        //左移动
        if (e.key === 'ArrowLeft') {
          //设置定时器，并传方向参数
          if (!this.leftMoving) {
            //音效
            clearInterval(this.audioID)
            this.audioID = setInterval(()=>{
              this.$sound.play('move')
            },50)
            clearInterval(this.leftMoveID)
            this.leftMoving = true
            //传递一个方向参数'l'
            this.leftMoveID = setInterval(() => {
              this.move('l')
            }, 50)
          }
        }
        if (e.key === 'ArrowRight') {
          if (!this.rightMoving) {
            //音效
            clearInterval(this.audioID)
            this.audioID = setInterval(()=>{
              this.$sound.play('move')
            },50)
            clearInterval(this.rightMoveID)
            this.rightMoving = true
            this.rightMoveID = setInterval(() => {
              this.move('r')
            }, 50)
          }
        }
        if (e.key === ' ') {
          //空格键直接落下
          //不在主动下落中
          if (!this.falling) {
            this.$sound.play('fallen')
            //关闭自然下落
            clearInterval(this.nativeFallingID)
            //参数为0，相当于直接落下
            this.fall(0)
          }
        }
      }
    },
    //按键抬起关闭定时器
    stopMove(e) {
      //按键如果抬起，说明连续的移动已经结束，关闭相应的计时器，并切换状态
      clearInterval(this.audioID)
        if (e.key === 'ArrowLeft') {
          clearInterval(this.leftMoveID)
          this.leftMoving = false
        }
        if (e.key === 'ArrowRight') {
          clearInterval(this.rightMoveID)
          this.rightMoving = false
        }
        //恢复下落速度
        if (e.key === 'ArrowDown') {
          clearInterval(this.nativeFallingID)
          //下键抬起，主动下落结束，关闭标记，并重新调用被动下落
          this.falling = false
          this.fall()
        }
    },
    //为按键抬起事件分配任务
    keyEvent(e) {
      //音效
      if(e.key === 'm'){
        this.audio = !this.audio
        if(this.audio){
          this.$sound._volume=1
        }else{
          this.$sound._volume=0
          this.$sound.stop()
        }
      }
      //重玩键，关闭下落定时器，执行刷新,刷新过程游戏处于refreshing状态
      //r不能在消除停顿，或者正在刷新时启用
      if(e.key === 'r'&&!this.halt&& !this.refreshing){
        //主动r刷新
        //推入此次得分进入历史得分存入本地浏览器localStorage
        let d = localStorage.getItem('historyScore')
        let a = JSON.parse(d)
        a.push(this.score)
        let c = JSON.stringify(a)
        localStorage.setItem('historyScore',c)
        // localStorage.setItem('historyScore',JSON.stringify(JSON.parse(localStorage.getItem('historyScore')).push(this.score)))
        //消除行累计归零
        this.clearCount = 0
        //让方块累计初始化=1
        this.squareSum = 1
        //得分归零
        this.score = 0
        //调用
        this.refresh()
      }
      //游戏未开始，未暂停，未刷新,未停顿，并且按下的是空格键
      if(e.key=== ' '&& !this.refreshing &&!this.pause&&!this.playing&&!this.halt){
        //游戏已开始
        this.playing = true
        this.$sound.play('start')
        //这里先清除掉任何下落的定时器
        clearInterval(this.nativeFallingID)
        //开启游戏
        this.square()
      }
      //判断是否是暂停键，并切换暂停，暂停必须在游戏进行中并且不在刷新中
      if(e.key==='p'&&this.playing&&!this.refreshing){
        this.pause=!this.pause
      }
      //如果抬起向上键，分配各自方块的变形任务
      if (this.initPos && !this.pause&&!this.halt){
        if (e.key === 'ArrowUp'&&this.playing) {
          //判断正在下落的方块类型，调用相应的方块变形任务
          this.$sound.play('trans')
          switch (this.currentSquare) {
            case 'square1':
              this.transform1()
              break
            case 'square2':
              this.transform2()
              break
            case 'square3':
              this.transform3()
              break
            case 'square4':
              this.transform4()
              break
            case 'square5':
              this.transform5()
              break
            case 'square6':
              this.transform6()
              break
            case 'square7':
              this.transform7()
              break
          }
          //否则执行其他的移动停止任务
        } else{
          this.stopMove(e)
        }
      }
      
    },
    render() {
      //遍历方块数组的坐标对象，并渲染地图
      if(this.initPos){
        this.initPos.forEach((block => {
          if(this.baseMap[block.y]){
            //$set显式赋值，避免vue监听不到数组变化
            this.$set(this.baseMap[block.y], block.x, 1)
            //渲染完成后，把该坐标存到上次移动坐标的数组里，准备在clear函数里抹除
            this.lastPos.push({x: block.x, y: block.y})
          }
        }))
        // this.lastPos = this.initPos.map(block => ({x: block.x, y: block.y}))
      }
    },
    clear() {
      //先判断是否存在上一次移动的位置，避免报错 xxx of undefined
      if (this.lastPos.length) {
        this.lastPos.forEach((block => {
          //抹除
          this.$set(this.baseMap[block.y], block.x, 0)
        }))
        //清除上一次的坐标
        this.lastPos = []
      }
    },
    fall(delay = 500-this.speed*50) {
      //设置定时器，默认延时根据速度等级变化
      //先调用一次render，首帧渲染
      this.render()
      this.nativeFallingID = setInterval(() => {
        //不断的判断游戏有没有暂停或者正在消除停顿中，如果是就直接清除定时器并return了
        if(this.pause||this.halt){
          clearInterval(this.nativeFallingID)
          return
        }
        //渲染之前先抹除上一次移动的坐标
        this.clear()
        //遍历方块实时坐标,并给每个小单元y坐标+1
        this.initPos.forEach((block => {
          block.y += 1
        }))
        //下落碰撞判断，会直接固定方块，所以方块固定后需要很多判断
        if (this.isCollision()) {
          this.initPos.forEach((block => {
            //修正
            block.y -= 1
          }))
          //重新渲染
          this.render()
          //结束下降
          clearInterval(this.nativeFallingID)
          //把用来抹除的数组清零,避免已经落下的方块被抹除
          this.lastPos = []
          //判断有无清除行
          let clearScore = this.isClear()
          //计算得分
          //1行100分，2行200分，3行400分，4行800分，固定一个方块5分
          this.score += 5 + clearScore
          //判断游戏有没有结束
          if(this.isGameOver()){
            //游戏结束，playing状态改为false
            this.$sound.play('fail')
            this.playing = false
            //游戏结束，调用刷新
            this.refresh()
            // this.historyScore.push(this.score)
            //把历史得分存入本地浏览器
            let d = localStorage.getItem('historyScore')
            let a = JSON.parse(d)
            a.push(this.score)
            let c = JSON.stringify(a)
            localStorage.setItem('historyScore',c)

            this.clearCount = 0
            this.squareSum = 1
            this.score = 0
          }else{
            //游戏没有结束继续加squareSum,squareSum变动就自动调用square方法继续掉落方块
            //如果是消除行短暂停顿，则不累加方块，防止在停顿是掉落方块发生不期望的错误，把方块累加放到isClear里
            this.halt? null:this.squareSum++
          }
        } else {
          //无触底直接渲染
          this.render()
        }

      }, delay)
    },
    //判断行数组是否存在都为1的情况，即满足消除该行的条件
    isClear() {
      //创建一个临时的数组用来存放需要消除的行的索引
      let tempRow=[]
      //取出每一行判断是不是都是1，如果是就把索引push到临时数组
      this.baseMap.forEach((row,i)=>{
        if(row.every((block)=>block===1)){
           tempRow.push(i)
        }
      })
      console.log(tempRow)
      //存在消除行
      if(tempRow.length){
        this.$sound.play('clear')
        //累计消除的行数
        this.clearCount+=tempRow.length
        //暂时冻结游戏，让游戏停顿
        //这个状态会暂停所有按键事件和下落
        this.halt = true
        //设置定时器
        setTimeout(()=>{
          //遍历临时数组
          tempRow.forEach((i)=>{
            //把该行删除并在第一行添加新行
            this.baseMap.splice(i, 1)
            this.baseMap.unshift(new Array(10).fill(0))
          })
          //延迟1秒消除行特效，并开启游戏
          this.halt = false
          //把方块累加放到了这里
          this.squareSum++
        },1000)
      }
      //返回消除的行数用于算分
      return (tempRow.length===1? 100:tempRow.length===2?200:tempRow.length===3?400:tempRow.length===4?800:0)
      //col.every(block => block === 1)该行都为1，返回真，findIndex找到该行索引
      //存在满足条件的数组
      // if (tempCol != -1) {
      //   //消除行累计
      //   this.clearCount++
      //   this.halt = true
      //   //从地图数组中删除该行数组
      //   // clearInterval(this.nativeFallingID)
      //   setTimeout(()=>{
      //     this.baseMap.splice(tempCol, 1)
      //     //在地图数组中头部添加一个新的数组
      //     this.baseMap.unshift(new Array(10).fill(0))
      //     this.isClear()
      //     this.halt = false
      //     this.squareSum++
      //   },500)
      //   //递归继续判断是否任然存在
      // }
    },
    //判断游戏是否结束
    isGameOver() {
      //col.some只要一列里有一个1就返回真,baseMap.every只要每一行都有1就返回真
      //条件满足游戏结束
      if (this.baseMap.every((col) => col.some((block) => block === 1))) {
        return true
      }
    },
    //初始化方块，并调用下落方法
    square() {
      //设置速度，1级提升50ms的速度
      //初始化方块状态
      this.squareState = 1
      //初始化下一个方块的显示阵列数组
      this.nextSquare = [[0,0,0,0],[0,0,0,0]]
      //1-7随机一个数字拼接push进准备要下落的方块组
      this.readySquare.push('square' + Math.floor(Math.random() * 7 + 1))
      // this.currentSquare = 'square1'
      //初始化即将下落的方块
      //拿到readySquare数组里第一个的名字
      this.currentSquare =this.readySquare[0]
      //找到并赋值到initPos
      this.initPos = this[this.currentSquare].map((block) => ({x: block.x, y: block.y}))
      //赋值下一个方块的显示阵列
      this[this.readySquare[1]].forEach((block)=>{
        this.$set(this.nextSquare[block.y+1],block.x-3,1)
      })
      //调用下落函数
      this.fall()
      //下落后删掉数组里第一个
      this.readySquare.shift()
    },
    //在游戏结束或者重新开始时，执行刷新屏幕特效
    refresh () {
      //这个状态会让其他事件暂停
      this.refreshing = true
      this.initPos =[]
        //promise包裹一个异步执行的操作，从地图数组最后一行开始每50ms执行一次整行的渲染
        new Promise((resolve,reject)=>{
          let i = 19
          let timeout1 = setInterval(()=>{
            for(let j =9;j>=0;j-- ){
              this.$set(this.baseMap[i], j, 1)
            }
            //如果渲染到最上面一行了resolve
            if(i===0){
              //先resolve再关闭定时器,否则下面的then就抢先执行了
              resolve(i)
              clearInterval(timeout1)
            }else{
              //换行
              i--
            }
          },50)
        }).then((i)=> {
          //开始从上往下清除刷新
          return new Promise((resolve)=>{
            let timeout2 = setInterval(()=>{
              for(let j =9;j>=0;j-- ){
              this.$set(this.baseMap[i], j, 0)
              }
              if(i===19){
                //先resolve再关闭定时器,否则下面的then就抢先执行了
                resolve(i)
                clearInterval(timeout2)
              }else{
                i++
              }
          },50)
          })
        }).then((i)=>{
          console.log(i)
          //各种状态的初始化
          this.refreshing = false
          this.playing = false
          this.pause = false
          //得分板初始化
          this.currentScoreBG = ['number00','number00','number00','number00','number00','number0',]
          //调用小恐龙动画
          this.dragonAnimation()
        })
    },
    //小恐龙动画
    dragonAnimation(){
      //每次调用先清除之前的动画定时器和css 的class
      this.bgDragon = ''
      clearInterval(this.timeoutID)
      //如果游戏没有进行
      if(!this.playing){
        //动画执行脚本
        let script = [1,1,1,1,1,1,1,1,2,2,2,2,2,2,1,1,1,1,1,1,1,1,2,2,2,2,2,2,1,1,1,1,1,1,1,1,2,2,2,2,2,2,1,1,1,1,1,1,1,1,
          3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,7,8,7,8,7,8,7,8,7,8,7,8,7,8,7,8,7,8,7,8,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,7,8,7,8,7,8,7,8,7,8,7,8,7,8,7,8,7,8,7,8,
        5,5,5,5,5,5,5,5,6,6,6,6,6,6,5,5,5,5,5,5,5,5,6,6,6,6,6,6,5,5,5,5,5,5,5,5,6,6,6,6,6,6,5,5,5,5,5,5,5,5,
          7,8,7,8,7,8,7,8,7,8,7,8,7,8,7,8,7,8,7,8,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,7,8,7,8,7,8,7,8,7,8,7,8,7,8,7,8,7,8,7,8,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4,3,4]
        let i =0
        this.timeoutID = setInterval(()=>{
          this.bgDragon = `bg-dragon${script[i]}`
          i++
          if(i===script.length){
            i=0
          }
          if(this.playing){
            this.bgDragon = ''
            clearInterval(this.timeoutID)
          }
        },100)
      }
    },
  },
  computed:{
    //计算最高分
    maxScore(){
      return Math.max(0,...JSON.parse(localStorage.getItem('historyScore')))
    },
    timeNumberBG(){
      //时间背景图片
      let time = ['number00','number00','numberP','number00','number00']
      //用来每0.5秒切换小豆豆
      let i = true
      setInterval(()=>{
        let date = new Date()
        //获取时间拼接数组
        let hours = date.getHours()
        let minutes = date.getMinutes()
        // let timeStr = Array.from(date.getHours()+''+date.getMinutes())
        time[0] = `number${Math.floor(hours/10)}`
        time[1] = `number${Math.floor(hours%10)}`
        //切换中间的小豆豆
        time[2] = i?`numberP`:`numberPP`
        time[3] = `number${Math.floor(minutes/10)}`
        time[4] = `number${Math.floor(minutes%10)}`
        i=!i
      },500)
      return time
    }
  },
  watch:{
    clearCount:function(){
        //每消除10行，提升一个速度等级，最大9级
        this.speed = Math.floor(this.clearCount/10)+1>9?9:Math.floor(this.clearCount/10)+1
        this.speedLevel = `number${this.speed}`
    },
    //监听分数变化，
    score:function(){
      //字符串化该分数，并且把它转成一个数组
      let n = Array.from(String(this.score))
      //给currentScoreBG对应赋值，动态添加了CSS
      for(let i = n.length-1, j =5;i>=0;i--,j--){
        this.$set(this.currentScoreBG,j,`number${n[i]}`)
      }
      let m = Array.from(String(Math.max(0,...JSON.parse(localStorage.getItem('historyScore')))))
      for(let i = m.length-1, j =5;i>=0;i--,j--){
        this.$set(this.maxScoreBG,j,`number${m[i]}`)
      }
    },

    //监听游戏是否暂停
    //取消暂停了之后能够自动调用fall
    pause:function () {
      if(!this.pause){
        clearInterval(this.nativeFallingID)
        this.fall()
      }
    },
    //监听squareSum变化，变化即方块已落下，squareSum+1，调用square方法继续下落
    squareSum:function () {
      //this.squareSum!=1防止在刷新的时候因为初始值是1而掉落方块
      if(this.squareSum!=1){
        this.square()
      }
    },
  },
  created(){
    //监听键盘事件
    document.onkeydown = this.startMove
    document.onkeyup = this.keyEvent
    this.dragonAnimation()
    if(!localStorage.historyScore){
      localStorage.setItem('historyScore',JSON.stringify([0]))
    }else{
      let m = Array.from(String(this.maxScore))
      for(let i = m.length-1, j =5;i>=0;i--,j--){
        this.$set(this.maxScoreBG,j,`number${m[i]}`)
      }
    }
  },
  mounted(){
    if(document.body.clientWidth<565){
      this.scale=`transform:scale(${document.body.clientWidth/565});margin-left:-${(565-document.body.clientWidth)/2}px`
      this.scale2=`top:-${(565-document.body.clientWidth)}px`
    }
    document.body.onresize = ()=>{
      if(document.body.clientWidth<565){
        this.scale=`transform:scale(${document.body.clientWidth/565});margin-left:-${(565-document.body.clientWidth)/2}px`
        this.scale2=`top:-${565-document.body.clientWidth}px`
      }
    }
  }
})

