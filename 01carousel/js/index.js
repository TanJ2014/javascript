var items = document.getElementsByClassName("item");
var list = document.getElementsByClassName("list")[0];
var container = document.getElementsByClassName("container")[0];

//解决移动端图片宽度问题
for(var i=0;i<items.length;i++){
	items[i].style.width = window.innerWidth + "px";
}
list.style.width = items.length*window.innerWidth +"px";

//index 当前是第几张在轮播
var state = {
	beginX:0,
	endX:0,
	nowX:0,
	index:0
}

//创建小点
var _createPoint = function(){
	var point = document.createElement("ul");
	point.setAttribute("class","point");
	for(var i=0;i<items.length;i++){
		var item = document.createElement("li");
		item.setAttribute("class","point-item");
		//给第一张图片active
		if(i==0){
			item.classList.add("active");
		}
		point.appendChild(item);
	}
	container.appendChild(point);
}
_createPoint();

//根据index切换小圆点的类名
var _setIndex = function(){
	var index = state.index;
	var pointItems = document.getElementsByClassName("point-item");
	for(var i=0;i<items.length;i++){
		pointItems[i].classList.remove("active");
	}
	pointItems[index].classList.add("active");
}

//跟手
var _slice = function(){
	var deltaX = state.nowX - state.beginX;
	list.style.marginLeft = -(window.innerWidth * state.index)+deltaX +"px";
}

var _reset = function(){
	//需要一个过渡，让复位效果更自然
	list.style.transition = "all .3s"
	list.style.marginLeft = -state.index * window.innerWidth+"px";
}

var _goPrev = function(){
	if(state.index > 0){
		state.index --;
		list.style.transition = "all .3s"
		list.style.marginLeft = -state.index *  window.innerWidth+"px";
	}else{
		//复位
		_reset();
	}
}

var _goNext = function(){
	if(state.index < items.length - 1){
		state.index ++;
		list.style.transition = "all .3s"
		list.style.marginLeft = -state.index *  window.innerWidth+"px"
	}else{
		//复位
		_reset();
	}
}

var _judgeMove = function(){
	var deltaX = state.beginX - state.endX;
	if(deltaX >= window.innerWidth*2/5){
		//下一张
		_goNext();
		_setIndex();
		console.log("下一张");
	}else if(deltaX <= -window.innerWidth*2/5){
		//上一张
		_goPrev();
		_setIndex();
		console.log("上一张");
	}else{
		//不动
		_reset();
		console.log("不动");
	}

}

container.addEventListener('touchstart',function(e){
	//去除过渡，获得良好的跟手效果
	list.style.transition = "none";
	state.beginX = e.targetTouches[0].clientX;
})

container.addEventListener('touchmove',function(e){
	state.nowX = e.changedTouches[0].clientX
	// var deltaX = state.beginX - state.nowX;
	// list.style.marginLeft = -deltaX +"px";
	_slice();
})

container.addEventListener('touchend',function(e){
	//记录endX
	state.endX = e.changedTouches[0].clientX;
	_judgeMove();
})