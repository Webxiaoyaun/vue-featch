(function(doc, win) {
    var docEl = doc.documentElement,
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
        htmlDom = doc.getElementsByTagName('html')[0],
        recalc = function() {
            var clientWidth = docEl.clientWidth;
            if(clientWidth>460){
                clientWidth=460
            }else{
                if(clientWidth<320) {
                    clientWidth=320
                }
            }
            if(!clientWidth) return;
            htmlDom.style.fontSize = clientWidth/3.75+ 'px';
        };
    if(!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);

