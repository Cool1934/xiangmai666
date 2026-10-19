# 我的音乐播放网站

一个兼容 IE6/IE7 的纯静态音乐播放网站，可部署到 GitHub Pages。

## 功能

- 歌曲列表（自己上传 mp3 / 封面图 / 歌词）
- 播放 / 暂停 / 上一首 / 下一首
- 歌词逐行滚动高亮（.lrc 格式）
- 背景随歌曲封面自动切换
- 现代浏览器用原生 `<audio>`，IE6/IE7 自动降级用 Flash 播放

## 如何添加歌曲

把文件放进 `songs/` 目录：

```
songs/
├── 001/
│   ├── song.mp3     ← 音频文件
│   ├── cover.jpg    ← 封面图
│   └── lyric.lrc    ← 歌词文件
├── 002/
│   └── ...
└── songs.json       ← 歌曲列表配置
```

然后在 `songs/songs.json` 里登记即可（见该文件内的示例格式）。

## 部署到 GitHub Pages

1. 在 GitHub 新建仓库，把本目录所有文件 push 上去
2. 仓库 Settings → Pages → Source 选 `main` 分支 → Save
3. 等待约 1 分钟，访问 `https://你的用户名.github.io/仓库名/`

## 目录结构

```
.
├── index.html        ← 主页面
├── style.css         ← 样式（兼容 IE6/7）
├── js/player.js      ← 播放器核心逻辑
├── js/lyric.js       ← 歌词解析与滚动
├── swf/player.swf    ← Flash 播放器（IE6/7 用）
└── songs/            ← 你的歌曲资源
```
