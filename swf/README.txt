player.swf 说明
================

这个 SWF 是一个空白占位文件。要让 IE6/IE7 真正播放 MP3，
你需要替换为一个支持 ExternalInterface 的 Flash MP3 播放器。

推荐方案：使用 SoundManager2
----------------------------
1. 下载 SoundManager2: https://github.com/scottschiller/SoundManager2
2. 从 swf/ 目录中复制以下文件到本目录:
   - soundmanager2_flash9.swf
   - soundmanager2_flash9_debug.swf
3. 重命名 soundmanager2_flash9.swf 为 player.swf
4. 修改 index.html，用 SoundManager2 的初始化方式替代 flashplayer.js

SoundManager2 专门为旧浏览器设计，会自动检测并使用 Flash 播放音频，
是现代浏览器 audio 元素的完美降级方案。

如果不想折腾 Flash
------------------
IE6/IE7 用户会看到"当前浏览器不支持音频播放"的提示，
但现代浏览器（Chrome/Edge/Firefox/Safari/IE9+）都能正常播放。
