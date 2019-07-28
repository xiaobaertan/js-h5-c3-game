window.addEventListener("load", function() {
    // 炫酷闪字
    var i = 0;
    var Color = ["skyblue", "hotpink", "pink", "#CC66CC", "red"];

    let pp = () => { //递归
        if (i > Color.length - 1) {
            i = 0
        }
        document.getElementById('finish').style.color = Color[i];
        i++;
        setTimeout(pp, 300);
    }
    pp();
    // 提示框
    var flag = true;
    document.querySelector('.btn').onclick = function() {
        if (flag) {
            document.querySelector('.bubble').style.display = 'block';
            flag = false;
        } else {
            document.querySelector('.bubble').style.display = 'none';
            flag = true;
        }

    }

    // bgm
    document.getElementById("bgAudio").volume = 0.5;
    var music = document.getElementById('audioBox');

    // 拖动音乐播放器
    var moveAudio = music => {
        let drag = false;
        let x = 0;
        let y = 0;

        music.onmousedown = function(e) {
            console.log(12);
            drag = true;
            x = e.clientX - music.offsetLeft;
            y = e.clientY - music.offsetTop;
            return false
        };
        music.onmousemove = e => {
            if (!drag) return


            let nX = e.clientX - x;
            let nY = e.clientY - y;
            let maxX = document.body.clientWidth - music.offsetWidth;
            let maxY = document.body.clientHeight - music.offsetHeight;
            nX = nX < 0 ? 0 : nX;
            nX = nX > maxX ? maxX : nX;
            nY = nY < 0 ? 0 : nY;
            nY = nY > maxY ? maxY : nY;
            music.style.marginTop = music.style.marginLeft = 0;
            music.style.left = nX + 'px';
            music.style.top = nY + 'px';
            return false
        };
        music.onmouseup = () => {
            drag = false;
        }
    }
    moveAudio(music);



    // 开始拼图逻辑
    var context = document.getElementById("canvas").getContext('2d');
    var img = new Image(); // 创建一个图片对象
    var pickPic = document.querySelector('#pic');
    var source = document.querySelector('#source');
    img.src = 'images/1.png';
    source.setAttribute("src", "images/1.png");
    img.addEventListener("load", drawTiles);
    pickPic.onchange = function() {
        initBoard();
        switch (pickPic.value) {
            case '1':
                img.src = 'images/1.png';
                source.setAttribute("src", "images/1.png");
                img.addEventListener("load", drawTiles);
                break;
            case '2':
                img.src = 'images/2.png';
                source.setAttribute("src", "images/2.png");
                img.addEventListener("load", drawTiles);
                break;
            case '3':
                img.src = 'images/3.png';
                source.setAttribute("src", "images/3.png");
                img.addEventListener("load", drawTiles);
                break;
            case '4':
                img.src = 'images/4.png';
                source.setAttribute("src", "images/4.png");
                img.addEventListener("load", drawTiles);
                break;
        }
    }

    var boardSize = document.getElementById("canvas").width; // 画板宽度
    var tileCount = document.getElementById("scale").value; // 分成几列
    var tileSize = boardSize / tileCount; // 会被分成几块
    var clickLoc = {
        x: 0,
        y: 0
    }; // 被点击图块的坐标
    var emptyLoc = {
        x: 0,
        y: 0
    }; // 白色图块的坐标
    var finish = false; // 完成与否的标记
    var boardParts = new Object(); // 创建一个画板对象
    initBoard(); // 初始化画板 改变二维数组的位置坐标 当位置坐标与二维数组的索引匹配时 拼图成功

    function initBoard() {
        boardParts = new Array(tileCount); // 创建一个tileCount行的数组
        for (var i = 0; i < tileCount; i++) {
            boardParts[i] = new Array(tileCount); // 第i行
            for (var j = 0; j < tileCount; j++) {
                boardParts[i][j] = new Object; // 给二维数组的每一个成员创建一个对象
                boardParts[i][j].x = (tileCount - 1) - i; // 随机排列图块位置
                boardParts[i][j].y = (tileCount - 1) - j;
            }
        }
        emptyLoc.x = boardParts[tileCount - 1][tileCount - 1].x; // 空白图块选择了最后一个,取了他的位置坐标
        emptyLoc.y = boardParts[tileCount - 1][tileCount - 1].y;
        finish = false;
    }
    /*    function initBoard() {
           boardParts = new Array(tileCount * tileCount); // 数组的个数
           for (let i = 0; i < tileCount * tileCount; i++) {
               boardParts[i] = i;
           }
           changeOrder(); // 数组的随机排列
       } */

    /* function sortNumber(a, b) { // 为了让 sort 根据数字的大小进行排序而设置的参数函数
        return Math.random() > 0.5 ? -1 : 1;
    } */

    // let sortNumber = (a, b) => Math.random() > 0.5 ? -1 : 1;

    /*     function changeOrder() {
            boardParts.sort(sortNumber); // 每次都会比较两个数组项,如果参数是1就换位置, -1就不换
            emptyLoc.x = 0;
            emptyLoc.y = 0;
            var finish = false;

        } */

    // 渲染图块函数
    function drawTiles() {
        context.clearRect(0, 0, boardSize, boardSize); // 清除指定区域的图像
        for (var i = 0; i < tileCount; ++i) {
            for (var j = 0; j < tileCount; ++j) {
                var x = boardParts[i][j].x; // 获取每一个图块的坐标
                var y = boardParts[i][j].y;
                if (i != emptyLoc.x || j != emptyLoc.y) { // 如果坐标是空白图块的位置,并且没完成
                    context.globalAlpha = 1;
                    context.drawImage(img, x * tileSize, y * tileSize, tileSize, tileSize,
                        i * tileSize, j * tileSize, tileSize, tileSize); // 绘制图块(图片对象, 绘制图块的左上角起始点坐标,截取绘制的宽高,画板绘制范围的左上角坐标,画板绘制范围的宽高)
                }
            }
        }
        // 成功后渐入原图
        if (finish) {
            var n = 0;
            var timer = setInterval(() => {
                n = n + .1;
                if (n > 1) {
                    n = 1;
                    clearInterval(timer);
                }
                context.clearRect(0, 0, boardSize, boardSize);
                context.globalAlpha = n;
                context.drawImage(img, 0, 0);
            }, 100)

        }
    }

    document.getElementById("scale").onchange = function() {
        tileCount = this.value;
        tileSize = boardSize / tileCount;
        initBoard();
        drawTiles();
    }
    document.getElementById("canvas").onmousemove = function(e) {
        clickLoc.x = Math.floor((e.pageX - this.offsetLeft) / tileSize); // 在横着的第几格
        clickLoc.y = Math.floor((e.pageY - this.offsetTop) / tileSize); // 在竖着的第几格
    }
    document.getElementById("canvas").onclick = function() {
        if (distance(clickLoc.x, clickLoc.y, emptyLoc.x, emptyLoc.y) == 1) {
            slideTile(emptyLoc, clickLoc);
            drawTiles(); // 显示各个拼块
        }
        if (finish) {
            setTimeout(function() {
                document.getElementById('finish').style.display = 'block';
            }, 500);
            setTimeout(function() {
                document.body.onclick = function() {
                    location.reload();
                }
            }, 500);
        }
    }
    // 放弃重来按钮
    document.querySelector('.giveup').onclick = function(){
        initBoard();
        drawTiles();
    }

    // 计算空白块与将移动块之间的距离 要么行相同 要么列相同 取绝对值
    let distance = (x1, y1, x2, y2) => Math.abs(x1 - x2) + Math.abs(y1 - y2)

    function slideTile(emptyLoc, fromLoc) {
        if (!finish) {
            boardParts[emptyLoc.x][emptyLoc.y].x = boardParts[clickLoc.x][clickLoc.y].x;
            boardParts[emptyLoc.x][emptyLoc.y].y = boardParts[clickLoc.x][clickLoc.y].y;
            boardParts[clickLoc.x][clickLoc.y].x = tileCount - 1;
            boardParts[clickLoc.x][clickLoc.y].y = tileCount - 1;
            emptyLoc.x = clickLoc.x;
            emptyLoc.y = clickLoc.y;
            checkSolved();
        }
    }


    function checkSolved() { // 检查索引与图块坐标是否一致
        var flag = true;
        for (var i = 0; i < tileCount; ++i) {
            for (var j = 0; j < tileCount; ++j) {
                if (boardParts[i][j].x != i || boardParts[i][j].y != j) {
                    flag = false;
                }
            }
        }
        finish = flag;
    }

})