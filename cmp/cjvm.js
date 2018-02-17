//=========================================================================
//cmp api
var cmp_player_id = "player";
var cmp_id = "cmp_id";
var cmp_url = "cmp.swf";
var cmpo = null;
function cmp_loaded(key) {
	cmpo = CMP.get(cmp_id);
}
var flashvars = {
	url : "",
	lists : "cjvm.xml",
	models : "cjvm.swf",
	auto_play : 1,
	api : "cmp_loaded"
};
// id, width, height, swf_url, flashvars, params, attrs
var htm = CMP.create(cmp_id, "100%", "100%", cmp_url, flashvars);
document.getElementById(cmp_player_id).innerHTML = htm;
// =========================================================================
// cjvm api
function cjvm_load(data) {

	data += "";
	if (!data) {
		cjvm_error();
		return;
	}
	// load by jquery jsonp
	var arr = data.split(",");
	var from = arr[0];
	var id = arr[1];
	if (from == "youku") {
		youku_load(id);
	}
	if (from == "sohu") {
		sohu_load(id);
	}
}
function cjvm_error() {
	cmpo.sendEvent("cjvm_error");
}
function cjvm_complete(data) {
	// console.log(data);
	cmpo.sendEvent("cjvm_complete", data);
}
// =========================================================================

//搜狐
var sohu_list = [];
function sohu_load(id) {
	var sohu_url = "http://api.tv.sohu.com/v4/video/info/"+id+".json?api_key=f351515304020cad28c92f70f002261c";
	$.ajax({
		url : sohu_url,
		dataType : "jsonp",
		error : function() {
			youku_error();
		},
		success : function(data) {
		
			sohu_success(data);
		}
	});
}

function sohu_success(json){

	var type=[];
	type['nor']='url_nor_mp4';
	type['high']='high';
	type['super']='url_super_mp4';
	var streamtype='nor';
	
    var arr = json.data;
	cmpo.item("duration", arr.total_duration);
	var str=type[streamtype];
	var urls=arr[str].split(',');
	var s="clips_duration_"+streamtype;
	var s1="clips_bytes_"+streamtype;
	var seconds=arr[s].split(',');;
	var sizes=arr[s1].split(',');;
    var slist = [];
	for (var i = 0, len = urls.length; i < len; i++) {
		var list=[];
		list['url']=urls[i];
		list['duration']= parseFloat(seconds[i]);
		list['size']= parseFloat(sizes[i]);
		slist[i]=list;
	}
	sohu_list = slist;
	sohu_getpath_complete();
}

function sohu_getpath_complete() {
	// 拼出merge插件的格式的xml字符串
	var xml = '<m>';
	for (var i = 0, l = sohu_list.length; i < l; i++) {
		var item = sohu_list[i];
		if (item) {
			xml += '<u bytes="' + item.size + '" duration="' + item.duration + '" src="' + item.url + '" />';
		}
	}
	xml += '</m>';
	// 发送到CMP
    cjvm_complete(xml);
}

// youku api
var youku_list = [];

//优酷
function youku_load(id) {
	var youku_url = "http://v.youku.com/player/getPlaylist/VideoIDS/" + id + "/Pf/4/ctype/12/ev/1";
	$.ajax({
		url : youku_url,
		dataType : "jsonp",
		jsonp : "__callback",
		error : function() {
			youku_error();
		},
		success : function(data) {
			youku_success(data);
		}
	});
}

