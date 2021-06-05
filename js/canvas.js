
  // 初始化游戏基本信息
  const fiveChess = [ // 棋子信息
    { name: '黑子', color: '#111' },
    { name: '白子', color: '#eee' }
  ]; 
  var chess = 0;  // 黑子先行
  var chessRec = []; // 下棋路径记录
  var isOver = false; // 游戏是否结束
  var chessX = 0;
  var chessY = 0;
  // 悔棋和撤销的按钮开关, 1的时候可以悔棋，0的时候可以撤销 3的时候，两者都不可以用
  let isUse = 3 

  // 获取绘画接口
  const canvas1 = document.querySelector('.ctx1')
  const ctx1 = canvas1.getContext('2d')
  const canvas2 = document.querySelector('.ctx2')
  const ctx2 = canvas2.getContext('2d')


  // 底层画布绘制15*15的棋盘
  function setBoard() {
    for (let i=1; i <= 15; i++) {
      ctx1.beginPath(); // 绘制横线
      ctx1.moveTo(30, 30*i);
      ctx1.lineTo(450, 30*i);
      ctx1.stroke()
      ctx1.beginPath();// 绘制竖线
      ctx1.moveTo(30*i, 30);
      ctx1.lineTo(30*i, 450);
      ctx1.stroke()
    }
    // 绘制五个星位
    ctx1.beginPath();
    ctx1.fillStyle = '#111'
    ctx1.arc(120,120,4,0,2*Math.PI)
    ctx1.fill()
    ctx1.beginPath();
    ctx1.arc(360,120,4,0,2*Math.PI)
    ctx1.fill()
    ctx1.beginPath();
    ctx1.arc(120,360,4,0,2*Math.PI)
    ctx1.fill()
    ctx1.beginPath();
    ctx1.arc(360,360,4,0,2*Math.PI)
    ctx1.fill()
    ctx1.beginPath();
    ctx1.arc(240,240,4,0,2*Math.PI)
    ctx1.fill()
  }
  setBoard()

  // 顶层画布绘制旗子
  function setChess(x,y,c) {
    ctx2.save()
    ctx2.beginPath();
    ctx2.fillStyle = c;
    ctx2.arc(x, y, 12, 0, 2*Math.PI);
    ctx2.fill();
    ctx2.restore();
  }

  // 画布添加点击落子事件
  canvas2.onclick = function(e) {
    if (isOver) {
      window.alert(`胜负已分，请重新开始游戏！`);
      return;
    }
    let x = Math.round(e.offsetX/30);
    let y = Math.round(e.offsetY/30); // 控制落子位置在格点坐标上  
    chessX = x;
    chessY = y;
    if (x*y > 0 && x < 16 && y< 16 && !chessRec.includes(x + '-' + y)) {
      // 控制在棋盘内，且在没有落过棋子的空位上，才可以落子
      chessRec.push(x + '-' + y) // 保存下棋记录
      setChess(x*30, y*30, fiveChess[chess].color)
      console.log(x);
      console.log(y);
      checkWin(x,y,chess)
      chess = chess^1  // 切换棋子颜色
      isUse = 1 // 可以悔棋，不可撤销悔棋
      regret.classList.remove("disabled")
      retract.classList.add("disabled")
    }
  }

  // 获取胜利数组：包含落子纵横、斜向的5-9个获胜棋子的排列数组
  function wins9(x, y) {
    var wins = [ [], [], [], [] ];
    for (let i = -4; i <=4; i++) {
      let rule1 = x + i > 0 && x + i < 16,
        rule2 = y + i > 0 && y + i < 16,
        rule3 = y - i > 0 && y - i < 16;
      if (rule1) wins[0].push(`${x + i}-${y}`);
      if (rule2) wins[1].push(`${x}-${y + i}`);
      if (rule1 && rule2) wins[2].push(`${x + i}-${y + i}`);
      if (rule1 && rule3) wins[3].push(`${x + i}-${y - i}`);
    }
    return wins.filter(arr => arr.length >= 5) // 过滤掉排列棋子少于5的排列
  }

  // 获取5子胜利数组： 从wins9里拆分出5个获胜棋子的排列数组， 存进wins数组
  function wins5(x, y) {
    var wins = []
    wins9(x, y).forEach(arr => {
      for(let i = 0;i < arr.length-4; i++){
        wins.push(arr.slice(i,i+5))
      }
    })
    return wins
  }

  // 判断是否胜利 
  function checkWin(x, y, ch) {
    let chs = chessRec.filter((n,i) => i%2==ch) // 下棋记录中筛选黑，白棋各自的记录
    let isWin = wins5(x,y).some(arr=>arr.every(n=>chs.includes(n))) // wins5中是否存在任一元素：出现在chs的子元素中，即胜利
    if (isWin) {
      setTimeout(() => {  //等待落子完再弹出
        alert(`恭喜${fiveChess[ch].name}胜利`)
        isOver = true
      },100)
    }
  }
  // 新游戏
  const newGame = document.querySelector('.newGame')
  newGame.onclick = function() {
    window.location.reload();
  }

  // 悔棋
  const regret = document.querySelector('.regret')
  regret.onclick = function(){
    if (isUse == 1) {
      ctx2.clearRect(chessX*30-12,chessY*30-12,24,24) //消除棋子
      chessRec.pop();
      chess = chess^1  // 切换棋子颜色
      console.log(chessRec);
      isUse = 0 // 关闭悔棋，开启撤销
      regret.classList.add("disabled")
      retract.classList.remove("disabled")
      isOver = false // 恢复判断是否结束
    }
    return
  }
 
  // 撤销悔棋
  const retract = document.querySelector('.retract')
  retract.onclick = function() {
    if (isUse == 0) {
      setChess(chessX*30, chessY*30, fiveChess[chess].color)
      chessRec.push(chessX + '-' + chessY) // 保存下棋记录
      // console.log(chessRec);
      chess = chess^1  // 切换棋子颜色
      isUse = 1;  // 关闭撤销，开启悔棋
      retract.classList.add("disabled")
      regret.classList.remove("disabled")
    }
  }
