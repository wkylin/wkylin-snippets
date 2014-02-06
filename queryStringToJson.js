/**
 * Created by Administrator on 13-12-11.
 */

function queryStringToJson() {
    var queryArray = [], queryTemp = [];
    var queryStr = window.location.href.slice(window.location.href.indexOf("?") + 1);
    if (queryStr.indexOf("?") == "-1") {
        var queryStrArray = queryStr.split("&");
        for (var i = 0; i < queryStrArray.length; i++) {
            queryTemp = queryStrArray[i].split("=");
            queryArray.push(queryTemp[0]);
            queryArray[queryTemp[0]] = queryTemp[1];
        }
        return queryArray;
    }
}


function shakeBackgroundColor(ele, cls, times) {
    var i = 0, t = false , o = ele.attr("class") + " ", c = "", times = times || 2;
    if (t) return;
    t = setInterval(function () {
        i++;
        c = i % 2 ? o + cls : o;
        ele.attr("class", c);
        if (i == 2 * times) {
            clearInterval(t);
            ele.removeClass(cls);
        }
    }, 250);
}