// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        score: cc.Label,
        bj: cc.Node,
        item: cc.Node,
        countDown: cc.Node,
        sps: {
            default: [],
            type: cc.SpriteFrame
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function () {
        this.fk_w = 66;
        this.size_w = 10;
        this.size_h = 20;
        this.maps = [];
        this.currString = 0;
        this.score.string = 0;
        this.nextFk = this.createFk();
        this.currTime = 0;
        this.moveTime = 1;
        this.gameStatus = 0;
        this.beginCountDown();
    },

    // start: function () {

    // },
    //33, 693    7, -5  495,363
    createFk: function () {
        var fk = {};
        fk.type = 0;//Math.floor(Math.random() * 4);
        fk.state = 0;
        fk.items = [];
        for (var i = 0; i < 4; i++) {
            fk.items.push(this.createItem([495, 363]));
        }
        this.initFkByType(fk);
        return fk;
    },
    createItem: function (pos) {
        var node = cc.instantiate(this.item);
        node.info = {};
        node.info.x = this.size_w / 2;
        node.info.y = this.size_h;
        node.parent = this.bj;
        node.setPosition(pos[0], pos[1]);
        return node;
    },
    initFkByType: function (fk) {
        this.setFkcolor(fk);
        switch (fk.type) {
            case 0:
                //■■
                //■■
                fk.items[0].x -= this.fk_w;
                fk.items[0].info.x -= 1;

                fk.items[0].y += this.fk_w;
                fk.items[0].info.y += 1;

                fk.items[1].y += this.fk_w;
                fk.items[1].info.y += 1;

                fk.items[2].x -= this.fk_w;
                fk.items[2].info.x -= 1;
                break;
            case 1:
                // ■
                //■■■
                fk.items[0].y += this.fk_w;
                fk.items[0].info.y += 1;

                fk.items[1].x -= this.fk_w;
                fk.items[1].info.x -= 1;

                fk.items[3].x += this.fk_w;
                fk.items[3].info.x += 1;
                break;
            case 2:
                //■■
                // ■■
                fk.items[0].x -= this.fk_w;
                fk.items[0].info.x -= 1;

                fk.items[0].y += this.fk_w;
                fk.items[0].info.y += 1;

                fk.items[1].y += this.fk_w;
                fk.items[1].info.y += 1;

                fk.items[3].x += this.fk_w;
                fk.items[3].info.x += 1;
                break;
            case 3:
                //■
                //■■■
                fk.items[0].x -= this.fk_w;
                fk.items[0].info.x -= 1;

                fk.items[0].y += this.fk_w;
                fk.items[0].info.y += 1;

                fk.items[1].x -= this.fk_w;
                fk.items[1].info.x -= 1;

                fk.items[3].x += this.fk_w;
                fk.items[3].info.x += 1;
                break;
            case 4:
                //■■■■
                fk.items[0].x -= this.fk_w * 2;
                fk.items[0].info.x -= 2;

                fk.items[1].x -= this.fk_w;
                fk.items[1].info.x -= 1;

                fk.items[3].x += this.fk_w;
                fk.items[3].info.x += 1;
                break;

        }
    },
    setFkcolor: function (fk) {
        for (var i = 0; i < fk.items.length; i++) {
            fk.items[i].getComponent(cc.Sprite).spriteFrame = this.sps[fk.type];
        }
    },
    createNextFk: function () {
        this.currFk = this.nextFk;
        for (var i = 0; i < this.currFk.items.length; i++) {
            this.currFk.items[i].x -= this.fk_w * 7;
            this.currFk.items[i].y += this.fk_w * 5;
        }
        this.nextFk = this.createFk();
    },
    beginCountDown: function () {
        this.gameStatus = 1;
        this.beginTime = 3;
        this.countDown.getComponent(cc.Label).string = "游戏开始 " + this.beginTime;
    },
    fkMove: function (isDown, count) {
        if (this.checkIsMove(isDown, count)) {
            this.itemMove(isDown, count);
        }
    },
    checkIsMove: function (isDown, count) {
        for (var i = 0; i < this.currFk.items.length; i++) {
            var info = this.currFk.items[i].info;
            // cc.log("info = ", info);
            if (isDown) {
                var y = info.y + count;
                if (y < 0 || this.maps[y * this.size_w + info.x]) {
                    this.fkChange();
                    return false;
                }
            } else {
                var x = info.x + count;
                if (x < 0 || x >= this.size_w || this.maps[info.y * this.size_w + x]) {
                    return false;
                }
            }
        }
        return true;
    },
    itemMove: function (isDown, count) {
        for (var i = 0; i < this.currFk.items.length; i++) {
            if (isDown) {
                this.currFk.items[i].y += this.fk_w * count;
                this.currFk.items[i].info.y += count;
            } else {
                this.currFk.items[i].x += this.fk_w * count;
                this.currFk.items[i].info.x += count;
            }
            console.log("pos x= " + i + " " + this.currFk.items[i].info.x + " " + this.currFk.items[i].info.y);
        }
        console.log("---------------------------------------------");
    },
    fkChange: function () {
        for (var i = 0; i < this.currFk.items.length; i++) {
            var info = this.currFk.items[i].info;
            console.log("fkChange " + info.y + " " + info.x);
            this.maps[info.y * this.size_w + info.x] = this.currFk.items[i];
        }
        var self = this;
        this.checkIsScore(function () {
            self.createNextFk();
        });
    },
    checkIsScore: function (cb) {
        var indexs = [];
        var winIndexs = [];
        for (var i = 0; i < this.currFk.items.length; i++) {
            if (this.checkScore(indexs, this.currFk.items[i].info.y)) {
                winIndexs.push(this.currFk.items[i].info.y);
            };
        }
        var len = winIndexs.length;
        if (len > 0) {
            this.currString += 100 * len;
            this.score.string = this.currString;
            for (var i = 0; i < winIndexs.length; i++) {
                this.clearScoreLayer(winIndexs[i]);
            }
        }
        cb();
    },
    checkScore: function (indexs, y) {
        console.log("y = " + y);
        for (var i = 0; i < indexs.length; i++) {
            if (indexs[i] == y) {
                return false;
            }
        }
        indexs.push(y);
        for (var i = 0; i < this.size_w; i++) {
            if (!this.maps[y * this.size_w + i]) {
                console.log("pos = " + (y * this.size_w + i) + " " + this.maps[y * this.size_w + i]);
                return false;
            }
        }
        return true;
    },
    clearScoreLayer: function (y) {
        for (var i = 0; i < this.size_w; i++) {
            this.maps[y * this.size_w + i].destroy();
            this.maps[y * this.size_w + i] = null;
        }
        for (var i = (y + 1) * this.size_w; i < this.size_w * this.size_h; i++) {
            if (this.maps[i]) {
                this.maps[i - 10] = this.maps[i];
                this.maps[i] = null;
                this.maps[i - 10].y -= this.fk_w;
            }
        }
    },
    onClickLeft: function () {
        this.fkMove(false, -1);
    },
    onClickRight: function () {
        this.fkMove(false, 1);
    },
    onClickDwon: function () {
        this.fkMove(true, -1);
    },
    onClickChange: function () {
        switch (this.currFk.type) {
            case 0:
                break;
            case 1:
                this.sanJiaoChange();
                break;
            case 2:
                this.zhiZiChange();
                break;
            case 3:
                this.chuTouChange();
                break;
            case 4:
                this.tiaoChange();
                break;
        }
    },
    sanJiaoChange: function () {
        // ■
        //■■■
        switch (this.currFk.state) {
            case 0:
                if (this.itemChange(0, true, -1)) {
                    return;
                };
                if (this.itemChange(0, false, -1)) {
                    return;
                };

                if (this.itemChange(1, true, 1)) {
                    return;
                };
                if (this.itemChange(1, false, -1)) {
                    return;
                };

                if (this.itemChange(3, true, -1)) {
                    return;
                };
                if (this.itemChange(3, false, 1)) {
                    return;
                };
                break;
            case 1:
                if (this.itemChange(3, true, 1)) {
                    return;
                };
                if (this.itemChange(3, false, -1)) {
                    return;
                };
                break;
            case 2:
                if (this.itemChange(0, true, 1)) {
                    return;
                };
                if (this.itemChange(0, false, 1)) {
                    return;
                };
                break;
            case 3:
                if (this.itemChange(1, true, -1)) {
                    return;
                };
                if (this.itemChange(1, false, 1)) {
                    return;
                };
                break;
        }
        this.currFk.state++;
        if (this.currFk.state > 3) {
            this.currFk.state = 0;
        }
    },
    zhiZiChange: function () {
        //■■
        // ■■
        switch (this.currFk.state) {
            case 0:
                if (this.itemChange(2, true, -1)) {
                    return;
                };
                if (this.itemChange(3, true, -1)) {
                    return;
                };
                if (this.itemChange(3, false, 2)) {
                    return;
                };
                break;
            case 1:
                if (this.itemChange(2, true, 1)) {
                    return;
                };
                if (this.itemChange(3, true, 1)) {
                    return;
                };
                if (this.itemChange(3, false, -2)) {
                    return;
                };
                break;
        }
        this.currFk.state++;
        if (this.currFk.state > 1) {
            this.currFk.state = 0;
        }
    },
    chuTouChange: function () {
        //■
        //■■■
        switch (this.currFk.state) {
            case 0:
                if (this.itemChange(0, true, 1)) {
                    return
                };

                if (this.itemChange(3, true, -1)) {
                    return;
                };
                if (this.itemChange(3, false, 2)) {
                    return;
                };
                break;
            case 1:
                if (this.itemChange(1, false, 1)) {
                    return;
                };

                if (this.itemChange(2, true, 1)) {
                    return;
                };

                if (this.itemChange(3, true, 1)) {
                    return;
                };
                if (this.itemChange(3, false, -1)) {
                    return;
                };
                break;
            case 2:
                if (this.itemChange(0, true, -1)) {
                    return;
                };
                if (this.itemChange(0, false, 1)) {
                    return;
                };

                if (this.itemChange(2, true, -2)) {
                    return;
                };

                if (this.itemChange(3, true, -1)) {
                    return;
                };
                if (this.itemChange(3, false, 1)) {
                    return;
                };
                break;
            case 3:
                // if (this.itemChange(0, true, -1)) {
                // return;
                // };
                if (this.itemChange(0, false, -1)) {
                    return;
                };

                if (this.itemChange(1, false, -1)) {
                    return;
                };
                if (this.itemChange(2, true, 1)) {
                    return;
                };

                if (this.itemChange(3, true, 1)) {
                    return;
                };
                if (this.itemChange(3, false, -2)) {
                    return;
                };
                break;
        }
        this.currFk.state++;
        if (this.currFk.state > 3) {
            this.currFk.state = 0;
        }
    },
    tiaoChange: function () {
        //■■■■
        switch (this.currFk.state) {
            case 0:
                if (this.itemChange(0, true, 1)) {
                    return;
                };
                if (this.itemChange(0, false, 1)) {
                    return;
                };

                if (this.itemChange(2, true, -1)) {
                    return;
                };
                if (this.itemChange(2, false, 2)) {
                    return;
                };

                if (this.itemChange(3, true, -2)) {
                    return;
                };
                if (this.itemChange(3, false, 3)) {
                    return;
                };
                break;
            case 1:
                if (this.itemChange(0, true, -1)) {
                    return;
                };
                if (this.itemChange(0, false, -1)) {
                    return;
                };

                if (this.itemChange(2, true, 1)) {
                    return;
                };
                if (this.itemChange(2, false, -2)) {
                    return;
                };

                if (this.itemChange(3, true, 2)) {
                    return;
                };
                if (this.itemChange(3, false, -3)) {
                    return;
                };
                break;
        }
        this.currFk.state++;
        if (this.currFk.state > 1) {
            this.currFk.state = 0;
        }
    },
    itemChange: function (index, isX, count) {
        var info = this.currFk.items[index].info;
        if (this.maps[info.y * this.size_w + info.x]) {
            return true;
        }
        if (isX) {
            var x = this.currFk.items[index].info.x + count;
            if (x < 0 || x >= this.size_w) {
                return true;
            }
            this.currFk.items[index].x += count * this.fk_w;
            this.currFk.items[index].info.x = x;
        } else {
            var y = this.currFk.items[index].info.y + count;
            if (y < 0) {
                return true;
            }
            this.currFk.items[index].y += count * this.fk_w;
            this.currFk.items[index].info.y = y;
        }
        return false
    },
    update(dt) {
        if (this.gameStatus) {
            this.currTime += dt;
            if (this.currTime >= this.moveTime) {
                this.currTime = 0;
                if (1 == this.gameStatus) {
                    this.beginTime--;
                    this.countDown.getComponent(cc.Label).string = "游戏开始 " + this.beginTime;
                    if (0 == this.beginTime) {
                        this.gameStatus = 2;
                        this.countDown.active = false;
                        this.createNextFk();
                    }
                } else if (this.gameStatus == 2) {
                    this.fkMove(true, -1);
                }
            }
        }
    },
});
