/*
 * songs.js - 歌曲数据
 * 使用纯 JS 变量而非 JSON，确保 IE6/IE7 能直接解析
 *
 * 添加新歌时，按下面的格式在数组里新增一项即可：
 * {
 *   id: "003",
 *   title: "歌曲名",
 *   artist: "歌手名",
 *   mp3: "songs/003/song.mp3",
 *   cover: "songs/003/cover.jpg",
 *   lrc: "songs/003/lyric.lrc"
 * }
 */

var SONGS = [
    {
        id: "001",
        title: "另类·十年",
        artist: "小少焱",
        mp3: "songs/001/另类·十年.mp3",
        cover: "songs/001/cover.jpg",
        lrc: "songs/001/另类·十年 - 小少焱.lrc"
    },
    {
        id: "002",
        title: "暗序里的轻嘿",
        artist: "ku小酷、DJ寒霜",
        mp3: "songs/001/暗序里的轻嘿.mp3",
        cover: "songs/001/cover.jpg",
        lrc: "songs/001/lyric.lrc"
    },
    {
        id: "002",
        title: "豌拜集团？？？？不是音乐",
        artist: "豌拜",
        mp3: "songs/001/无音乐.mp3",
        cover: "songs/001/cover.jpg",
        lrc: "songs/001/lyric.lrc"
    },
];
