window.onload = function() {
	var timeDiv = document.getElementById("time");
	var startButton = document.getElementById("startbtn");
	var end = document.getElementById("end");
	var fraction = document.getElementById("fraction");
	var restartButton = document.getElementById("restartbtn");
	var pause = document.getElementById("pause");
	var wolfsInPit = document.getElementById("wolfsInPit");

	var showWolfsTimer = null;
	var timeWidth = timeDiv.offsetWidth;
	var fractionNum = 0;
	var timer = null;
	var lastWorfPit = null;
	var gameState = 0;
	var pitPostions = [{
		l: "098px",
		t: "115px"
	}, {
		l: "017px",
		t: "160px"
	}, {
		l: "015px",
		t: "221px"
	}, {
		l: "030px",
		t: "294px"
	}, {
		l: "122px",
		t: "274px"
	}, {
		l: "207px",
		t: "296px"
	}, {
		l: "200px",
		t: "212px"
	}, {
		l: "187px",
		t: "142px"
	}, {
		l: "100px",
		t: "192px"
	}];

	startButton.onclick = function() {
		startButton.style.display = "none";
		pause.style.display = "block";
		timeDecrease();
		wolfsComing();
	}

	function timeDecrease() {
		timer = setInterval(timdDown, 200)
	}

	function timdDown() {
		timeWidth--;
		if(timeWidth < 0) {
			gameOver();
		}
		timeDiv.style.width = timeWidth + "px"
	}
	
	function gameOver(){
		setTimeout(function(){
			end.style.display = "block";
			end.innerHTML = "GAMEOVER<br/>您的得分是" + fractionNum;
			clearInterval(timer);
			clearInterval(showWolfsTimer);
			restartButton.style.display = "block";
		},1000)
	}

	function wolfsComing() {
		showWolfsTimer = setInterval(showWolf, 500);
	}

	function showWolf() {
		var wolf = document.createElement("img")
		wolf.who = rand(0, 100) > 90 ? "x" : "h";
		wolf.style.position = "absolute";
		wolf.randIndex = rand(0, pitPostions.length)
		if(lastWorfPit == pitPostions[wolf.randIndex].l) {
			return;
		}
		lastWorfPit = pitPostions[wolf.randIndex].l;
		wolf.style.top = pitPostions[wolf.randIndex].t;
		wolf.style.left = pitPostions[wolf.randIndex].l;
		wolfsInPit.appendChild(wolf);

		worfPresent(wolf);
		worfDismiss(wolf);
		worfAddBitAction(wolf)
	}

	function worfPresent(wolf) {
		wolf.picShowIndex = 0;
		wolf.worfPresentTimer = setInterval(function() {
			wolf.picShowIndex++;
			if(wolf.picShowIndex > 5) {
				clearInterval(wolf.worfPresentTimer)
			} else {
				wolf.src = "img/" + wolf.who + wolf.picShowIndex + ".png";
			}
		}, 50);
	}

	function worfDismiss(wolf) {
		wolf.delayTimer = setTimeout(function() {
			wolf.worfDismissTimer = setInterval(function() {
				wolf.picShowIndex--;
				if(wolf.picShowIndex < 0) {
					clearInterval(wolf.worfDismissTimer)
					wolfsInPit.removeChild(wolf);
				} else {
					wolf.src = "img/" + wolf.who + wolf.picShowIndex + ".png";
				}
			}, 50);
		}, 800)
	}
	
	function worfAddBitAction(wolf){
		wolf.addEventListener("click",function(){
			countFraction(wolf.who);
			clearInterval(wolf.delayTimer);
			clearInterval(wolf.worfDismissTimer);
			wolf.picShowIndex = 5;
			wolf.bitTimer = setInterval(function(){
				wolf.picShowIndex++
				if(wolf.picShowIndex > 8){
					wolfsInPit.removeChild(wolf);
					clearInterval(wolf.bitTimer);
				}else{
					wolf.src = "img/" + wolf.who + wolf.picShowIndex + ".png";
				}
			},50);
			fraction.innerHTML = fractionNum;
		});
	}
	
	function countFraction(who){
		if(who == "h") {
			fractionNum += 10;
		}
		if(who == "x") {
			fractionNum -= 10;
		}
	}
	
	function rand(min, max) {
		return parseInt(Math.random() * (max - min) + min);
	}

}