(function(){
	var fixedNavbar = document.getElementById("fixed");
	var staticNavbar = document.getElementById("static");
	var y = staticNavbar.offsetTop + staticNavbar.offsetHeight;
	var positionY = 0;
	var timer = setInterval(function(){
		positionY +=1;
		if(positionY<=staticNavbar.offsetTop){
			window.scrollTo(0,positionY);
		}else{
			clearInterval(timer);
		}
	},2)
	var show = function(){
		fixedNavbar.classList.add("active");
	}
	var hide = function(){
		fixedNavbar.classList.remove("active");
	}

	window.addEventListener("scroll",function(){
		if(window.scrollY> y){
			show();
		}else{
			hide();
		}
	})
})()