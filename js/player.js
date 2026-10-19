/*
 * player.js - 音乐播放器核心逻辑
 * 兼容 IE6/IE7：使用 attachEvent，不用 addEventListener
 * 双通道：现代浏览器用 <audio>，IE6/IE7 用 Flash
 */

var player = {
    audio: null,
    flashReady: false,
    useFlash: false,
    currentIndex: -1,
    isPlaying: false,
    duration: 0,

    init: function () {
        var self = this;
        this.audio = document.getElementById('audioEl');

        // 检测是否支持 audio 元素（IE6/7 不支持）
        this.useFlash = !(this.audio && this.audio.canPlayType);

        if (this.useFlash) {
            // IE6/IE7：等待 Flash 就绪
            window.onFlashReady = function () {
                self.flashReady = true;
                self.loadSong(0);
            };
            // 延迟兜底
            setTimeout(function () {
                if (!self.flashReady) {
                    self.flashReady = true;
                    self.loadSong(0);
                }
            }, 3000);
        }

        this.bindEvents();
        this.renderPlaylist();
        this.loadSong(0);
    },

    bindEvents: function () {
        var self = this;

        // 用 attachEvent 兼容 IE6/7
        var playBtn = document.getElementById('btnPlay');
        var prevBtn = document.getElementById('btnPrev');
        var nextBtn = document.getElementById('btnNext');
        var progBar = document.getElementById('progressBar');

        if (playBtn.attachEvent) {
            playBtn.attachEvent('onclick', function () { self.togglePlay(); });
            prevBtn.attachEvent('onclick', function () { self.prevSong(); });
            nextBtn.attachEvent('onclick', function () { self.nextSong(); });
            progBar.attachEvent('onclick', function (e) { self.seek(e); });
        } else {
            playBtn.addEventListener('click', function () { self.togglePlay(); });
            prevBtn.addEventListener('click', function () { self.prevSong(); });
            nextBtn.addEventListener('click', function () { self.nextSong(); });
            progBar.addEventListener('click', function (e) { self.seek(e); });
        }

        // audio 事件
        if (this.audio && this.audio.addEventListener) {
            this.audio.addEventListener('timeupdate', function () { self.onTimeUpdate(); });
            this.audio.addEventListener('loadedmetadata', function () { self.onLoaded(); });
            this.audio.addEventListener('ended', function () { self.nextSong(); });
        } else if (this.audio && this.audio.attachEvent) {
            this.audio.attachEvent('ontimeupdate', function () { self.onTimeUpdate(); });
            this.audio.attachEvent('onloadedmetadata', function () { self.onLoaded(); });
            this.audio.attachEvent('onended', function () { self.nextSong(); });
        }
    },

    renderPlaylist: function () {
        var ul = document.getElementById('playlist');
        var html = '';
        for (var i = 0; i < SONGS.length; i++) {
            html += '<li data-index="' + i + '" onclick="player.playSong(' + i + ')">' +
                    (i + 1) + '. ' + SONGS[i].title + ' - ' + SONGS[i].artist +
                    '</li>';
        }
        ul.innerHTML = html;
    },

    loadSong: function (index) {
        if (index < 0) index = SONGS.length - 1;
        if (index >= SONGS.length) index = 0;

        this.currentIndex = index;
        var song = SONGS[index];

        // 更新封面
        var coverImg = document.getElementById('coverImg');
        if (song.cover) {
            coverImg.src = song.cover;
            this.setBackground(song.cover);
        }

        // 更新歌曲信息
        document.getElementById('songTitle').innerHTML = song.title;
        document.getElementById('songArtist').innerHTML = song.artist;

        // 高亮播放列表
        var items = document.getElementById('playlist').getElementsByTagName('li');
        for (var i = 0; i < items.length; i++) {
            items[i].className = (i == index) ? 'active' : '';
        }

        // 加载音频
        if (this.useFlash) {
            // Flash 播放
            if (this.flashReady && window.flashPlay) {
                window.flashPlay(song.mp3);
            }
        } else {
            this.audio.src = song.mp3;
        }

        // 加载歌词
        lyric.loadLrc(song.lrc);
    },

    playSong: function (index) {
        this.loadSong(index);
        this.play();
    },

    togglePlay: function () {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    },

    play: function () {
        this.isPlaying = true;
        document.getElementById('btnPlay').innerHTML = '暂停';

        if (this.useFlash) {
            if (window.flashPlay && window.flashResume) {
                window.flashResume();
            }
        } else if (this.audio) {
            this.audio.play();
        }
    },

    pause: function () {
        this.isPlaying = false;
        document.getElementById('btnPlay').innerHTML = '播放';

        if (this.useFlash) {
            if (window.flashPause) window.flashPause();
        } else if (this.audio) {
            this.audio.pause();
        }
    },

    prevSong: function () {
        this.loadSong(this.currentIndex - 1);
        if (this.isPlaying) this.play();
    },

    nextSong: function () {
        this.loadSong(this.currentIndex + 1);
        if (this.isPlaying) this.play();
    },

    seek: function (e) {
        var bar = document.getElementById('progressBar');
        var rect = bar.getBoundingClientRect ? bar.getBoundingClientRect() : { left: 0, width: bar.offsetWidth };
        var pct = (e.clientX - rect.left) / rect.width;
        if (pct < 0) pct = 0;
        if (pct > 1) pct = 1;

        if (this.useFlash) {
            if (window.flashSeek) window.flashSeek(pct * 100);
        } else if (this.audio && this.audio.duration) {
            this.audio.currentTime = pct * this.audio.duration;
        }
    },

    onTimeUpdate: function () {
        if (!this.audio || !this.audio.duration) return;

        var cur = this.audio.currentTime;
        var dur = this.audio.duration;
        var pct = (cur / dur) * 100;

        document.getElementById('progressFill').style.width = pct + '%';
        document.getElementById('curTime').innerHTML = this.fmt(cur);
        document.getElementById('durTime').innerHTML = this.fmt(dur);

        // 通知歌词
        lyric.update(cur);
    },

    onLoaded: function () {
        if (this.audio && this.audio.duration) {
            this.duration = this.audio.duration;
            document.getElementById('durTime').innerHTML = this.fmt(this.duration);
        }
    },

    setBackground: function (imgUrl) {
        var bg = document.getElementById('bgLayer');
        // IE6 用 AlphaImageLoader
        if (bg.style.filter !== undefined && typeof imgUrl === 'string') {
            try {
                bg.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + imgUrl + "', sizingMethod='scale')";
                bg.style.backgroundImage = '';
            } catch (e) {
                bg.style.backgroundImage = "url('" + imgUrl + "')";
            }
        } else {
            bg.style.backgroundImage = "url('" + imgUrl + "')";
        }
    },

    fmt: function (s) {
        s = Math.floor(s);
        var m = Math.floor(s / 60);
        var sec = s % 60;
        return (m < 10 ? '0' + m : m) + ':' + (sec < 10 ? '0' + sec : sec);
    }
};

function initPlayer() {
    player.init();
}
