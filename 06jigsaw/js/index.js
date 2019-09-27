window.onload = function(){
	// 获取需要使用到的元素
	var oprate = $("oprate");
	var sel = oprate.children[0];
	var btn  = oprate.children[1];
	var imgs = $("imgs");
	var step = oprate.children[2];
	function $(idName){
		return document.getElementById(idName);
	}

	var level,steps = 0;
	var data = [];

	//加载函数
	function load(level){
		level = parseInt(sel.value);
		imgs.innerHTML = (data + "").replace(/(\d+)\D*/g,`<div><img src='img/${level}/$1.jpg' index=$1 /></div>`);//$1表示正则中第一对圆括号内匹配的内容
		if(data.length!=0){
			imgs.children[data.indexOf(Math.pow(level,2))].innerHTML = "";
		}
	}

	//绘图
	function imgsStyle(level){
		imgs.setAttribute("style",`width:${80*level}px;height:${80*level}px;display:block;`);
	}

	//获取样式使用最终值的函数
	function getStyle(ele,attr){
		var res = null;
		if(ele.currentStyle){
			res = ele.currentStyle[attr];
		}else{
			res = window.getComputedStyle(ele,null)[attr];
		}
		return parseFloat(res);
	}

	//随机数据
	function randData(n){
		var randNums = [];
		var max = Math.pow(n,2) - 1;
		while(randNums.length < max){
			var randNum = Math.floor(Math.random()*max) + 1;
			if(randNums.indexOf(randNum) == -1){
				randNums.push(randNum);
			}
		}
		randNums.push(Math.pow(n,2));
		return randNums;
	}

	//拼图完成的正确顺序
	function rightData(level){
		var str = "";
		for(var i=1;i<=Math.pow(level,2);i++){
			str += i;
		}
		return str;
	}
	
	//空白方格和数字交换,每交换一次 记录步数
	function change(nullPos,replacePos){
		data[nullPos] = data[replacePos];
		data[replacePos] = Math.pow(level,2);
		step.innerHTML = ++steps;
		load(level);
	}

	//拼图完成
	function finish(){
		console.log(data)
		if(data.join("") == rightData(level)){
			alert("拼图完成");
			btn.innerHTML = "开始游戏";
			data = [];
			load(level);
			imgs.style.display = "none"
		 
		}
	}

	btn.onclick = function(){
		var that = this;
		steps = 0;
		step.innerHTML = "0";
		that.innerHTML = "重玩";
		level = parseInt(sel.value);
		imgsStyle(level);
		data = randData(level);
		load(level);
		document.onkeyup = function(e){
			var evt = e || window.event;
			var c = evt.keyCode;
			//找到空白方格的位置
			var nullPos = data.indexOf(Math.pow(level,2));
			// if(c >=37 && c<=40) {
			// 	step.innerHTML = ++steps;
			// }
			// 左键37  上38 右39 下40
			switch(true){
				case c == 37:
					var replacePos = nullPos + 1;
					if(nullPos%level == level-1) return;
					change(nullPos,replacePos);		
				break;
				case c == 38: //空格向上走
					var replacePos = nullPos + level;
					if(replacePos > Math.pow(level,2)-1) return;
					change(nullPos,replacePos);		
				break;
				case c == 39:
					var replacePos = nullPos - 1;
					if(nullPos%level == 0) return;
					change(nullPos,replacePos);		
				break;
				case c == 40: //下键
					var replacePos = nullPos - level;
					if(replacePos <0 ) return;
					change(nullPos,replacePos);		
				break;
			}
			finish();
		}
	}

	imgs.onclick = function(e){
		var evt = e || window.event;
		var target = evt.srcElment || evt.target;
		var clickPos = data.indexOf(parseInt(target.getAttribute("index")));
		var nullPos = data.indexOf(Math.pow(level,2));

		//空白方格的位置再最左边：点击上一个数字时，也能实现交换
		var condition1 =  nullPos%level == 0 &&clickPos%level == level
		var condition2 = nullPos%level == level-1 &&clickPos%level == 0

		//交换满足的条件
		var condition = clickPos == nullPos - level ||clickPos == nullPos - 1||clickPos == nullPos + level||clickPos == nullPos + 1
		if(!condition1&&!condition2){
			if(condition){
				data[nullPos] = data[clickPos];
				data[clickPos] = Math.pow(level,2);
				step.innerHTML = ++steps;
				load(data);
			}
		}
		finish();
	}
}