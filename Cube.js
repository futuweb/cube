function Cube(n){
    this.n=n;
    this.data=[];

    this.initData();
    console.log(this.data);
}
function create2DArray(n,initValue){
    var arr=[];
    for (var i = 0; i < n; i++) {
        var rowArr=new Array(n);
        for (var j = 0; j < n; j++) {
            // rowArr[j]=initValue;
            rowArr[j]='('+i+','+j+','+initValue+')';
        }
        arr.push(rowArr);
    }
    return arr;
}
Cube.prototype.directionMap=['up','right','down','left'];
Cube.prototype.initData = function() {
    //各面数组的初始化
    for (var i = 0; i < 6; i++) {
        var side={};
        side.colors=create2DArray(this.n,i);
        this.data.push(side);
    }
    // 各面指针的初始化
    // 0和5对面
    for(i=0;i<6;i++){
        var sideIndex=[];
        for (var j = 0; j < 3; j++) {
            if(j!==i&&j!==(5-i)){
                sideIndex.push(j);
            }
        }
        var data=this.data[i];
        data.up=sideIndex[0];
        data.down=5-sideIndex[0];
        if(i%2){
            data.right=sideIndex[1];
            data.left=5-sideIndex[1];
        }else{
            data.left=sideIndex[1];
            data.right=5-sideIndex[1];
        }
    }
};


Cube.prototype.rotateClockWise = function(frontIndex) {
    // 转的那面自身转的结果
    var frontColors=this.data[frontIndex].colors;
    var resultArr=create2DArray(this.n);
    for (var x = 0; x < this.n; x++) {
        for (var y = 0; y < this.n; y++) {
            resultArr[y][2-x]=frontColors[x][y];
        }
    }
    this.data[frontIndex].colors=resultArr;
    // 上下左右面转的结果
    var rotateItems=getRotateItems(frontIndex);
    
};
Cube.prototype.getRotateItems = function(frontIndex) {
    var directionMap=this.directionMap;
    var front=this.data[frontIndex];
    var rotateItems={
        sideInfo:[],
        colors:[]
    };
    for (var k = 0; k < directionMap.length; k++) {
        var frontDirect=directionMap[k];
        var sideIndex=side[frontDirect];
        var side=this.data[sideIndex];
        var sideDirect;
        for (var i = 0; i < directionMap.length; i++) {
            if(side[directionMap[i]]===frontIndex){
                sideDirect=directionMap[i];
                break;
            }
        }
        
        rotateItems.sideInfo.push(sideInfo);
        var arr=[];
        var isReverse=false;
        var sideColors=side.colors;
        if (sideDirect==='up') {
            for (i = 0; i < this.n; i++) {
                arr[i]=sideColors[0][i];
            }
            if(frontDirect==='right'||frontDirect==='up'){
                isReverse=true;
            }

        }else if(sideDirect==='right'){
            for (i = 0; i < this.n; i++) {
                arr[i]=sideColors[i][2];
            }
            if(frontDirect==='up'){
                isReverse=true;
            }
        }else if(sideDirect==='down'){
            for (i = 0; i < this.n; i++) {
                arr[i]=sideColors[2][i];
            }
            if(frontDirect==='left'||frontDirect==='down'){
                isReverse=true;
            }
        }else if(sideDirect==='left'){
            for (i = 0; i < this.n; i++) {
                arr[i]=sideColors[i][0];
            }
            if(frontDirect==='down'){
                isReverse=true;
            }
        }
        if(isReverse){
            arr=arr.isReverse();
        }
        var sideInfo={
            sideIndex:sideIndex,
            sideDirect:sideDirect,
            isReverse:isReverse
        };
        rotateItems.colors.push(arr);
    }
};
Cube.prototype.setRotateItems = function(rotateItems) {
};


var cube=new Cube(3);
cube.rotateClockWise(0);
console.log(cube.data[0].colors);