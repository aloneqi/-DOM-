var forever=(function(){

	var flag = "getComputedStyle" in window;

	function listToArray(classAry){
		var ary=[];
		try{
			ary = Array.prototype.slice.call(classAry);
		} catch(e){
			for (var i=0,len=classAry.length; i < len; i++){
					ary[i]=classAry[i];
			}
		}
		return ary
	}

	function formatJSON(jsonStr){
		return "JSON" in window ? JSON.parse(jsonStr) : eval("("+jsonStr+")");
	}

	function offset(selector){
		var leftX=selector.offsetLeft,topY=selector.offsetTop,par=selector.offsetParent;
		while(par){
			if(navigator.userAgent.indexOf("MSIE 8") === -1){
				leftX +=  par.clientLeft;
				topY += par.clientTop;
			}
			leftX += par.offsetLeft;
			topY += par.offsetTop;
			par = par.offsetParent;
		}
		return { left:leftX , top:topY }
	}

	function win(attr,value){
		if(typeof value === "undefined"){
			return document.documentElement[attr] || document.body[attr];
		}
		document.documentElement[attr]=value;
		document.body[attr]=value;
	}

	function children(curEle,tagName){
		var ary=[];
		if(!flag){
			var nodeList=curEle.childNodes;
			for(var i = 0,len = nodeList.length; i < len; i++){
				var curNode=nodeList[i];
				curNode.nodeType === 1 ? ary[ary.length] = curNode : null;
			}
			nodeList=null;
		}else{
			ary=this.listToArray(curEle.children);
		}
		if(typeof tagName === "string"){
			for(var j = 0; j < ary.length; j++){
				var curEleNode = ary[j];
				if(curEleNode.nodeName.toLowerCase() !== tagName.toLowerCase()){
					ary.splice(j,1);
					j--;
				}
			}
		}
		return ary
	}

	function prev(curEle){
		if(flag){
			return curEle.previousElementSibling;
		}else{
			var pre = curEle.previousSibling;
			while( pre && pre.nodeType !== 1 ){
				pre = pre.previousSibling;
			}
			return pre;
		}
	}

	function next(curEle){
		if(flag){
			return curEle.nextElementSibling;
		}else{
			var next = curEle.nextSibling;
			while( next && next.nodeType !== 1 ){
				next = next.nextSibling;
			}
			return next;
		}
	}

	function prevAll(curEle){
		var ary = [];
		var pre = this.prev(curEle);
		while (pre) {
			ary.unshift(pre);
			pre = this.prev(pre);
		}
		return ary
	}

	function nextAll(curEle){
		var ary = [];
		var nex = this.next(curEle);
		while (nex) {
			ary.push(nex);
			nex = this.next(nex);
		}
		return ary
	}

	function sibling(curEle){
		var ary = [], pre = this.prev(curEle), nex = this.next(curEle);
		pre?ary.push(pre):null;
		nex?ary.push(nex):null;
		return ary
	}

	function siblings(curEle){
		return this.prevAll(curEle).concat(this.nextAll(curEle));
	}

	function index(curEle){
		return this.prevAll(curEle).length;
	}

	function firstChild(curEle){
		var first = this.children(curEle);
		return first.length > 0 ? first[0] : null;
	}

	function lastChild(curEle){
		var last = this.children(curEle);
		return last.length > 0 ? last[last.length - 1] : null;
	}

	function append(newEle,container){
		container.appendChild(newEle);
	}

	function prepend(newEle,container){
		var fir = this.firstChild(container);
		if(fir){
			container.insertBefore(newEle,fir);
			return;
		}
		container.appendChild(newEle);
	}
	
	function insertBefore(newEle,oldEle){
		oldEle.parentNode.insertBefore(newEle,oldEle);
	}

	function insertAfter(newEle,oldEle){
		var nex = this.next(oldEle);
		if(nex){
			oldEle.parentNode.insertBefore(newEle,nex);
			return;
		}
		oldEle.parentNode.appendChild(newEle);
	}

	function hasClass(curEle,className){
		var reg = new RegExp("(^| +)"+ className +"( +|$)");
		return reg.test(curEle.className);
	}

	function addClass(curEle,className){
		var ary = className.replace(/(^ +| +$)/g,"").split(/ +/g);
		for (var i = 0,len = ary.length; i < len; i++) {
			if(!this.hasClass(curEle,ary[i])){
				curEle.className += " " + ary[i];
			}
		}	
	}

	function removeClass(curEle,className){
		var ary = className.replace(/(^ +| +$)/g,"").split(/ +/g);
		for (var i = 0,len = ary.length; i < len; i++) {
			if(this.hasClass(curEle,ary[i])){
				var reg = new RegExp("(^| +)"+ ary[i] +"( +|$)");
				curEle.className = curEle.className.replace(reg," ");
			}
		}	
	}

	function getElementsByClass(strClass,context){
		context = context || document;
		if(flag){
			return this.listToArray(context.getElementsByClassName(strClass));
		}else{
			var ary = [],strClassAry = strClass.replace(/(^ +| +$)/g,"").split(/ +/g),
			nodeList = context.getElementsByTagName("*");
			for (var i = 0,len = nodeList.length; i < len ; i++) {
				 var curNode = nodeList[i],isOk = true;

				 for (var j = 0; j < strClassAry.length; j++){

				 	var reg = new RegExp("(^| +)"+strClassAry[j]+"( +|$)");
				 	if(!reg.test(curNode.className)){
				 		isOk = false;
				 		break;
				 	}

				 }
				 
				 if(isOk){
				 	ary[ary.length] = curNode
				 }
			}
			nodeList = null;
			return ary;
		}
	}

	function getCss( attr ){

		var val,reg;

		if(flag){
			val = window.getComputedStyle(this,null)[attr];
		}else{

			if( attr === 'opacity' ){
				val = this.currentStyle['filter'];
				reg = /^alpha\(opacity(?:=|:)(\d+(?:\.\d+)?)\)$/i
				val = reg.test(val) ? reg.exec(val)[1]/100 : 1;
			}else{
				val = this.currentStyle[attr];
			}
			
		}
		reg = /^(-?\d+(\.\d+)?)(px|pt|rem|em)?$/
		return reg.test(val) ? parseFloat(val) : val;
	}

	function setCss( attr ,value ){

		if( attr === "float"){
			this['style']['cssFloat'] = value;
			this['style']['styleFloat'] = value;
			return;
		}

		if ( attr === 'opacity' ) {
			this['style']['opacity'] = value;
			this['style']['filter'] = "alpha(opacity=" + value * 100 + ")";
			return;
		}

		var reg = /^(width|height|top|bottom|left|right|((margin|padding)(Top|Bottom|Left|Right)?))$/;

		if ( reg.test(attr) ) {
			if( !isNaN(value) ){
				value += "px";
			}
		}

		this['style'][attr] = value;

	}

	function setGroupCss( options ){
		if ( {}.toString.call(options) !== "[object Object]" ) return;

		for ( var key in options ){
			if ( options.hasOwnProperty(key) ) {
				setCss.call( this, key ,options[key] );
			}
		}
	}

	function css(curEle){

		var ary = Array.prototype.slice.call(arguments,1);

		if ( typeof arguments[1] === "string") {

			if ( typeof arguments[2] === "undefined" ) {
				return getCss.apply(curEle,ary);
			}

			setCss.apply(curEle,ary);
			return;
		}

		if ( {}.toString.call(arguments[1]) === "[object Object]" ) {
			setGroupCss.apply(curEle,ary)
		}
	}

	return{
		listToArray:listToArray,
		formatJSON:formatJSON,
		offset:offset,
		win:win,
		children:children,
		prev:prev,
		next:next,
		prevAll:prevAll,
		nextAll:nextAll,
		sibling:sibling,
		siblings:siblings,
		index:index,
		firstChild:firstChild,
		lastChild:lastChild,
		append:append,
		prepend:prepend,
		insertBefore:insertBefore,
		insertAfter:insertAfter,
		hasClass:hasClass,
		addClass:addClass,
		removeClass:removeClass,
		getElementsByClass:getElementsByClass,
		css:css
	}
})()



