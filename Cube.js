// 已绕晕自己的变量定义


// data=[
//     {colors:[],
//     up:1,
//     down:2,
//     left:3,
//     right:4}
// ];
// front   前面的整面信息
// frontIndex 前面的编号
// frontColors 前面的颜色数据
// frontDirect 前面看各面的方位
// flank 侧面的整面信息
// flankIndex 侧面的编号
// flankColors 侧面的颜色数据
// flankDirect 侧面看前面的方位
// side 没有特指的一面

function Cube(n) {
    this.n = n;
    this.data = [];

    this.initData();
}

function create2DArray(n, initValue) {
    var arr = [];
    for (var i = 0; i < n; i++) {
        var rowArr = new Array(n);
        for (var j = 0; j < n; j++) {
            // rowArr[j]=initValue;
            rowArr[j] = '(' + i + ',' + j + ',' + initValue + ')';
        }
        arr.push(rowArr);
    }
    return arr;
}
Cube.prototype.directionMap = ['up', 'right', 'down', 'left'];

/**
 * [initData 初始化cube]
 * @return {[type]} [description]
 */
Cube.prototype.initData = function() {
    //各面数组的初始化
    var side;
    for (var i = 0; i < 6; i++) {
        side = {};
        side.colors = create2DArray(this.n, i);
        this.data.push(side);
    }
    // 各面指针的初始化
    // 0和5对面
    for (i = 0; i < 6; i++) {
        var sideIndexs = [];
        for (var j = 0; j < 3; j++) {
            if (j !== i && j !== (5 - i)) {
                sideIndexs.push(j);
            }
        }
        side = this.data[i];
        side.up = sideIndexs[0];
        side.down = 5 - sideIndexs[0];
        if (i % 2) {
            side.right = sideIndexs[1];
            side.left = 5 - sideIndexs[1];
        } else {
            side.left = sideIndexs[1];
            side.right = 5 - sideIndexs[1];
        }
    }
};

/**
 * [rotateClockWise 顺时针转某一面]
 * @param  {int} frontIndex [前面的编号]
 * @return {[type]}            [description]
 */
Cube.prototype.rotateClockWise = function(frontIndex) {
    this.rotateFront(frontIndex);
    this.rotateFlank(frontIndex);
};

/**
 * [rotateAntiClockWise 逆时针转某一面]
 * @param  {int} frontIndex [前面的编号]
 * @return {[type]}            [description]
 */
Cube.prototype.rotateAntiClockWise = function(frontIndex) {
    this.rotateFront(frontIndex,true);
    this.rotateFlank(frontIndex,true);
};

/**
 * [rotateFront Front转动]
 * @param  {int} frontIndex [前面的编号]
 * @param {boolean} isAntiClock [是否逆时针]
 */
Cube.prototype.rotateFront = function(frontIndex,isAntiClock) {
    // 转的那面自身转的结果
    var frontColors = this.data[frontIndex].colors;
    var resultArr = create2DArray(this.n);
    for (var x = 0; x < this.n; x++) {
        for (var y = 0; y < this.n; y++) {
            var n=this.n-1;
            if (isAntiClock) {
                resultArr[n-y][x] = frontColors[x][y];
            }else{
                resultArr[y][n - x] = frontColors[x][y];
            }
        }
    }
    this.data[frontIndex].colors=resultArr;
};

/**
 * [rotateFlank flank转动]
 * @param  {int} frontIndex [前面的编号]
 * @param {boolean} isAntiClock [是否逆时针]
 */
Cube.prototype.rotateFlank = function(frontIndex,isAntiClock) {
    var rotateItems=this.getSideItems(frontIndex);
    rotateItems=this.rotateSideItems(rotateItems,isAntiClock);
    this.setSideItems(rotateItems);
};
/**
 * [getSideItems 获取侧面要转动的信息]
 * @param  {int} frontIndex [前面的编号]
 * @return {Object}            [侧面要转动的信息]
 */
