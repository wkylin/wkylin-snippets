/** 通过总宽度和每一格的宽度生成ui-grid
 * @param {Number} maxWidth 最大宽度
 * @param {Number} perWidth 每一格宽度(不包括margin)
 * @return {void} 无
 */
function createGrid(maxWidth, perWidth) {
    var margin = 10;
    var columns = (maxWidth + margin) / (perWidth + margin); // get the count of the columns
    for (var i = 1; i <= columns; i++) {
        console.log(".ui-grid-" + (i < 10 ? i + " " : i) + "{width:" + ((perWidth + margin) * i - margin) + "px;}");
    }
}

createGrid(990, 40);
