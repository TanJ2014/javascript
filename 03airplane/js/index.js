window.onload = function(){
	//根据元素id获取元素
	function $(idName){
		return document.getElementById(idName);
	}
	function getStyle(ele,attr){
		var res = null;
		if(ele.currentStyle){
			res = ele.currentStyle[attr]
		}else{
			res = window.getComputedStyle(ele,null)[attr];
		}
		return parseFloat(res);
	}
	//获取需要使用到的标签
	var game = $("game")
	, gameStart = $("gameStart")
	, gameEnter = $("gameEnter")
	,myPlane = $("myPlane")
	,bullets = $("bullets")
	,myPlane = $("myPlane")
	,enemys = $("enemys")
	,gameOverPanel = $("gameOverPanel")
	,endScore = $("endScore")
	,goNext = $("goNext")
	,s = $("scores").firstElementChild.firstElementChild;

	//获取游戏界面的宽高
	var gameW = getStyle(game,"width"),
		gameH = getStyle(game,"height");
	//游戏界面的左、上外边距
	var gameML = getStyle(game,"marginLeft"),
		gameMT = getStyle(game,"marginTop");
	//获取己方飞机的宽高
	var myPlaneW = getStyle(myPlane,"width"),
		myPlaneH = getStyle(myPlane,"height");
	//获取子弹的宽高
	var bulletW = 6,
		bulletH = 14;


	//声明要使用的全局变量
	var gameStaus = false; //游戏未开始
	var a = null;//创建子弹的定时器
	var b = null;//创建敌机的定时器
	var c = null;//背景图运动的定时器
	var backgroundPY = 0;//背景图Y轴的值
	var bulletArr = [];//所有子弹元素的集合
	var enemyArr = [];//所有敌机元素的集合
	var scores = 0;//得分
	//开始游戏
	gameStart.firstElementChild.onclick = function(){
		//初始化得分
		scores = 0;
		s.innerHTML = scores;

		gameStart.style.display = "none";
		gameEnter.style.display = "block";
		gameOverPanel.style.display = "none";
		//给当前文档添加键盘事件
		document.onkeyup = function(event){
			var event = event || window.event;
			if(event.keyCode == 32){
				if(!gameStaus){
					//开始游戏
					this.onmousemove = myPlaneMove;
					//实现背景图运动
					bgMove();
					//实现射击
					shot();
					//出现敌机
					appearEnemy();
					//暂停游戏之后的开始
					if(bulletArr.length!=0){
						//子弹继续运动
						reStart(bulletArr,1);
					}
					if(enemyArr.length!=0){
						//敌机继续运动
						reStart(enemyArr,2);
					}
		
					gameStaus = true;
				}else{
					//暂停
					this.onmousemove = null;
					//清楚创建敌机与子弹的定时器
					clearInterval(a);
					clearInterval(b);
					a = null;
					b = null;
					//清除背景图的定时器
					clearInterval(c);
					c = null
					//清除所有子弹和所有敌机的运动定时器
					clear(enemyArr);
					clear(bulletArr);
					gameStaus = false;
				}
			}
		}
	}
	//己方飞机的移动
	function myPlaneMove(evt){
		var e = evt || window.event;
		//获取鼠标的当前位置
		var mouse_x = e.x || e.pageX,
			mouse_y = e.y || e.pageY;

		//计算鼠标移动时，己方飞机的左上边距
		var last_myPlane_left = mouse_x - gameML - myPlaneW/2,
			last_myPlane_top = mouse_y - gameMT - myPlaneH/2;
			//控制飞机不能超出游戏界面
			if(last_myPlane_left<=0){
				last_myPlane_left = 0;
			}else if(last_myPlane_left>=gameW-myPlaneW){
				last_myPlane_left = gameW-myPlaneW;
			}
			if(last_myPlane_top<=0){
				last_myPlane_top = 0;
			}else if(last_myPlane_top>=gameH-myPlaneH){
				last_myPlane_top = gameH-myPlaneH;
			}
			myPlane.style.left = last_myPlane_left +"px";
			myPlane.style.top = last_myPlane_top +"px";
	}

	//单位时间内创建子弹
	function shot(){
		if(a)  return;
		a = setInterval(function(){
			//创建子弹
			creatBullet();
		},100)
	}

	//制造子弹
	function creatBullet(){
		var bullet = new Image(bulletW,bulletH);
		bullet.src = "image/bullet1.png";
		bullet.className = "bullet";
		//确定创建子弹的位置
		var myPlaneL = getStyle(myPlane,"left");
		var myPlaneT = getStyle(myPlane,"top");
		var bulletL = myPlaneL + myPlaneW/2 - bulletW/2;
		var bulletT = myPlaneT - bulletH;
		bullet.style.left = bulletL+"px"
		bullet.style.top = bulletT + "px";

		bullets.appendChild(bullet);
		bulletArr.push(bullet);

		move(bullet,"top")

	}
	//子弹的运动(匀速运动)
	function move(ele,attr){
		var speed = -8;
		ele.timer = setInterval(function(){
			var moveVal = getStyle(ele,attr)
			if(moveVal<= -bulletH){
				clearInterval(ele.timer);
				ele.parentNode.removeChild(ele);
				bulletArr.splice(0,1);
			}else{
				ele.style[attr] = moveVal + speed +"px";

			}
		},10)
	}

	//创建敌机数据对象
	var enemysObj = {
		enemy1:{
			width:34,
			height:24,
			score:100,
			hp:100
		},
		enemy2:{
			width:46,
			height:60,
			score:500,
			hp:800
		},
		enemy3:{
			width:110,
			height:164,
			score:1000,
			hp:1500
		}
	}
	//创建敌机的定时器
	function appearEnemy(){
		if(b) return;
		b = setInterval(function(){
			//创建敌机
			creatEnemy();
			//删除死亡敌机
			delEnemy();
		},1000)
	}

	//创建敌机
	function creatEnemy(){
		//敌机出现概率的数据
		var percentData = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,3];
		//敌机的类型
		var enemyType = percentData[Math.floor(Math.random()*percentData.length)];
		//得到当前随机敌机的数据
		var enemyData = enemysObj["enemy"+enemyType];
		//创建敌机的元素
		var enemy = new Image();
		enemy.src = "image/enemy" + enemyType + ".png";
		enemy.t = enemyType;
		enemy.score = enemyData.score;
		enemy.hp = enemyData.hp;
		//确定敌机出现的位置
		var enemyL = Math.floor(Math.random()*(gameW - enemyData.width + 1));
		var enemyT = -enemyData.height;
		enemy.className = "e";
		enemy.dead = false;//存活的敌机
		enemy.style.left = enemyL + "px";
		enemy.style.top = enemyT + "px";
		enemys.appendChild(enemy);
		enemyArr.push(enemy);
		enemyMove(enemy,"top");
	}
	//敌机的运动
	function enemyMove(ele,attr){
		var speed = null;
		if(ele.t == 1){
			speed = 1.5;
		}else if(ele.t == 2){
			speed = 1;
		}else if(ele.t == 3){
			speed = 0.5;
		}
		ele.timer = setInterval(function(){
			var moveVal = getStyle(ele,attr);
			if(moveVal >= gameH){
				clearInterval(ele.timer);
				enemys.removeChild(ele);
				enemyArr.splice(0,1);
			}else{
				ele.style[attr] = moveVal+speed+"px";
				//每一架敌机运动时，检测和每一颗子弹的碰撞
				danger(ele);
				//检测碰撞
				gameOver();
			}
		},10)
	}
	//清除所有敌机与所有子弹上的定时器
	function clear(childs){
		for(var i=0;i<childs.length;i++){
			clearInterval(childs[i].timer);
		}
	}
	//暂停优秀之后的开始游戏
	function reStart(childs,type){
		for(var i=0;i<childs.length;i++){
			type==1?move(childs[i],"top"):enemyMove(childs[i],"top");
		}
	}
	//开始游戏之后的背景图的运动
	function bgMove(){
		c = setInterval(function(){
			backgroundPY += 0.3;
			if(backgroundPY >= gameH){
				backgroundPY = 0;
			}
			gameEnter.style.backgroundPositionY = backgroundPY+"px";
		},10)
	}
	//检测子弹和敌机的碰撞
	function danger(enemy){
		for(var i=0;i<bulletArr.length;i++){
			//得到子弹的左上边距
			var bulletL = getStyle(bulletArr[i],"left");
			var bulletT = getStyle(bulletArr[i],"top");
			//敌机的左上边距
			var enemyL = getStyle(enemy,"left");
			var enemyT = getStyle(enemy,"top");
			var enemyW = getStyle(enemy,"width");
			var enemyH = getStyle(enemy,"height");
			var condition = bulletL + bulletW >= enemyL && bulletL <= enemyL + enemyW && bulletT <= enemyT + enemyH && bulletT + bulletH >= enemyT;
			if(condition){
				//子弹与敌机碰撞
				//删除子弹
				clearInterval(bulletArr[i].timer);
				bullets.removeChild(bulletArr[i]);
				bulletArr.splice(i,1);
				//子弹与敌机发生碰撞后，敌机血量减少，血量为0，删除敌机
				enemy.hp -= 100;
				if(enemy.hp == 0){
					//删除敌机
					clearInterval(enemy.timer);
					// enemys.removeChild(enemy);
					//替换爆炸图片
					enemy.src = "image/bz"+enemy.t+".gif";
					//标记死亡敌机
					enemy.dead = true;
					scores +=enemy.score;
					s.innerHTML = scores;
				}
			}
		}
	}
	//删除中集合和文档中的死亡敌机
	function delEnemy() {
		for(var i = enemyArr.length-1;i>=0;i--){
			if(enemyArr[i].dead){
				(function(index){
					//从文档中删除死亡敌机元素
					enemys.removeChild(enemyArr[index]);
					//从集合中删除敌机元素
					enemyArr.splice(index,1);
				})(i)
			}
		}
	}
	//飞机碰撞，游戏结束
	function gameOver() {
		for(var i=0;i<enemyArr.length;i++){
			if(!enemyArr[i].dead){
				// 检测碰撞
				// 1、获取敌机的左上边距
				var enemyL = getStyle(enemyArr[i],"left")
				,	enemyT = getStyle(enemyArr[i],"top");;
				// 2、获取敌机的宽高
				var enemyW = getStyle(enemyArr[i],"width")
				,	enemyH = getStyle(enemyArr[i],"height");
				// 3、获取己方飞机的左上边距
				var myPlaneL = getStyle(myPlane,"left")
				,	myPlaneT = getStyle(myPlane,"top");
				var condition = myPlaneL + myPlaneW >= enemyL && myPlaneL <= enemyL + enemyW && myPlaneT <= enemyT + enemyH && myPlaneT + myPlaneH >= enemyT;
				if(condition){ //己方飞机与敌机碰撞
					//清除定时器：创建子弹、飞机、游戏背景图
					clearInterval(a);
					clearInterval(b);
					clearInterval(c);
					a = null;
					b = null;
					c = null;
					//删除 子弹、敌机元素
					remove(bulletArr);
					remove(enemyArr);
					bulletArr = [];
					enemyArr = [];
					//游戏状态false
					gameStaus = false;
					// 清除己方飞机的移动事件
					document.onmousemove = null;
					// 提示得分：
					endScore.innerHTML = scores;
					gameOverPanel.style.display = "block";

				}
			}
		}
	}
	//删除元素
	function remove(childs){
		for(var i=childs.length-1;i>=0;i--){
			childs[i].parentNode.removeChild(childs[i]);
		}
	}
	//游戏结束返回开始页面
	function toStart(){
		endScore.innerHTML = scores;
		gameStart.style.display = "block";
		gameEnter.style.display = "none";
		myPlane.style.left = "127px";
		myPlane.style.top = gameH - myPlaneH + "px";

	}
	goNext.onclick = toStart;
}	