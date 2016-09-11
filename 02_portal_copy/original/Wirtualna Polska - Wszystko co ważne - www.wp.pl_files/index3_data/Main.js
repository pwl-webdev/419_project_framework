(function(w) {

	var mainClass = {};
	var hitArea;
	var rrsoBtn;
	var rrso;
	var rrsoVisible = false;
	var tl = new TimelineLite();
	var arrAnim;
	var video;
	var playPause;
	var volumePause;
	var isPlaying = false;
	var canplay = false;
	var ended	= false;
	var points = [0,0.01,8+2/25,21+7/25,28+10/25]

	function initCheckBtn(){
		arrAnim = TweenLite.to("#arrow",0.4,{x:4,onComplete:function(){
			arrAnim = TweenLite.to("#arrow",0.4,{x:0,onComplete:initCheckBtn,onCompleteScope:this,ease:Quad.easeIn})
		},onCompleteScope:this});
	}


	function initVideo(){
		video = document.getElementById("video");


		var volumeOnOff = document.getElementById('volBtn');
		var mainBtn  = document.getElementById('mainBtn');

		video.muted = true;
		video.addEventListener("ended",videoEnd);
		video.addEventListener("canplay",videoCanPlay);
		video.addEventListener("timeupdate", timeUpdateHandler.bind(this))

		volumeOnOff.addEventListener('click',volumeHandler);
		updateBtns();

	}

	function mainHandler(){
		video.pause();
		video.currentTime = 0;
		video.play();
		video.muted = false;
		isPlaying = true;
		updateBtns();

		TweenLite.to("#mainBtn",0.4,{autoAlpha:0});

	}

	function timeUpdateHandler(e){
		TweenLite.to(this,2,{progress:video.currentTime/video.duration,ease:Linear.easeIn,onUpdate:function(){
																																										tl.progress( progress)
																																												}})
	}

	function volumeHandler(){
		video.muted = !video.muted;
		updateBtns();
	}

	function playPauseHandler(){


		if(isPlaying){
			video.pause();
		}else{
			if(ended) {
				video.currentTime = 0;
				ended = false;
			}
			video.play();
		}

		isPlaying = !isPlaying;

		updateBtns();
	}

	function updateBtns(){
		if(video.muted){
			document.getElementById('muted').style.visibility = 'visible';
			document.getElementById('unmuted').style.visibility = 'hidden';
		}else{
			document.getElementById('unmuted').style.visibility = 'visible';
			document.getElementById('muted').style.visibility = 'hidden';

		}
	}

	function initHit(){
			document.addEventListener("click" ,clickHandler.bind(this))
	}

	function onClose(){
		TweenLite.to("#controls",0.5,{y:100,ease:Quad.easeIn})
		TweenLite.to("#claim",0.5,{y:-100,ease:Quad.easeIn})
		TweenLite.to("#volBtn",0.5,{y:100,ease:Quad.easeIn})
		document.getElementById('last').style.visibility = 'visible';
		TweenLite.from("#last",1,{autoAlpha:0,ease:Quad.easeOut})
	}

	function videoEnd(){
		ended = true;
		isPlaying = false;
		updateBtns();
		onClose();
	}

	function videoCanPlay(){
		canplay = true;
		if(isPlaying) video.play();
	}


	function playVid(){
		video.currentTime = 0;
		video.play();
		isPlaying = true;

		updateBtns();
	}



	function clickHandler(e){
			var el = e.srcElement || e.target;
			// But if this is the 'play button' don't use the click action.


			for (var i = 0; i < btns.length; i++) {
				if (el === btns[i]) {
					return false;
				}
			}

			clickFn();
		}

	function initControls(){
			btns = [];
		for (var i = 1; i < 5; i++) {
			var btn = document.getElementById("step"+i+"Click")
			btn.time = points[i]
			btn.num = i
			btn.addEventListener("click",timelineHandler.bind(this))
			btn.addEventListener("mouseover",overHandler.bind(this))
			btn.addEventListener("mouseout",outHandler.bind(this))
			btns.push(btn)
		}

		btns.push(document.getElementById("volBtn"))

	}

	function overHandler(e){
		if(points[e.target.num]/video.duration > progress){
			//	TweenLite.to("#step"+e.target.num+"Circ",0.5,{stroke:"#c9282c"})
		}
	}

	function outHandler(e){
		if(points[e.target.num]/video.duration > progress){
			//TweenLite.to("#step"+e.target.num+"Circ",0.5,{stroke:"#ffffff"})
		}
	}

	function timelineHandler(e){
		video.pause()

		TweenLite.killTweensOf(this)
		progress = e.target.time/video.duration
		tl.progress( progress)
		video.currentTime = e.target.time
		video.play()

	}

	function initTl(){

		document.getElementById("controls").style.display = 'block';

		tl.set("#step1",{opacity:0});
		tl.set("#step2",{opacity:0});
		tl.set("#step3",{opacity:0});
		tl.set("#step4",{opacity:0});
		tl.set("#step1Circ",{stroke:"#c9282c"});
		tl.set("#step1",{opacity:1});
		var t1 = points[2]-.2;
		tl.fromTo("#step1Timeline",t1,{drawSVG:"100% 100%"},{drawSVG:"0% 100%",ease:Linear.easeIn})
		tl.fromTo("#step1TimelineW",t1,{drawSVG:"0% 100%"},{drawSVG:"0% 0%",ease:Linear.easeIn},"-="+t1)

		tl.set("#step2Circ",{stroke:"#c9282c"});
		tl.set("#step2",{opacity:1});
		var t2 = points[3]-points[2];
		tl.fromTo("#step2Timeline",t2,{drawSVG:"100% 100%"},{drawSVG:"0% 100%",ease:Linear.easeIn})
		tl.fromTo("#step2TimelineW",t2,{drawSVG:"0% 100%"},{drawSVG:"0% 0%",ease:Linear.easeIn},"-="+t2)

		tl.set("#step3Circ",{stroke:"#c9282c"});
		tl.set("#step3",{opacity:1});
		var t3 = points[4]-points[3];
		tl.fromTo("#step3Timeline",t3,{drawSVG:"100% 100%"},{drawSVG:"0% 100%",ease:Linear.easeIn})
		tl.fromTo("#step3TimelineW",t3,{drawSVG:"0% 100%"},{drawSVG:"0% 0%",ease:Linear.easeIn},"-="+t3)

		tl.set("#step4Circ",{stroke:"#c9282c"});
		tl.set("#step4",{opacity:1});
		var t4 = 38.2 - points[4];
		tl.fromTo("#step4Timeline",t4,{drawSVG:"100% 100%"},{drawSVG:"0% 100%",ease:Linear.easeIn})
		tl.fromTo("#step4TimelineW",t4,{drawSVG:"0% 100%"},{drawSVG:"0% 0%",ease:Linear.easeIn},"-="+t4)
		tl.pause()
	}

	mainClass.init = function() {

			this.progress = 0

			initCheckBtn();
			initTl();
			initVideo();
			initControls();
			initHit();
			playVid();

	};




	w.Main = mainClass
})(window);

window.onload = Main.init;

(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - Math.abs(currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());
