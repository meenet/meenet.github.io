var player = null;

function jsnull() { return; }
$(document).ready(function($) {
	ckvbody = (window.opera) ? (document.compatMode == "CSS1Compat" ? $('html') : $('body')) : $('html,body');
	changePlayerHeight();
	$(window).resize(changePlayerHeight);
	loadVideo();
});
function changePlayerHeight(){
	var width=$('.video').width();
	var height=width*0.5;
	if(height<200){
		height=200;
	}
	if(height>500){
		height=500;
	}
	$('.video').css({height:height+'px'});
}
function loadVideo() {
	var videoObject = {
		container: 'video', //容器的ID
		variable: 'player',
		volume: 0.6, //默认音量
		poster: 'res/yytf/wdm.jpg', //封面图片地址
		autoplay: false, //是否自动播放
		loop: false, //是否循环播放
		live: false, //是否是直播
		loaded: 'loadedHandler', //当播放器加载后执行的函数
		seek: 0, //默认需要跳转的时间
		drag: 'start', //在flashplayer情况下是否需要支持拖动，拖动的属性是什么
		front: 'frontFun', //前一集按钮动作
		next: 'nextFun', //下一集按钮动作
		video: [
			['http://img.ksbbs.com/asset/Mon_1703/05cacb4e02f9d9e.mp4', 'video/mp4', '中文标清', 0],
			['http://img.ksbbs.com/asset/Mon_1703/d0897b4e9ddd9a5.mp4', 'video/mp4', '中文高清', 10],
			['http://img.ksbbs.com/asset/Mon_1703/eb048d7839442d0.mp4', 'video/mp4', '英文高清', 0],
			['http://img.ksbbs.com/asset/Mon_1703/d30e02a5626c066.mp4', 'video/mp4', '英文超清', 0],
		]
	};
	player = new ckvplayer();
	player.embed(videoObject);
}

function loadedHandler() {
	changeText('.playerstate', '状态：播放器已加载，建立监听：监听元数据，监听其它状态');
	player.addListener('error', errorHandler); //监听视频加载出错
	player.addListener('loadedmetadata', loadedMetaDataHandler); //监听元数据
	player.addListener('play', playHandler); //监听暂停播放
	player.addListener('pause', pauseHandler); //监听暂停播放
	player.addListener('timeupdate', timeUpdateHandler); //监听播放时间
	player.addListener('seeking', seekingHandler); //监听跳转播放
	player.addListener('seeked', seekedHandler); //监听跳转播放完成
	player.addListener('volumechange', volumeChangeHandler); //监听音量改变
	player.addListener('full', fullHandler); //监听全屏/非全屏切换
	player.addListener('ended', endedHandler); //监听全屏/非全屏切换
	player.addListener('videochange', videoChangeHandler); //监听视频地址改变
}

function errorHandler() {
	changeText('.playerstate', '状态：视频加载错误，停止执行其它动作，等待其它操作');
}

function loadedMetaDataHandler() {
	var metaData = player.getMetaDate();
	var html=''
	if(parseInt(metaData['videoWidth'])>0){
		changeText('.playerstate', '状态：获取到元数据信息，如果数据错误，可以使用延迟获取');
		html += '总时间：' + metaData['duration'] + '秒，';
		html += '音量：' + metaData['volume'] + '（范围0-1），';
		html += '播放器的宽度：' + metaData['width'] + 'px，';
		html += '播放器的高度：' + metaData['height'] + 'px，';
		html += '视频的实际宽度：' + metaData['videoWidth'] + 'px，';
		html += '视频的实际高度：' + metaData['videoHeight'] + 'px，';
		html += '是否暂停状态：' + metaData['paused'];
	}
	else{
		changeText('.playerstate', '状态：未正确获取到元数据信息');
		html='您正在使用移动端或iPad观看本页面，该平台限制了视频加载，只有在点击了播放器后才能加载视频及获取元数据信息';
	}
	changeText('.metadata',html);
}

function playHandler() {
	changeText('.playstate','播放状态：播放');
	window.setTimeout(function(){
		loadedMetaDataHandler();
	},1000);
	loadedMetaDataHandler();
}

function pauseHandler() {
	changeText('.playstate', '播放状态：暂停');
	loadedMetaDataHandler();
}

function timeUpdateHandler() {
	changeText('.currenttimestate','当前播放时间（秒）：' + player.time);
}