/*
 * Orbit.js
 * t: current time（当前时间）
 * b: beginning value（初始值）
 * c: change in value（变化量）
 * d: duration（持续时间）
 * easeIn：从0开始加速
 * easeOut：减速到0
 * easeInOut：先加速后减速
*/

var Orbit = {
	Linear: function(t, b, c, d) { 
		return c * t / d + b; 
	},
	Quad: { //二次方的运动
        easeIn: function(t, b, c, d) {
            return c * (t /= d) * t + b;
        },
        easeOut: function(t, b, c, d) {
            return -c *(t /= d)*(t-2) + b;
        },
        easeInOut: function(t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t + b;
            return -c / 2 * ((--t) * (t-2) - 1) + b;
        }
    },
    Cubic: { //三次方的运动
        easeIn: function(t, b, c, d) {
            return c * (t /= d) * t * t + b;
        },
        easeOut: function(t, b, c, d) {
            return c * ((t = t/d - 1) * t * t + 1) + b;
        },
        easeInOut: function(t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t*t + b;
            return c / 2*((t -= 2) * t * t + 2) + b;
        }
    },
    Quart: { //四次方的运动
        easeIn: function(t, b, c, d) {
            return c * (t /= d) * t * t*t + b;
        },
        easeOut: function(t, b, c, d) {
            return -c * ((t = t/d - 1) * t * t*t - 1) + b;
        },
        easeInOut: function(t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
            return -c / 2 * ((t -= 2) * t * t*t - 2) + b;
        }
    },
    Quint: { //五次方的运动
        easeIn: function(t, b, c, d) {
            return c * (t /= d) * t * t * t * t + b;
        },
        easeOut: function(t, b, c, d) {
            return c * ((t = t/d - 1) * t * t * t * t + 1) + b;
        },
        easeInOut: function(t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
            return c / 2*((t -= 2) * t * t * t * t + 2) + b;
        }
    },
    Sine: { //正弦曲线的运动
        easeIn: function(t, b, c, d) {
            return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
        },
        easeOut: function(t, b, c, d) {
            return c * Math.sin(t/d * (Math.PI/2)) + b;
        },
        easeInOut: function(t, b, c, d) {
            return -c / 2 * (Math.cos(Math.PI * t/d) - 1) + b;
        }
    },
    Expo: { //指数曲线的运动
        easeIn: function(t, b, c, d) {
            return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
        },
        easeOut: function(t, b, c, d) {
            return (t==d) ? b + c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
        },
        easeInOut: function(t, b, c, d) {
            if (t==0) return b;
            if (t==d) return b+c;
            if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
            return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
        }
    },
    Circ: { //圆形曲线的运动
        easeIn: function(t, b, c, d) {
            return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
        },
        easeOut: function(t, b, c, d) {
            return c * Math.sqrt(1 - (t = t/d - 1) * t) + b;
        },
        easeInOut: function(t, b, c, d) {
            if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
            return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
        }
    },
    Elastic: { //指数衰减的正弦曲线运动
        easeIn: function(t, b, c, d, a, p) {
            var s;
            if (t==0) return b;
            if ((t /= d) == 1) return b + c;
            if (typeof p == "undefined") p = d * .3;
            if (!a || a < Math.abs(c)) {
                s = p / 4;
                a = c;
            } else {
                s = p / (2 * Math.PI) * Math.asin(c / a);
            }
            return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
        },
        easeOut: function(t, b, c, d, a, p) {
            var s;
            if (t==0) return b;
            if ((t /= d) == 1) return b + c;
            if (typeof p == "undefined") p = d * .3;
            if (!a || a < Math.abs(c)) {
                a = c; 
                s = p / 4;
            } else {
                s = p/(2*Math.PI) * Math.asin(c/a);
            }
            return (a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b);
        },
        easeInOut: function(t, b, c, d, a, p) {
            var s;
            if (t==0) return b;
            if ((t /= d / 2) == 2) return b+c;
            if (typeof p == "undefined") p = d * (.3 * 1.5);
            if (!a || a < Math.abs(c)) {
                a = c; 
                s = p / 4;
            } else {
                s = p / (2  *Math.PI) * Math.asin(c / a);
            }
            if (t < 1) return -.5 * (a * Math.pow(2, 10* (t -=1 )) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
            return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p ) * .5 + c + b;
        }
    },
    Back: { //超过范围的三次方运动
        easeIn: function(t, b, c, d, s) {
            if (typeof s == "undefined") s = 1.70158;
            return c * (t /= d) * t * ((s + 1) * t - s) + b;
        },
        easeOut: function(t, b, c, d, s) {
            if (typeof s == "undefined") s = 1.70158;
            return c * ((t = t/d - 1) * t * ((s + 1) * t + s) + 1) + b;
        },
        easeInOut: function(t, b, c, d, s) {
            if (typeof s == "undefined") s = 1.70158; 
            if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
            return c / 2*((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
        }
    },
    Bounce: { //指数衰减的反弹运动
        easeIn: function(t, b, c, d) {
            return c - Orbit.Bounce.easeOut(d-t, 0, c, d) + b;
        },
        easeOut: function(t, b, c, d) {
            if ((t /= d) < (1 / 2.75)) {
                return c * (7.5625 * t * t) + b;
            } else if (t < (2 / 2.75)) {
                return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
            } else if (t < (2.5 / 2.75)) {
                return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
            } else {
                return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
            }
        },
        easeInOut: function(t, b, c, d) {
            if (t < d / 2) {
                return Orbit.Bounce.easeIn(t * 2, 0, c, d) * .5 + b;
            } else {
                return Orbit.Bounce.easeOut(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
            }
        }
    }
}

~function(){
	function animation( curEle, options, duration, effect, callBack ){
		window.clearInterval(curEle.foreverTimer);
		duration = duration || 400;
		var beginning = {}, change = {}, method = Orbit.Linear;

		if( typeof effect === "string"){

			method = Orbit[effect]['easeIn'];

		}else if( {}.toString.call(effect) === "[object Array]" ){

			method = Orbit[effect[0]][effect[1]];

		}else if( typeof effect === "function" ){

			 callBack = effect;
		}

		for (var key in options){
			if(options.hasOwnProperty(key)){
				beginning[key] = forever.css(curEle,key);
				change[key] = options[key] - beginning[key];
			}
		}
		var time = 0;
		curEle.foreverTimer = window.setInterval(function(){
			time +=10;
			if( time >= duration ){
				forever.css(curEle,options);
				window.clearInterval(curEle.foreverTimer);
				callBack && callBack();
				return;
			}

			for( key in options ){
				if( options.hasOwnProperty(key) ){
					var current = method( time, beginning[key], change[key], duration );
					forever.css( curEle, key, current );
				}
			}

		},10);
	}

	window.foreverAnimation = animation;
}()