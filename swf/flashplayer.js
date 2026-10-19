/*
 * flashplayer.js - Flash 播放器桥接层（IE6/IE7 用）
 *
 * 说明：IE6/IE7 不支持 <audio>，需要用 Flash 播放 mp3。
 * 本项目使用一个轻量开源 Flash 播放器（player.swf），
 * 它暴露以下 ExternalInterface 方法：
 *   - 从 JS 调用 Flash：load(url), play(), pause(), resume(), setPosition(pct)
 *   - 从 Flash 回调 JS：onFlashTimeUpdate(cur, dur), onFlashEnded()
 *
 * 如果你没有现成的 player.swf，可以用以下免费方案：
 *   - SoundManager2: https://github.com/scottschiller/SoundManager2
 *     （专门兼容旧浏览器，自带 flash fallback）
 *   - 或者把下面 embed 换成 SoundManager2 的初始化方式
 *
 * 这里用最朴素的方式 embed 一个 swf，确保 IE6/7 不报错。
 */

var flashPlayer = {
    swfId: 'musicFlash',
    ready: false,
    timer: null,
    curTime: 0,
    duration: 0,

    init: function () {
        var self = this;
        var box = document.getElementById('flashBox');

        var obj = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" ' +
                  'codebase="https://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0" ' +
                  'width="1" height="1" id="' + this.swfId + '">' +
                  '<param name="movie" value="swf/player.swf" />' +
                  '<param name="allowScriptAccess" value="always" />' +
                  '<param name="quality" value="high" />' +
                  '<embed src="swf/player.swf" quality="high" width="1" height="1" ' +
                  'name="' + this.swfId + '" allowScriptAccess="always" ' +
                  'type="application/x-shockwave-flash" pluginspage="https://www.macromedia.com/go/getflashplayer" />' +
                  '</object>';

        box.innerHTML = obj;

        // 通知就绪
        setTimeout(function () {
            self.ready = true;
            if (window.onFlashReady) window.onFlashReady();
        }, 1500);
    }
};

/*
 * 对外接口（被 player.js 调用）
 */
window.flashPlay = function (url) {
    flashPlayer.curTime = 0;
    if (window[flashPlayer.swfId] && window[flashPlayer.swfId].load) {
        window[flashPlayer.swfId].load(url);
        window[flashPlayer.swfId].play();
    }
    flashPlayer.startTimer();
};

window.flashPause = function () {
    if (window[flashPlayer.swfId] && window[flashPlayer.swfId].pause) {
        window[flashPlayer.swfId].pause();
    }
    flashPlayer.stopTimer();
};

window.flashResume = function () {
    if (window[flashPlayer.swfId] && window[flashPlayer.swfId].resume) {
        window[flashPlayer.swfId].resume();
    }
    flashPlayer.startTimer();
};

window.flashSeek = function (pct) {
    if (window[flashPlayer.swfId] && window[flashPlayer.swfId].setPosition) {
        window[flashPlayer.swfId].setPosition(pct);
    }
};

flashPlayer.startTimer = function () {
    var self = this;
    this.stopTimer();
    this.timer = setInterval(function () {
        // 模拟 timeupdate：从 Flash 取时间
        if (window[flashPlayer.swfId] && window[flashPlayer.swfId].getPosition) {
            var pct = window[flashPlayer.swfId].getPosition();
            // 更新进度条
            var fill = document.getElementById('progressFill');
            if (fill) fill.style.width = pct + '%';
        }
    }, 500);
};

flashPlayer.stopTimer = function () {
    if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
    }
};

// 初始化 Flash
if (typeof player !== 'undefined' && player.useFlash) {
    flashPlayer.init();
}
