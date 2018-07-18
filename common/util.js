var domain = "https://www.langrun.club/express-0.0.1-SNAPSHOT";
// var domain = "http://111.231.85.91/express-0.0.1-SNAPSHOT";
function sessionurl() {
  return domain + "/webChat/sessionKey";
}  
function updaterecipient() {
  return domain + "/user/update/recipient";
}
// var factoryfind = domain + "/factory/find";
function factoryfind() {
  return domain + "/factory/find";
}
// var picupload = domain + "/pic/upload";
function picupload() {
  return domain + "/pic/upload";
}
// var ordernew = domain + "/order/newt";
function ordernew() {
  return domain + "/order/new";
}
// var packagenew = domain + "/package/new";
function packagenew() {
  return domain + "/package/new";
}
// var orderfindbyid = domain + "/order/findbyid";
function orderfindbyid() {
  return domain + "/order/findbyid";
}
function factorysearch() {
  return domain + "/factory/search";
}
// var packagefind = domain + "/package/find";
function packagefind() {
  return domain + "/package/find";
}
function orderfind(){
  return domain + "/order/find";
}
// var userfind = domain + "/user/find";
function userfind() {
  return domain + "/user/find";
}
// var usernew = domain + "/user/new";
function usernew() {
  return domain + "/user/new";
}

module.exports = {
  getRequestUrl: "http://localhost:59637",//获得接口地址
  sessionurl: sessionurl,
  updaterecipient: updaterecipient,
  factoryfind: factoryfind,
  factorysearch: factorysearch,
  picupload: picupload,
  ordernew: ordernew,
  packagenew: packagenew,
  orderfind: orderfind,
  orderfindbyid: orderfindbyid,
  packagefind: packagefind,
  userfind: userfind,
  usernew: usernew
}