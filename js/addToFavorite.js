/**
 * Created with JetBrains WebStorm.
 * User: wkylin(jingang.wang@baozun.cn)
 * Date: 12-6-6
 * Time: 上午11:06
 * To change this template use File | Settings | File Templates.
 */


function addToFavorite() {
    var d = "http://www.360buy.com/";
    var c = "京东商城-网购上京东，省钱又放心";
    if (document.all) {
        window.external.AddFavorite(d, c);
    } else {
        if (window.sidebar) {
            window.sidebar.addPanel(c, d, "");
        } else {
            alert("对不起，您的浏览器不支持此操作!\n请您使用菜单栏或Ctrl+D收藏本站。");
        }
    }
}