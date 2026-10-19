/*
 * lyric.js - 歌词解析与逐行滚动高亮
 * 兼容 IE6/IE7：不用 ES5+ 特性
 */

var lyric = {
    lines: [],      // [{time: 秒, text: "歌词"}]
    loaded: false,
    currentLine: -1,

    loadLrc: function (url) {
        this.lines = [];
        this.loaded = false;
        this.currentLine = -1;
        this.renderEmpty('歌词加载中…');

        if (!url) {
            this.renderEmpty('暂无歌词');
            return;
        }

        var self = this;
        var xhr = this.createXHR();

        if (!xhr) {
            this.renderEmpty('浏览器不支持歌词加载');
            return;
        }

        xhr.open('GET', url, true);
        if (xhr.overrideMimeType) {
            xhr.overrideMimeType('text/plain; charset=utf-8');
        }

        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status == 200 || xhr.status == 0) {
                    self.parse(xhr.responseText);
                } else {
                    self.renderEmpty('歌词加载失败');
                }
            }
        };

        try {
            xhr.send(null);
        } catch (e) {
            // 本地 file:// 协议可能被拦截
            this.renderEmpty('请通过 HTTP 服务器访问（GitHub Pages）');
        }
    },

    parse: function (text) {
        this.lines = [];
        var lines = text.split('\n');
        var timeRe = /\[(\d+):(\d+)\.?(\d*)\]/;

        for (var i = 0; i < lines.length; i++) {
            var line = lines[i];
            var match = timeRe.exec(line);
            while (match) {
                var min = parseInt(match[1], 10);
                var sec = parseInt(match[2], 10);
                var ms = match[3] ? parseInt(match[3], 10) : 0;
                var time = min * 60 + sec + ms / 1000;

                var text = line.substring(match.index + match[0].length);
                if (text && text !== '') {
                    this.lines.push({ time: time, text: text });
                }

                line = line.substring(0, match.index) + line.substring(match.index + match[0].length);
                match = timeRe.exec(line);
            }
        }

        this.lines.sort(function (a, b) {
            return a.time - b.time;
        });

        this.loaded = this.lines.length > 0;
        this.renderAll();
    },

    update: function (curTime) {
        if (!this.loaded) return;

        var newLine = -1;
        for (var i = 0; i < this.lines.length; i++) {
            if (this.lines[i].time <= curTime) {
                newLine = i;
            } else {
                break;
            }
        }

        if (newLine !== this.currentLine) {
            this.currentLine = newLine;
            this.renderAll();
        }
    },

    renderAll: function () {
        var inner = document.getElementById('lyricInner');
        if (!inner) return;

        if (!this.loaded) {
            this.renderEmpty('暂无歌词');
            return;
        }

        var html = '';
        var offset = 0;

        for (var i = 0; i < this.lines.length; i++) {
            if (i === this.currentLine) {
                html += '<p class="lrcLine current">' + this.lines[i].text + '</p>';
                offset = -(i * 33) - 16; // 粗略居中
            } else {
                html += '<p class="lrcLine">' + this.lines[i].text + '</p>';
            }
        }

        inner.innerHTML = html;

        // 滚动到当前行（相对 lyricInner 的 top 定位）
        inner.style.marginTop = offset + 'px';
    },

    renderEmpty: function (msg) {
        var inner = document.getElementById('lyricInner');
        if (inner) {
            inner.innerHTML = '<p class="lrcLine empty">' + msg + '</p>';
            inner.style.marginTop = '0px';
        }
        this.currentLine = -1;
    },

    createXHR: function () {
        if (typeof XMLHttpRequest !== 'undefined') {
            return new XMLHttpRequest();
        }
        try {
            return new ActiveXObject('Microsoft.XMLHTTP');
        } catch (e) {
            try {
                return new ActiveXObject('Msxml2.XMLHTTP');
            } catch (e2) {
                return null;
            }
        }
    }
};
