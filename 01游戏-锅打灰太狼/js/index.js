window.onload = function() {
	//时间
	var timeDiv = getElement("time");
	//开始按钮
	var startButton = getElement("startbtn");
	//结束
	var end = getElement("end");
	//分数
	var fraction = getElement("fraction");
	var restartButton = getElement("restartbtn");
	//暂停
	var pause = getElement("pause");
	//狼
	var wolfsInPit = getElement("wolfsInPit");
	var showWorfsTimer = null;
	var timeWidth = timeDiv.offsetWidth;
	//得分
	var fractionNum = 0;
	//计时器
	var timer = null;

	var lastWorfPit = null;
	var gameState = 0;
	//矿井的位置
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
	//开始游戏
	startButton.onclick = function() {
			//显示暂停按钮
			pause.style.display = "block";
			//隐藏开始按钮
			startButton.style.display = "none";
			//启动计时器：时间计时
			timeDecrease();
			//启动计时器：随机狼
			wolfsComing();
			gameState = 1;
		}
		//计时器   减少时间  结束
	function timeDecrease() {
		timer = setInterval(timdDown, 200);
	}

	function timdDown() {
		//递减进度条宽度
		timeWidth--;
		if(timeWidth < 0) {
			//游戏结束
			gameOver();
		}
		//最后进度条剪完
		timeDiv.style.width = timeWidth + "px";

	}
	//游戏结束
	function gameOver() {
		setTimeout(function() {
			//显示提示框
			end.style.display = "block";
			end.innerHTML = "GAMEOVER<br/>您的得分是" + fractionNum;
			//情况计时器
			clearInterval(timer);
			clearInterval(showWorfsTimer);
			//显示重新开始
			restartButton.style.display = "block";
		}, 1000);

	}

	function wolfsComing() {
		clearInterval(showWorfsTimer);
		//每500毫秒出一头狼
		showWorfsTimer = setInterval(showWorf, 500);
	}

	function showWorf() {
		//得到狼的额div
		var wolf = document.createElement("img");
		//判断：是公还是母的
		wolf.who = rand(0, 100) > 90 ? "x" : "h";
		//加个定位
		wolf.style.position = "absolute";
		wolf.randIndex = rand(0, pitPostions.length);
		//防止同时出现在同一个井
		if(lastWorfPit == pitPostions[wolf.randIndex].l) {
			return;
		}
		//使下一次在相等的话返回
		lastWorfPit = pitPostions[wolf.randIndex].l;
		//随机top和left
		wolf.style.top = pitPostions[wolf.randIndex].t;
		wolf.style.left = pitPostions[wolf.randIndex].l;
		wolfsInPit.appendChild(wolf);
		//升起
		worfPresent(wolf);
		//消失
		worfDismiss(wolf);
		//被打中
		worfAddBitAction(wolf)
	}

	function worfPresent(wolf) {
		wolf.picShowIndex = 0;
		//狼出来50*5 = 250ms  最多出现5只狼
		wolf.worfPresentTimer = setInterval(
			function() {
				wolf.picShowIndex++;
				//图片读取到5
				if(wolf.picShowIndex > 5) {
					clearInterval(wolf.worfPresentTimer);
				} else {
					wolf.src = "img/" + wolf.who + wolf.picShowIndex + ".png";
				}
			}, 50
		);
	}

	function worfDismiss(wolf) {
		wolf.delayTimer = setTimeout(function() {
			//延迟800毫秒下去 狼下去50*5=250ms 一只狼从上来到下去1300ms
			wolf.dismissTimer = setInterval(
				function() {
					//递减是吧图片倒着来一遍，不能小于0
					wolf.picShowIndex--;
					if(wolf.picShowIndex <= 0) {
						clearInterval(wolf.dismissTimer);
						wolfsInPit.removeChild(wolf);
					} else {
						wolf.src = "img/" + wolf.who + wolf.picShowIndex + ".png";

					}
				}, 50);
		}, 800);
	}

	function worfAddBitAction(wolf) {
		//被打后 落下50*5 =250ms： 当用户点击按钮时
		wolf.addEventListener("click", function() {
			//判断得分x还是h，x＋＝10；h－＋10；
			countFraction(wolf.who);
			//暂停其他两个计时器
			clearInterval(wolf.delayTimer);
			clearInterval(wolf.dismissTimer);
			//图片最小值为5
			wolf.picShowIndex = 5;
			//开启
			wolf.bitTimer = setInterval(
				function() {
					wolf.picShowIndex++;
					if(wolf.picShowIndex > 8) {
						wolfsInPit.removeChild(wolf);
						clearInterval(wolf.bitTimer);
					}
					wolf.src = "img/" + wolf.who + wolf.picShowIndex + ".png";

					fraction.innerHTML = fractionNum;
				}, 50);
		});
	}

	function countFraction(who) {
		if(who == "h") {
			fractionNum += 10;
		}
		if(who == "x") {
			fractionNum -= 10;
		}
	}
	//暂停
	pause.onclick = function() {
			//第一次点击暂停
			if(gameState == 1) {
				clearInterval(timer);
				clearInterval(showWorfsTimer);
				gameState = 2;
				//第二次开启
			} else if(gameState == 2) {
				timer = setInterval(timeDecrease, 200);
				showWorfsTimer = setInterval(showWorf, 500);
			}
		}
		//重新开始
	restartButton.onclick = function() {
			//隐藏按钮
			startButton.style.display = "none";
			restartButton.style.display = "none";
			end.style.display = "none";
			//重置得分
			fraction.innerHTML = 0;
			fractionNum = 0;
			//初始化进度条宽度
			timeDiv.style.width = "180px";
			timeWidth = timeDiv.offsetWidth;
			//清空最大的计时器
			clearInterval(timer)
			//开启
			timeDecrease();
			wolfsComing();

		}
		//随机最大值和最小值
	function rand(min, max) {
		return parseInt(Math.random() * (max - min) + min);
	}
	//获取ID
	function getElement(id) {
		return document.getElementById(id);
	}
}