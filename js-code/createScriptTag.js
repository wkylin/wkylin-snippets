/**
 * Created by JetBrains WebStorm.
 * User: wb-wangjg
 * Date: 12-4-17
 * Time: 下午3:18
 * To change this template use File | Settings | File Templates.
 */

(function () {
    var bsa = document.createElement('script');
    bsa.type = 'text/javascript';
    bsa.async = true;
    bsa.src = '//s3.buysellads.com/ac/bsa.js';
    (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(bsa);
})();