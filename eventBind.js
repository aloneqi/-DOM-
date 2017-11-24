(function () {
    function on(ele,type,fn) {
        if(ele.addEventListener){
              ele.addEventListener(type,fn,false);
        }else {
            if(!ele["aelt"+type]){
                ele["aelt"+type]=[];
                ele.attachEvent("on"+type,function () {
                    run.call(ele)
                });
            }
            var aelt = ele["aelt"+type];
            for (var i = 0; i < aelt.length ; i++){
                if(aelt[i] == fn) return
            }
            aelt.push(fn);
        }
    }
    function run() {
        var e = window.event;
        console.log(e);
        var type = e.type;
        e.target = e.srcElement;
        e.stopPropagation = function () {
            e.cancelBubble = true;
        };
        e.preventDefault = function () {
            e.returnValue=false;
        }
        e.pageX=(document.documentElement.scrollLeft || document.body.scrollLeft)+e.clientX;
        e.pageY=(document.documentElement.scrollTop || document.body.scrollTop)+e.clientY;
        var aelt = this["aelt"+type];
        for (var i = 0; i < aelt.length; ){
            if(typeof aelt[i] !== "function"){
                aelt.splice(i,1);
            }else {
                aelt[i].call(this,e);
                i++;
            }
        };
    }
    function off(ele,type,fn) {
        if(ele.removeEventListener){
            ele.removeEventListener(type,fn,false);
        }else {
            var aelt = ele["aelt"+type];
            if(aelt && aelt.length){
                for (var i = 0; i<aelt.length; i++){
                    if( aelt[i] == fn ) {
                        aelt[i]=null;
                        return;
                    }
                }
            }
        }
    }
    window.aelt={on:on,off:off}
})()