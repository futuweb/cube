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
    this.data[frontIndex].colors = this.getFrontRotateResult(frontIndex);
    // 上下左右面转的结果
    var rotateItems = this.getRotateItems(frontIndex);
    this.setRotateItems(frontIndex, rotateItems);
};

Cube.prototype.rotateAntiClockWise = function(frontIndex) {
    this.data[frontIndex].colors = this.getFrontRotateResult(frontIndex,true);
    // 上下左右面转的结果
    var rotateItems = this.getRotateItems(frontIndex,true);
    this.setRotateItems(frontIndex, rotateItems,true);
};
/**
 * [getFrontRotateResult 得到FrontColors转动后的结果]
 * @param  {int} frontIndex [前面的编号]
 * @param {boolean} isAntiClock [是否逆时针]
 * @return {2DArray}            [FrontColors转动后的结果]
 */
Cube.prototype.getFrontRotateResult = function(frontIndex,isAntiClock) {
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
    return resultArr;
};


// Cube.prototype.getFlankItems = function(frontIndex) {
    
// };

// Cube.prototype.rotateFlankItems = function(frontIndex) {
        
// };
// Cube.prototype.setFlankItems = function(frontIndex) {
//     // body...
// };
/**
 * [getRotateItems 得到跟着转的flank的转动信息]
 * @param  {int} frontIndex [description]
 * @param {boolean} isAntiClock [是否逆时针]
 * @return {Object}            [flank的转动信息]
 */
// 方法实现有待重构
Cube.prototype.getRotateItems = function(frontIndex,isAntiClock) {
    var directionMap = this.directionMap;
    var front = this.data[frontIndex];
    var rotateItems = {
        sideInfos: [],
        colors: []
    };
    for (var k = 0; k < directionMap.length; k++) {
        var frontDirect = directionMap[k];
        var flankIndex = front[frontDirect];
        var flank = this.data[flankIndex];
        var flankDirect;
        // 得到flankDirect
        for (var i = 0; i < directionMap.length; i++) {
            if (flank[directionMap[i]] === frontIndex) {
                flankDirect = directionMap[i];
                break;
            }
        }
        var arr = [];
        var isReverse = isAntiClock?true:false;
        var flankColors = flank.colors;
        // 获取flankColors中转动的那一列/行
        if (flankDirect === 'up') {
            for (i = 0; i < this.n; i++) {
                arr[i] = flankColors[0][i];
            }
            isReverse = isAntiClock?false:true;

        } else if (flankDirect === 'right') {
            for (i = 0; i < this.n; i++) {
                arr[i] = flankColors[i][2];
            }
            isReverse = isAntiClock?false:true;
        } else if (flankDirect === 'down') {
            for (i = 0; i < this.n; i++) {
                arr[i] = flankColors[2][i];
            }
        } else if (flankDirect === 'left') {
            for (i = 0; i < this.n; i++) {
                arr[i] = flankColors[i][0];
            }
        }
        if (isReverse) {
            arr = arr.reverse();
        }
        var sideInfo = {
            flankIndex: flankIndex,
            flankDirect: flankDirect,
            frontDirect: frontDirect,
            isReverse: isReverse
        };
        rotateItems.sideInfos.push(sideInfo);
        rotateItems.colors.push(arr);
    }
    return rotateItems;
};

/**
 * [setRotateItems 修改data中的flankColors]
 * @param {int} frontIndex  [前面的编号]
 * @param {boolean} isAntiClock [是否逆时针]
 * @param {Object} rotateItems [flank的转动信息]
 */
// 方法实现有待重构
Cube.prototype.setRotateItems = function(frontIndex, rotateItems,isAntiClock) {
    console.log(rotateItems);
    var directionMapLen = this.directionMap.length;
    var front = this.data[frontIndex];
    var sideInfos = rotateItems.sideInfos;
    var colors = rotateItems.colors;
    // 获得转动后对应的color与side的关系
    if(isAntiClock){
        var firstColor=colors.shift();
        colors.push(firstColor);
    }else{
        var lastColor = colors.pop();
        colors.unshift(lastColor);
    }
    for (var i = 0; i < sideInfos.length; i++) {
        var sideInfo = sideInfos[i];
        var flank = this.data[front[sideInfo.frontDirect]];
        var flankColors = flank.colors;
        var flankDirect = sideInfo.flankDirect;
        var frontDirect = sideInfo.frontDirect;
        var isReverse = sideInfo.isReverse;
        var color = colors[i];
        if (isReverse) {
            color = color.reverse();
        }
        if (flankDirect === 'up') {
            for (j = 0; j < this.n; j++) {
                flankColors[0][j] = color[j];
            }

        } else if (flankDirect === 'right') {
            for (j = 0; j < this.n; j++) {
                flankColors[j][2] = color[j];
            }
        } else if (flankDirect === 'down') {
            for (j = 0; j < this.n; j++) {
                flankColors[2][j] = color[j];
            }
        } else if (flankDirect === 'left') {
            for (j = 0; j < this.n; j++) {
                flankColors[j][0] = color[j];
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
cube.rotateAntiClockWise(4);
cube.logColors();