function youku_error() {
	cjvm_error();
}
function youku_success(data) {
	if (!data) {
		youku_error();
		return;
	}
	youku_parse(data);
}
function youku_parse(json) {
//为以后做清晰度选择做准备
var type=[];
type['flv']=0;type['flvhd']=0;type['mp4']=1;type['hd2']=2;type['3gphd']=1;type['3gp']=0;
	// 清晰度选择：flv, mp4, hd2
	var streamtype = "mp4";
	var k;
	// 解析数据
	var arr = json.data;
	// 列表数据
	var data = arr[0];

	cmpo.item("duration", data.seconds);
	 c = E(F("b4eto0b4", [19, 1, 4, 7, 30, 14, 28, 8, 24,
                        17, 6, 35, 34, 16, 9, 10, 13, 22, 32, 29, 31, 21, 18, 3, 2, 23, 25, 27, 11, 20, 5, 15, 12, 0, 33, 26
                    ]).toString(), na(data.ep));
    var sid = c.split("_")[0];
    var token = c.split("_")[1];
	
	
	
	// 计算所有分段地址列表
	var list = [];
	// 分段
	if (data.segs) {
		list = data.segs[streamtype];
		if (!list) {
			streamtype = "flv";
			list = data.segs.flv;
		}
	}
	
	// 列表不存在
	if (!list || list.length == 0) {
		list = [];
		youku_error();
		return;
	}
	// 解码种子
	var seed = parseInt(data.seed);
	var oip=data.ip;
	// 根据类型选择，flv为普通，mp4为清晰
	var fileid = data.streamfileids[streamtype];
	var hd=type[streamtype];
	// 初始化列表信息
	var seconds = 0;
	var bytes = 0;
	for (var i = 0, len = list.length; i < len; i++) {
		var item = list[i];
		// 获取第几段
		var no = parseInt(item.no);
		item.no = no;
		var ns = no.toString(16).toUpperCase();
		if (ns.length < 2) {
			ns = "0" + ns;
		}
		// 计算视频fileid
		var id = getFileID(fileid, seed);
		
		var s8 = id.substr(0, 8);
		var s10 = id.substr(10);
		id = s8 + ns + s10;
		var ts = item.seconds;
		
		if (item.k) {
			k = item.k;
		}
		streamtype = (streamtype == "mp4") ? "mp4" : "flv";
		ep = encodeURIComponent(D(E(F("boa4poz1", [19, 1, 4, 7, 30, 14, 28, 8, 24, 17, 6, 35, 34, 16, 9, 10, 13, 22, 32, 29, 31, 21, 18, 3, 2, 23, 25, 27, 11, 20, 5, 15, 12, 0, 33, 26]).toString(), sid + "_" + id + "_" + token)));
        // 合成请求url
	    var url = "http://k.youku.com/player/getFlvPath/sid/" + sid+"_"+ns+"/st/" + streamtype + "/fileid/" + id+"?K=" + k+"&hd="+hd+"&myp=0"+"&ts=" + ts+"&ypp=2&ctype=12&ev=1"+"&token=" + token+"&oip=" + oip+"&ep=" + ep;
        item.url = url;
		item.seconds = parseFloat(ts);
		item.start_seconds = seconds;
		seconds += item.seconds;
		item.end_seconds = seconds;
	}
	youku_list = list;
	
	youku_getpath();
}
function youku_getpath(index) {
	for (var i = 0, l = youku_list.length; i < l; i++) {
		var item = youku_list[i];
		if (item && !item.src) {
			// 活动每个分段的真实地址
			youku_getItemPath(item);
			return;
		}
	}
	youku_getpath_complete();
}
function youku_getItemPath(item) {
	$.ajax({
		url : item.url,
		dataType : "jsonp",
		jsonp : "callback",
		error : function() {
			youku_getpath();
		},
		success : function(data) {
			if (data) {
				var info = data[0];
				item.src = info.server + "?start={start_seconds}";
			}
			youku_getpath();
		}
	});
}
function youku_getpath_complete() {
	// 拼出merge插件的格式的xml字符串
	var xml = '<m>';
	for (var i = 0, l = youku_list.length; i < l; i++) {
		var item = youku_list[i];
		if (item) {
			xml += '<u bytes="' + item.size + '" duration="' + item.seconds + '" src="' + item.src + '" />';
		}
	}
	xml += '</m>';
	// 发送到CMP

	cjvm_complete(xml);
}
function getFileIDMixString(seed) {
    var source = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ/\\:._-1234567890".split(""),
        mixed = [],
        index;
    for (var i = 0, len = source.length; i < len; i++) {
        seed = (seed * 211 + 30031) % 65536;
        index = Math.floor(seed / 65536 * source.length);
        mixed.push(source[index]);
        source.splice(index, 1);
    }
    return mixed.join("");
}

function getFileID(fileid, seed) {
    var mixed = getFileIDMixString(seed),
        ids = fileid.split("*"),
        realId = [],
        idx;
    for (var i = 0; i < ids.length - 1; i++) {
        idx = parseInt(ids[i], 10);
        realId.push(mixed.charAt(idx));
    }
    return realId.join("");
}

function na(a) {
    if (!a) return "";
    var a = a.toString(),
        c, b, f, i, e, h = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1];
    i = a.length;
    f = 0;
    for (e = ""; f < i;) {
        do c = h[a.charCodeAt(f++) & 255]; while (f < i && -1 == c);
        if (-1 == c) break;
        do b = h[a.charCodeAt(f++) & 255]; while (f < i && -1 == b);
        if (-1 == b) break;
        e += String.fromCharCode(c << 2 | (b & 48) >> 4);
        do {
            c = a.charCodeAt(f++) & 255;
            if (61 == c) return e;
            c = h[c]
        } while (f < i && -1 == c);
        if (-1 == c) break;
        e += String.fromCharCode((b & 15) << 4 | (c & 60) >> 2);
        do {
            b = a.charCodeAt(f++) & 255;
            if (61 == b) return e;
            b = h[b]
        } while (f < i && -1 == b);
        if (-1 == b) break;
        e += String.fromCharCode((c &
            3) << 6 | b)
    }
    return e
}

function D(a) {
    if (!a) return "";
    var a = a.toString(),
        c, b, f, e, g, h;
    f = a.length;
    b = 0;
    for (c = ""; b < f;) {
        e = a.charCodeAt(b++) & 255;
        if (b == f) {
            c += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(e >> 2);
            c += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt((e & 3) << 4);
            c += "==";
            break
        }
        g = a.charCodeAt(b++);
        if (b == f) {
            c += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(e >> 2);
            c += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt((e & 3) << 4 | (g & 240) >> 4);
            c += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt((g &
                15) << 2);
            c += "=";
            break
        }
        h = a.charCodeAt(b++);
        c += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(e >> 2);
        c += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt((e & 3) << 4 | (g & 240) >> 4);
        c += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt((g & 15) << 2 | (h & 192) >> 6);
        c += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(h & 63)
    }
    return c
}

function E(a, c) {
    for (var b = [], f = 0, i, e = "", h = 0; 256 > h; h++) b[h] = h;
    for (h = 0; 256 > h; h++) f = (f + b[h] + a.charCodeAt(h % a.length)) % 256, i = b[h], b[h] = b[f], b[f] = i;
    for (var q = f = h = 0; q < c.length; q++) h = (h + 1) % 256, f = (f + b[h]) % 256, i = b[h], b[h] = b[f], b[f] = i, e += String.fromCharCode(c.charCodeAt(q) ^ b[(b[h] + b[f]) % 256]);
    return e
}

function F(a, c) {
    for (var b = [], f = 0; f < a.length; f++) {
        for (var i = 0, i = "a" <= a[f] && "z" >= a[f] ? a[f].charCodeAt(0) - 97 : a[f] - 0 + 26, e = 0; 36 > e; e++)
            if (c[e] == i) {
                i = e;
                break
            }
        b[f] = 25 < i ? i - 26 : String.fromCharCode(i + 97)
    }
    return b.join("")
}