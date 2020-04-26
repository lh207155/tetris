var app = new Vue({
  el: '#app',
  data:{
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
    lastPos:[],
    //用来记录方块变形的状态
    squareState:1,
    //用来存放当前下落的方块类型
    currentSquare:null,
    //下落方块总数，用来触发继续下落任务和记分
    squareSum : 1,
    //分数
    score:0,
    //清除的行数
    clearCount:0,
    //自然下落定时器ID
    timeOutId:null,
    //左右移动定时器ID
    //左右下移动定时器是否正在进行中
    leftMoveID:null,
    leftMoving:false,
    rightMoveID:null,
    rightMoving:false,
    falling:false,
    //暂停标记
    pause:false,
    play:false
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
            //修正
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
          } else {
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
            this.initPos[0].y -= 1
            this.initPos[0].x += 1
            this.initPos[2].y += 1
            this.initPos[2].x -= 1
            this.initPos[3].y += 2
            this.initPos[3].x -= 2
            this.render()
            return
          } else {
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
            this.initPos[0].y += 1
            this.initPos[0].x -= 1
            this.initPos[1].y += 2
            this.initPos[2].y += 1
            this.initPos[2].x += 1
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
          this.initPos[1].x += 2
          this.initPos[2].y -= 1
          this.initPos[2].x += 1
          this.initPos[3].y -= 2
          if (this.isCollision()) {
            this.initPos[0].y -= 1
            this.initPos[0].x -= 1
            this.initPos[1].x -= 2
            this.initPos[2].y += 1
            this.initPos[2].x -= 1
            this.initPos[3].y += 2
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
          this.initPos[2].y += 1
          this.initPos[2].x += 1
          this.initPos[3].x += 2
          if (this.isCollision()) {
            this.initPos[0].y -= 1
            this.initPos[0].x += 1
            this.initPos[1].y -= 2
            this.initPos[2].y -= 1
            this.initPos[2].x -= 1
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
          this.initPos[1].x -= 2
          this.initPos[2].y += 1
          this.initPos[2].x -= 1
          this.initPos[3].y += 2
          if (this.isCollision()) {
            this.initPos[0].y += 1
            this.initPos[0].x += 1
            this.initPos[1].x += 2
            this.initPos[2].y -= 1
            this.initPos[2].x += 1
            this.initPos[3].y -= 2
            this.render()
            return
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
            this.initPos[0].y += 2
            this.initPos[1].y += 1
            this.initPos[1].x += 1
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
          this.initPos[0].x += 2
          this.initPos[1].y -= 1
          this.initPos[1].x += 1
          this.initPos[2].y -= 2
          this.initPos[3].y -= 1
          this.initPos[3].x -= 1
          if (this.isCollision()) {
            this.initPos[0].x -= 2
            this.initPos[1].y += 1
            this.initPos[1].x -= 1
            this.initPos[2].y += 2
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
          this.initPos[1].y += 1
          this.initPos[1].x += 1
          this.initPos[2].x += 2
          this.initPos[3].y -= 1
          this.initPos[3].x += 1
          if (this.isCollision()) {
            this.initPos[0].y -= 2
            this.initPos[1].y -= 1
            this.initPos[1].x -= 1
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
          this.initPos[0].x -= 2
          this.initPos[1].y += 1
          this.initPos[1].x -= 1
          this.initPos[2].y += 2
          this.initPos[3].y += 1
          this.initPos[3].x += 1
          if (this.isCollision()) {
            this.initPos[0].x += 2
            this.initPos[1].y -= 1
            this.initPos[1].x += 1
            this.initPos[2].y -= 2
            this.initPos[3].y -= 1
            this.initPos[3].x -= 1
            this.render()
            return
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
            this.initPos[0].y -= 1
            this.initPos[0].x -= 1
            this.render()
            return
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
          this.initPos[2].y -= 1
          this.initPos[2].x -= 1
          if (this.isCollision()) {
            this.initPos[2].y += 1
            this.initPos[2].x += 1
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
          if (this.isCollision()) {
            this.initPos[0].y += 1
            this.initPos[0].x -= 1
            this.render()
            return
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
        //判断方块处于何种状态
        if (this.squareState === 1) {
          this.clear()
          this.initPos[0].y -= 1
          this.initPos[1].x -= 1
          this.initPos[2].y += 1
          this.initPos[3].y += 2
          this.initPos[3].x -= 1
          //变形前判断变形后是否会碰撞或触底
          if (this.isCollision()) {
            //修正
            this.initPos[0].y += 1
            this.initPos[1].x += 1
            this.initPos[2].y -= 1
            this.initPos[3].y -= 2
            this.initPos[3].x += 1
            //重新渲染，并且不用抹除
            this.render()
            //直接结束本次变形，不改变方块状态
            return
          } else {
            this.render()
            //改变方块状态
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
            this.initPos[0].y -= 1
            this.initPos[1].x -= 1
            this.initPos[2].y += 1
            this.initPos[3].y += 2
            this.initPos[3].x -= 1
            this.render()
            return
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
          //修正
          this.initPos[0].x -= 2
          this.initPos[1].y -= 1
          this.initPos[1].x -= 1
          this.initPos[3].y -= 1
          this.initPos[3].x += 1
          //重新渲染，并且不用抹除
          this.render()
          //直接结束本次变形，不改变方块状态
          return
        } else {
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
          this.initPos[0].x += 2
          this.initPos[1].y += 1
          this.initPos[1].x += 1
          this.initPos[3].y += 1
          this.initPos[3].x -= 1
          this.render()
          return
        } else {
          this.squareState--
          this.render()
          return
        }
      }
    },
    //碰撞判定
    isCollision() {
      //判断是否碰撞或者触底
      //1. this.initPos.some(block=>!this.baseMap[block.y]) 判断实时位置的单元坐标y轴是否不存在,防止xxx of und...
      //2. this.initPos.some(block=>this.baseMap[block.y][block.x]) 判断实时位置单元坐标是否存在其他方块单元
      //3. this.initPos.some(block=>block.y>20||(block.x<0||block.x>9)) 判断实时位置单元坐标x,y轴是否越界
      return (this.initPos.some(block => !this.baseMap[block.y]) || this.initPos.some(block => this.baseMap[block.y][block.x]) || this.initPos.some(block => block.y > 20 || (block.x < 0 || block.x > 9)))
    },
    //设置移动定时器
    move(direction) {
      //惯例移动前抹除
      this.clear()
      //横轴坐标改变,判断方向
      this.initPos.forEach(block => {
        direction === 'l' ? block.x -= 1 : direction === 'r' ? block.x += 1 : null
      })
      //渲染变形前判断变形后是否会碰撞或触底
      if (this.isCollision()) {
        //修正
        this.initPos.forEach(block => {
          direction === 'l' ? block.x += 1 : direction === 'r' ? block.x -= 1 : null
        })
      }
      this.render()
    },
    //按键按下开启移动
    startMove(e) {
      //避免报错，先判断需要的数据是否存在,是否在暂停
      if (this.initPos && !this.pause) {
        //这里只需要结束下落定时器，并设置新的下落定时器
        if (e.key === 'ArrowDown') {
          //主动下落，先关掉被动下落定时器，再自行调用并设置参数
          if (!this.falling) {
            clearInterval(this.timeOutId)
            this.falling = true
            this.fall(50)
          }
        }
        //左移动
        if (e.key === 'ArrowLeft') {
          //设置定时器，并传方向参数
          if (!this.leftMoving) {
            clearInterval(this.leftMoveID)
            this.leftMoving = true
            this.leftMoveID = setInterval(() => {
              this.move('l')
            }, 50)
          }
        }
        if (e.key === 'ArrowRight') {
          if (!this.rightMoving) {
            clearInterval(this.rightMoveID)
            this.rightMoving = true
            this.rightMoveID = setInterval(() => {
              this.move('r')
            }, 50)
          }
        }
        if (e.key === ' ') {
          //空格键直接落下
          if (!this.falling) {
            clearInterval(this.timeOutId)
            this.fall(0)
          }
        }
      }
    },
    //按键抬起关闭定时器
    stopMove(e) {
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
          clearInterval(this.timeOutId)
          this.falling = false
          this.fall()
        }
    },
    //为按键抬起事件分配任务
    keyEvent(e) {
      //判断是否是r重玩键，或者是否游戏未开始，并且按下的是空格键
      if((e.key === 'r')|| (e.key=== ' '&& !this.play)){
        //重置部分参数
        this.play = true
        this.baseMap=[
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
        ]
        this.pause = false
        clearInterval(this.timeOutId)
        //重启游戏
        this.square()
      }
      //判断是否是暂停键，并切换暂停
      if(e.key==='p'){
        this.pause=!this.pause
      }
      //如果抬起向上键，分配各自方块的变形任务
      // console.log(e.key)
      if (this.initPos && !this.pause){
        if (e.key === 'ArrowUp') {
          //判断正在下落的方块类型，调用相应的方块变形任务
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
          //$set显式赋值，避免vue监听不到数组变化
          this.$set(this.baseMap[block.y], block.x, 1)
        }))
        //渲染完成后，把该坐标存到上次移动坐标的数组里，准备在clear函数里抹除
        this.lastPos = this.initPos.map(block => ({x: block.x, y: block.y}))
      }
    },
    clear() {
      //先判断是否存在上一次移动的位置，避免报错 xxx of undefined
      if (this.lastPos!=null) {
        this.lastPos.forEach((block => {
          //抹除
          this.$set(this.baseMap[block.y], block.x, 0)
        }))
        //清除上一次的坐标
        //length为0也可以遍历，所以这里让他等于null
        this.lastPos = null
      }
    },
    fall(delay = 500) {
      //设置定时器，默认延时300ms
      this.timeOutId = setInterval(() => {
        //判断游戏有没有暂停
        if(this.pause){
          clearInterval(this.timeOutId)
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
          clearInterval(this.timeOutId)
          //把用来抹除的数组清零,避免已经落下的方块被抹除
          this.lastPos = null
          //设置squareSum并监听squareSum,判断isgameover?游戏结束即squareSum就是下落的方块数,
          // 游戏没有结束继续加squareSum,squareSum变动就自动调用square方法
          this.squareSum = this.isGameOver() ? this.squareSum : ++this.squareSum
          this.play = this.isGameOver() ? false : true
          //判断有无清除行
          this.isClear()
          //计算得分
          this.score = (this.squareSum - 1) * 10 + this.clearCount * 100
        } else {
          //无触底直接渲染
          this.render()
        }

      }, delay)
    },
    //判断行数组是否存在都为1的情况，即满足消除该行的条件
    isClear() {
      //col.every(block => block === 1)该行都为1，返回真，findIndex找到该行索引
      let tempCol = this.baseMap.findIndex(col => col.every(block => block === 1))
      //存在满足条件的数组
      if (tempCol != -1) {
        //消除行累计
        this.clearCount++
        //从地图数组中删除该行数组
        this.baseMap.splice(tempCol, 1)
        //在地图数组中头部添加一个新的数组
        this.baseMap.unshift(new Array(10).fill(0))
        //递归继续判断是否任然存在
        this.isClear()
      }
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
      //初始化方块状态
      this.squareState = 1
      //1-7随机一个数字给当前方块
      this.currentSquare = 'square' + Math.floor(Math.random() * 7 + 1)
      console.log(this.currentSquare)
      // this.currentSquare = 'square7'
      //初始化即将下落的方块
      this.initPos = this[this.currentSquare].map((block) => ({x: block.x, y: block.y}))
      // console.log(this.currentSquare)
      //调用下落函数
      this.fall()
    }
  },
  computed:{

  },
  watch:{
    //监听squareSum变化，变化即方块已落下，squareSum+1，则调用square方法继续下落
    pause:function () {
      if(!this.pause){
        clearInterval(this.timeOutId)
        this.fall()
      }
    },
    squareSum:'square',
  },
  created(){
    this.play ? this.square() : null
    document.onkeydown = this.startMove
    document.onkeyup = this.keyEvent
    // document.onkeypress = this.keyEvent
    // document.onkeydown = (e)=>{
    //   console.log(e)
    //   if(e.keyCode === 82 ){
    //     clearInterval(this.timeOutId)
    //     this.initPos = []
    //     this.lastPos = []
    //     this.baseMap = [
    //       [0,0,0,0,0,0,0,0,0,0],
    //       [0,0,0,0,0,0,0,0,0,0],
    //       [0,0,0,0,0,0,0,0,0,0],
    //       [0,0,0,0,0,0,0,0,0,0],
    //       [0,0,0,0,0,0,0,0,0,0],
    //       [0,0,0,0,0,0,0,0,0,0],
    //       [0,0,0,0,0,0,0,0,0,0],
    //       [0,0,0,0,0,0,0,0,0,0],
    //       [0,0,0,0,0,0,0,0,0,0],
    //       [0,0,0,0,0,0,0,0,0,0],
    //       [0,0,0,0,0,0,0,0,0,0],
    //       [0,0,0,0,0,0,0,0,0,0],
    //       [0,0,0,0,0,0,0,0,0,0],
    //       [0,0,0,0,0,0,0,0,0,0],
    //       [0,0,0,0,0,0,0,0,0,0],
    //       [0,0,0,0,0,0,0,0,0,0],
    //       [0,0,0,0,0,0,0,0,0,0],
    //       [0,0,0,0,0,0,0,0,0,0],
    //       [0,0,0,0,0,0,0,0,0,0],
    //       [0,0,0,0,0,0,0,0,0,0],
    //     ]
    //     this.square()
    //   }
    // }
  }
})

