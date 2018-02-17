(function() {
    "use strict";

    var config = {
        name: "CMP5 - MEENET",
        link: "http://cmp.meenet.cn/",
        description: "CMP5 - MEENET - http://cmp.meenet.cn/",
        logo: "{src:logo.png,xywh:[10R,10R,0,0]}",

        skin: "skins/skin_default.js",

        autoplay: "1",

        counter: "http://img.users.51.la/5492210.asp"
    };

    var list = [{
        type: "",
        src: "music/test.mp3",
        lrc: "lrc/lrc.txt",
        label: "MP3音乐测试"
    }, {
        type: "",
        src: "music/test.mp4",
        lrc: "",
        label: "mp4视频测试"
    }, {
        type: "",
        src: "music/test.mp3",
        lrc: "lrc/lrc.txt",
        label: "lrc歌词"
    }, {
        type: "",
        src: "music/test.mp3",
        lrc: "lrc/kmc.json",
        label: "kmc卡拉OK歌词"
    }];

    var cmp5 = window.cmp5;
    var cmp = new cmp5.CMP();
    cmp.setContainer(".container");
    cmp.setConfig(config);
    cmp.setList(list);
    cmp.play();

}());