function seekingHandler() {
	changeText('.seekstate','跳转动作：正在进行跳转');
}

function seekedHandler() {
	changeText('.seekstate','跳转动作：跳转完成');
}

function volumeChangeHandler() {
	changeText('.volumechangestate','当前音量：' + player.volume);
}

function fullHandler() {
	var html=$('.fullstate').html();
	if(player.full){
		html+='，全屏';
	}
	else{
		html+='，否';
	}
	changeText('.fullstate',html);
}
function endedHandler(){
	changeText('.endedstate','播放结束');
}
var videoChangeNum=0;
function videoChangeHandler(){
	videoChangeNum++;
	changeText('.videochangestate','视频地址改变了'+videoChangeNum+'次');
}
function seekTime(){
	var time=parseInt($('.seektime').val());
	var metaData = player.getMetaDate();
	var duration=metaData['duration'];
	if(time<0){
		alert('请填写大于0的数字');
		return;
	}
	if(time>duration){
		alert('请填写小于'+duration+'的数字');
		return;
	}
	player.seek(time);
}
function changeVolume(){
	var volume=$('.changevolume').val();
	volume=Math.floor(volume * 100) / 100
	if(volume<0){
		alert('请填写大于0的数字');
		return;
	}
	if(volume>1){
		alert('请填写小于1的数字');
		return;
	}
	player.changeVolume(volume);
}
function changeSize(){
	player.changeSize(w,h)
}
function frontFun() {
	alert('点击了前一集');
}

function nextFun() {
	alert('点击了下一集');
}
function newVideo() {
	var videoUrl=$('.videourl').val();
	changeVideo(videoUrl);
}
function newVideo2() {
	var videoUrl=$('.videourl2').val();
	changeVideo(videoUrl);
}
function changeVideo(videoUrl) {
	if(player==null){
		return;
	}
	
	var newVideoObject = {
		container: 'video', //容器的ID
		variable: 'player',
		autoplay: true, //是否自动播放
		loop: false, //是否循环播放
		live: false, //是否是直播
		front: '', //前一集按钮动作
		next: '', //下一集按钮动作
		loaded: 'loadedHandler', //当播放器加载后执行的函数
		video: videoUrl
	}
	//判断是需要重新加载播放器还是直接换新地址
	
	if(player.playerType=='html5video'){
		if(player.getFileExt(videoUrl)=='.flv' || player.getFileExt(videoUrl)=='.m3u8' || player.getFileExt(videoUrl)=='.f4v' || player.getFileExt(videoUrl)=='.rtmp'){
			player.removeListener('error', errorHandler); //监听视频加载出错
			player.removeListener('loadedmetadata', loadedMetaDataHandler); //监听元数据
			player.removeListener('play', playHandler); //监听暂停播放
			player.removeListener('pause', pauseHandler); //监听暂停播放
			player.removeListener('timeupdate', timeUpdateHandler); //监听播放时间
			player.removeListener('seeking', seekingHandler); //监听跳转播放
			player.removeListener('seeked', seekedHandler); //监听跳转播放完成
			player.removeListener('volumechange', volumeChangeHandler); //监听音量改变
			player.removeListener('full', fullHandler); //监听全屏/非全屏切换
			player.removeChild();
			player=null;
			player = new ckvplayer();
			player.embed(newVideoObject);
		}
		else{
			player.newVideo(newVideoObject);
		}
	}
	else{
		if(player.getFileExt(videoUrl)=='.mp4' || player.getFileExt(videoUrl)=='.webm' || player.getFileExt(videoUrl)=='.ogg'){
			player.removeListener('error', errorHandler); //监听视频加载出错
			player.removeListener('loadedmetadata', loadedMetaDataHandler); //监听元数据
			player.removeListener('play', playHandler); //监听暂停播放
			player.removeListener('pause', pauseHandler); //监听暂停播放
			player.removeListener('timeupdate', timeUpdateHandler); //监听播放时间
			player.removeListener('seeking', seekingHandler); //监听跳转播放
			player.removeListener('seeked', seekedHandler); //监听跳转播放完成
			player.removeListener('volumechange', volumeChangeHandler); //监听音量改变
			player.removeListener('full', fullHandler); //监听全屏/非全屏切换
			player=null;
			player = new ckvplayer();
			player.embed(newVideoObject);
		}
		else{
			player.newVideo(newVideoObject);
		}
	}
}

function changeText(div, text) {
	$(div).html(text);
}