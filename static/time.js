document.write('<span id="localtime"></span>');
function showLocale(objD){
  var str;
  var hh = objD.getHours();
  if(hh<10) hh = '0' + hh;
  var mm = objD.getMinutes();
  if(mm<10) mm = '0' + mm;
  var ss = objD.getSeconds();
  if(ss<10) ss = '0' + ss;
  str = hh + ":" + mm + ":" + ss;
  return(str);
}
function tick(){
  var today;
  today = new Date();
  document.getElementById("localtime").innerHTML = showLocale(today);
  window.setTimeout("tick()", 1000);
}
tick();