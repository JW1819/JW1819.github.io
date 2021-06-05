  // 初始化游戏基本信息
  const fiveChess = [ // 棋子信息
    { name: '黑子', color: '#111' },
    { name: '白子', color: '#eee' }
  ]; 
  var chessColor = 0;  // 黑子先行, 0为黑，1为白
  var chessRec = []; // 下棋路径记录
  var isOver = false; // 游戏是否结束
  var chessX = 0;
  var chessY = 0;
  // 悔棋和撤销的按钮开关, 1的时候可以悔棋，0的时候可以撤销 3的时候，两者都不可以用
  let isUse = 3 

  // 棋盘， 棋盘到父元素左边的距离
  const chessBox = document.querySelector('#chess')
  const chessBoxLeft = chess.offsetLeft;
  const chessBoxTop = chess.offsetTop;


  // 生成棋盘
  function setBoard() {
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < 196; i++) {
      let div = document.createElement('div');
      div.className = 'chessboard'
      fragment.appendChild(div);
    }
    chessBox.appendChild(fragment);
  }
  setBoard();

  // 生成棋子
  function setChess(x,y) {
    // 设置棋子颜色
    chess = document.createElement('div');
    if (chessColor == 0){
      chess.className = "blackChess"
    } else {
      chess.className = "whiteChess"
    }
    // 添加给棋盘，并设置偏移量
    chessBox.appendChild(chess);
    chess.style.left = 30*x + "px";
    chess.style.top = 30*y + "px";
  }

  chessBox.onclick  = function(e) {
    // 判断是否结束
    if (isOver) {
      alert(`胜负已分，请重新开始游戏！`);
      return;
    }

    var i=e.clientX-chessBoxLeft;
    var j=e.clientY-chessBoxTop;

    var x=Math.round(i/30);
    var y=Math.round(j/30);
    chessX = x;
    chessY = y;
    console.log(x+'+'+y);

    if (x*y > 0 && x < 16 && y< 16 && !chessRec.includes(x + '-' + y)) {
      // 控制在棋盘内，且在没有落过棋子的空位上，才可以落子
      chessRec.push(x + '-' + y) // 保存下棋记录
      setChess(x, y)
      checkWin(x,y,chessColor)
      chessColor = chessColor^1  // 切换棋子颜色
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
      chessBox.removeChild(chessBox.lastChild) //消除棋子
      chessRec.pop();
      chessColor = chessColor^1  // 切换棋子颜色
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
      setChess(chessX, chessY) // 恢复棋子
      chessRec.push(chessX + '-' + chessY) // 保存下棋记录
      // console.log(chessRec);
      chessColor = chessColor^1  // 切换棋子颜色
      isUse = 1;  // 关闭撤销，开启悔棋
      retract.classList.add("disabled")
      regret.classList.remove("disabled")
    }
  }