Cube.prototype.getSideItems = function(frontIndex) {
    var directionMap = this.directionMap;
    var front = this.data[frontIndex];
    var rotateItems = {
        frontIndex:frontIndex,
        sideInfos: [],
        colors: []
    };
    for (var k=0; k<directionMap.length; k++) {
        var frontDirect=directionMap[k];
        var flankIndex=front[frontDirect];
        var flank=this.data[flankIndex];
        var flankDirect;
        for (var i = 0; i < directionMap.length; i++) {
            if (flank[directionMap[i]] === frontIndex) {
                flankDirect = directionMap[i];
                break;
            }
        }
        var arr=[];
        var flankColors = flank.colors;
        // 获取flankColors中转动的那一列/行
        if (flankDirect === 'up') {
            for (i = 0; i < this.n; i++) {
                arr[i] = flankColors[0][i];
            }

        } else if (flankDirect === 'right') {
            for (i = 0; i < this.n; i++) {
                arr[i] = flankColors[i][2];
            }
        } else if (flankDirect === 'down') {
            for (i = 0; i < this.n; i++) {
                arr[i] = flankColors[2][i];
            }
        } else if (flankDirect === 'left') {
            for (i = 0; i < this.n; i++) {
                arr[i] = flankColors[i][0];
            }
        }
        var sideInfo = {
            flankIndex: flankIndex,
            flankDirect: flankDirect,
            frontDirect: frontDirect
        };
        rotateItems.sideInfos.push(sideInfo);
        rotateItems.colors.push(arr);
    }
    return rotateItems;
};

/**
 * [rotateSideItems 转动侧面]
 * @param  {Object}  rotateItems [侧面要转动的信息]
 * @param  {Boolean} isAntiClock [是否逆时针]
 * @return {Object}              [侧面转动后的信息]
 */
Cube.prototype.rotateSideItems = function(rotateItems,isAntiClock) {
    var frontIndex=rotateItems.frontIndex;
    var sideInfos=rotateItems.sideInfos;
    var colors=rotateItems.colors;
    for (var k = 0; k < sideInfos.length; k++) {
        var sideInfo=sideInfos[k];
        var isReverse=isAntiClock?true:false;
        if (sideInfo.flankDirect==='up'||sideInfo.flankDirect==='right') {
            isReverse=!isReverse;
        }
        sideInfo.isReverse=isReverse;
        if(isReverse){
            colors[k].reverse();
        }
    }
    if(isAntiClock){
        var firstColor=colors.shift();
        colors.push(firstColor);
    }else{
        var lastColor = colors.pop();
        colors.unshift(lastColor);
    }
    return rotateItems;
};

/**
 * [setSideItems 设置data转动后侧面信息]
 * @param {Object} rotateItems [侧面转动后的信息]
 */
Cube.prototype.setSideItems = function(rotateItems) {
    var front = this.data[rotateItems.frontIndex];
    var sideInfos=rotateItems.sideInfos;
    var colors=rotateItems.colors;
    for (var k = 0; k < sideInfos.length; k++) {
        var sideInfo = sideInfos[k];
        var flank = this.data[sideInfo.flankIndex];
        var flankColors = flank.colors;
        var flankDirect = sideInfo.flankDirect;
        var frontDirect = sideInfo.frontDirect;
        var isReverse = sideInfo.isReverse;
        var color = colors[k];
        if (isReverse) {
            color.reverse();
        }
        var n=this.n;
        if (flankDirect === 'up') {
            for (i = 0; i < n; i++) {
                flankColors[0][i] = color[i];
            }

        } else if (flankDirect === 'right') {
            for (i = 0; i < n; i++) {
                flankColors[i][n-1] = color[i];
            }
        } else if (flankDirect === 'down') {
            for (i = 0; i < n; i++) {
                flankColors[n-1][i] = color[i];
            }
        } else if (flankDirect === 'left') {
            for (i = 0; i < n; i++) {
                flankColors[i][0] = color[i];
            }
        }
    }
};

/**
 * [logColors 打印各面的colors，调试用]
 * @return {[type]} [description]
 */
Cube.prototype.logColors = function() {
    var sides = this.data;
    var n = this.n;
    for (var k = 0; k < sides.length; k++) {
        console.log(k);
        var side = sides[k];
        var sideColors = side.colors;
        for (var i = 0; i < n; i++) {
            console.log(sideColors[i].join(" "));
        }
    }
};

var cube = new Cube(3);
cube.rotateClockWise(4);
cube.logColors();