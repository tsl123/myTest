window.__require = function t(e, i, s) {
function n(a, o) {
if (!i[a]) {
if (!e[a]) {
var c = a.split("/");
c = c[c.length - 1];
if (!e[c]) {
var h = "function" == typeof __require && __require;
if (!o && h) return h(c, !0);
if (r) return r(c, !0);
throw new Error("Cannot find module '" + a + "'");
}
}
var l = i[a] = {
exports: {}
};
e[a][0].call(l.exports, function(t) {
return n(e[a][1][t] || t);
}, l, l.exports, t, e, i, s);
}
return i[a].exports;
}
for (var r = "function" == typeof __require && __require, a = 0; a < s.length; a++) n(s[a]);
return n;
}({
HelloWorld: [ function(t, e, i) {
"use strict";
cc._RF.push(e, "280c3rsZJJKnZ9RqbALVwtK", "HelloWorld");
cc.Class({
extends: cc.Component,
properties: {
label: {
default: null,
type: cc.Label
},
text: "Hello, World!"
},
onLoad: function() {
this.label.string = this.text;
},
update: function(t) {}
});
cc._RF.pop();
}, {} ],
HotUpdate: [ function(t, e, i) {
"use strict";
cc._RF.push(e, "4ba09UyeJZNf4HuU3EM/8cO", "HotUpdate");
cc.Class({
extends: cc.Component,
properties: {
manifestUrl: {
type: cc.Asset,
default: null
},
_updating: !1,
_canRetry: !1,
btn_update: cc.Node,
btn_login: cc.Node,
label: cc.Label,
progressBar: cc.ProgressBar,
_storagePath: ""
},
checkCb: function(t) {
cc.log("Code: " + t.getEventCode());
switch (t.getEventCode()) {
case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
cc.log("No local manifest file found, hot update skipped.");
break;

case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
cc.log("Fail to download manifest file, hot update skipped.");
break;

case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
console.log("Already up to date with the latest remote version.!!!");
var e = localStorage.getItem("fk_game_type");
console.log("gameType is " + e);
if (e && "true" == e) {
this.btn_login.active = !0;
e = localStorage.setItem("fk_game_type", !1);
} else this.gameRestart();
break;

case jsb.EventAssetsManager.NEW_VERSION_FOUND:
console.log("New version found, please try to update.");
this.btn_update.active = !0;
break;

default:
return;
}
cc.eventManager.removeListener(this._checkListener);
this._checkListener = null;
this._updating = !1;
},
loginGame: function() {
cc.director.loadScene("gameScene");
},
updateCb: function(t) {
var e = !1, i = !1;
switch (t.getEventCode()) {
case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
console.log("No local manifest file found, hot update skipped...");
i = !0;
break;

case jsb.EventAssetsManager.UPDATE_PROGRESSION:
console.log(t.getPercent());
console.log(t.getPercentByFile());
console.log(t.getDownloadedFiles() + " / " + t.getTotalFiles());
console.log(t.getDownloadedBytes() + " / " + t.getTotalBytes());
this.label.string = t.getDownloadedFiles() + " / " + t.getTotalFiles();
this.progressBar.progress = t.getDownloadedFiles() / t.getTotalFiles();
var s = t.getMessage();
s && console.log("Updated file: " + s);
break;

case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
console.log("Fail to download manifest file, hot update skipped.");
i = !0;
break;

case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
console.log("Already up to date with the latest remote version.");
i = !0;
break;

case jsb.EventAssetsManager.UPDATE_FINISHED:
console.log("Update finished. " + t.getMessage());
e = !0;
break;

case jsb.EventAssetsManager.UPDATE_FAILED:
console.log("Update failed. " + t.getMessage());
this._updating = !1;
this._canRetry = !0;
break;

case jsb.EventAssetsManager.ERROR_UPDATING:
console.log("Asset update error: " + t.getAssetId() + ", " + t.getMessage());
break;

case jsb.EventAssetsManager.ERROR_DECOMPRESS:
console.log(t.getMessage());
}
if (i) {
this._am.setEventCallback(null);
this._updateListener = null;
this._updating = !1;
}
console.log("needRestart = " + e);
e && this.gameRestart();
},
gameRestart: function() {
cc.sys.localStorage.setItem("fk_game_type", !0);
this._am.setEventCallback(null);
this._updateListener = null;
var t = jsb.fileUtils.getSearchPaths();
console.log("searchPaths  is " + t);
var e = this._am.getLocalManifest().getSearchPaths();
cc.log(JSON.stringify(e));
Array.prototype.unshift(t, e);
cc.sys.localStorage.setItem("HotUpdateSearchPaths", JSON.stringify(t));
jsb.fileUtils.setSearchPaths(t);
cc.audioEngine.stopAll();
cc.game.restart();
},
retry: function() {
if (!this._updating && this._canRetry) {
this._canRetry = !1;
cc.log("Retry failed Assets...");
this._am.downloadFailedAssets();
}
},
checkForUpdate: function() {
if (this._updating) console.log("Checking or updating ..."); else {
if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
var t = this.manifestUrl.nativeUrl;
cc.loader.md5Pipe && (t = cc.loader.md5Pipe.transformURL(t));
console.log("url is " + t);
this._am.loadLocalManifest(t);
}
if (this._am.getLocalManifest() && this._am.getLocalManifest().isLoaded()) {
this._am.setEventCallback(this.checkCb.bind(this));
this._am.checkUpdate();
this._updating = !0;
} else console.log("Failed to load local manifest ...");
}
},
hotUpdate: function() {
this.btn_update.active = !1;
if (this._am && !this._updating) {
this._am.setEventCallback(this.updateCb.bind(this));
if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
var t = this.manifestUrl.nativeUrl;
cc.loader.md5Pipe && (t = cc.loader.md5Pipe.transformURL(t));
console.log("hotUpdate url is " + t);
this._am.loadLocalManifest(t);
}
this._failCount = 0;
this._am.update();
this._updating = !0;
}
},
show: function() {},
onLoad: function() {
this.btn_update.active = !1;
this.btn_login.active = !1;
this.progressBar.progress = 0;
if (cc.sys.isNative) {
this._storagePath = (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : "/") + "fk_remote-assets";
console.log("Storage path for remote asset : " + this._storagePath);
this.versionCompareHandle = function(t, e) {
console.log("JS Custom Version Compare: version A is " + t + ", version B is " + e);
for (var i = t.split("."), s = e.split("."), n = 0; n < i.length; ++n) {
var r = parseInt(i[n]), a = parseInt(s[n] || 0);
if (r !== a) return r - a;
}
return s.length > i.length ? -1 : 0;
};
this._am = new jsb.AssetsManager("", this._storagePath, this.versionCompareHandle);
this._am.setVerifyCallback(function(t, e) {
var i = e.compressed, s = e.md5, n = e.path;
e.size;
if (i) {
console.log("Verification passed : " + n);
return !0;
}
console.log("Verification passed : " + n + " (" + s + ")");
return !0;
});
console.log("Hot update is ready, please check or directly update.");
if (cc.sys.os === cc.sys.OS_ANDROID) {
this._am.setMaxConcurrentTask(2);
console.log("Max concurrent tasks count have been limited to 2");
}
var t = this;
setTimeout(function() {
t.checkForUpdate();
}, .1);
}
},
onDestroy: function() {
if (this._updateListener) {
this._am.setEventCallback(null);
this._updateListener = null;
}
}
});
cc._RF.pop();
}, {} ],
game: [ function(t, e, i) {
"use strict";
cc._RF.push(e, "d447doMRbhMSL+GXRE3ncke", "game");
cc.Class({
extends: cc.Component,
properties: {
score: cc.Label,
bj: cc.Node,
item: cc.Node,
countDown: cc.Node,
allScoreNode: cc.Node,
beginBtn: cc.Node,
allBtns: {
default: [],
type: cc.Button
},
sps: {
default: [],
type: cc.SpriteFrame
}
},
onLoad: function() {
var t = this;
this.fk_w = 66;
this.size_w = 10;
this.size_h = 20;
this.maps = [];
this.currString = 0;
this.score.string = 0;
this.currTime = 0;
this.moveTime = 1;
this.gameStatus = 0;
this.btnIndex = -1;
this.isHengPing = !0;
this.beginCountDown();
this.allBtns.forEach(function(e, i) {
e.index = i;
t.bindBtn(e, function(e, i) {
t.onClickBtn(e, i);
});
});
},
bindBtn: function(t, e) {
t.node.on(cc.Node.EventType.TOUCH_START, function() {
e(t.index, cc.Node.EventType.TOUCH_START);
});
t.node.on(cc.Node.EventType.TOUCH_MOVE, function() {
e(t.index, cc.Node.EventType.TOUCH_MOVE);
});
t.node.on(cc.Node.EventType.TOUCH_CANCEL, function() {
e(t.index, cc.Node.EventType.TOUCH_CANCEL);
});
t.node.on(cc.Node.EventType.TOUCH_END, function() {
e(t.index, cc.Node.EventType.TOUCH_END);
});
},
onClickBtn: function(t, e) {
switch (t) {
case 0:
if (e == cc.Node.EventType.TOUCH_START) {
this.onClickLeft();
this.btnIndex = 0;
this.moveDelyTime = this.moveTime / 2;
this.delyTime = 0;
}
break;

case 1:
if (e == cc.Node.EventType.TOUCH_START) {
this.onClickRight();
this.btnIndex = 1;
this.moveDelyTime = this.moveTime / 2;
this.delyTime = 0;
}
break;

case 2:
if (e == cc.Node.EventType.TOUCH_START) {
this.onClickDwon();
this.btnIndex = 2;
this.moveDelyTime = this.moveTime / 2;
this.delyTime = 0;
}
break;

case 3:
e == cc.Node.EventType.TOUCH_START && this.onClickChange();
}
if (e == cc.Node.EventType.TOUCH_END && t == this.btnIndex) {
this.allBtns[0].unscheduleAllCallbacks();
this.btnIndex = -1;
}
},
createFk: function() {
var t = {};
t.type = Math.floor(5 * Math.random());
t.state = 0;
t.items = [];
for (var e = 0; e < 4; e++) t.items.push(this.createItem([ 495, 363 ]));
this.initFkByType(t);
return t;
},
createItem: function(t) {
var e = cc.instantiate(this.item);
e.info = {};
e.info.x = this.size_w / 2;
e.info.y = this.size_h;
e.parent = this.bj;
e.setPosition(t[0], t[1]);
return e;
},
initFkByType: function(t) {
this.setFkcolor(t);
switch (t.type) {
case 0:
t.items[0].x -= this.fk_w;
t.items[0].info.x -= 1;
t.items[0].y += this.fk_w;
t.items[0].info.y += 1;
t.items[1].y += this.fk_w;
t.items[1].info.y += 1;
t.items[2].x -= this.fk_w;
t.items[2].info.x -= 1;
break;

case 1:
t.items[0].y += this.fk_w;
t.items[0].info.y += 1;
t.items[1].x -= this.fk_w;
t.items[1].info.x -= 1;
t.items[3].x += this.fk_w;
t.items[3].info.x += 1;
break;

case 2:
t.items[0].x -= this.fk_w;
t.items[0].info.x -= 1;
t.items[0].y += this.fk_w;
t.items[0].info.y += 1;
t.items[1].y += this.fk_w;
t.items[1].info.y += 1;
t.items[3].x += this.fk_w;
t.items[3].info.x += 1;
break;

case 3:
t.items[0].x -= this.fk_w;
t.items[0].info.x -= 1;
t.items[0].y += this.fk_w;
t.items[0].info.y += 1;
t.items[1].x -= this.fk_w;
t.items[1].info.x -= 1;
t.items[3].x += this.fk_w;
t.items[3].info.x += 1;
break;

case 4:
t.items[0].x -= 2 * this.fk_w;
t.items[0].info.x -= 2;
t.items[1].x -= this.fk_w;
t.items[1].info.x -= 1;
t.items[3].x += this.fk_w;
t.items[3].info.x += 1;
}
},
setFkcolor: function(t) {
for (var e = 0; e < t.items.length; e++) t.items[e].getComponent(cc.Sprite).spriteFrame = this.sps[t.type];
},
createNextFk: function() {
this.currFk = this.nextFk;
for (var t = 0; t < this.currFk.items.length; t++) {
this.currFk.items[t].x -= 7 * this.fk_w;
this.currFk.items[t].y += 5 * this.fk_w;
}
this.nextFk = this.createFk();
},
beginCountDown: function() {
cc.log("beginCountDown");
if (this.currFk) {
this.currFk.items.forEach(function(t, e) {
t && t.destroy();
});
this.currFk.items = [];
}
if (this.nextFk) {
this.nextFk.items.forEach(function(t, e) {
t && t.destroy();
});
this.nextFk.items = [];
}
this.maps.forEach(function(t, e) {
if (t) {
t.destroy();
t = null;
}
});
this.nextFk = this.createFk();
this.gameStatus = 1;
this.beginTime = 3;
this.countDown.getComponent(cc.Label).string = "游戏开始 " + this.beginTime;
this.countDown.active = !0;
this.allScoreNode.active = !1;
this.beginBtn.active = !1;
},
fkMove: function(t, e) {
this.checkIsMove(t, e) && this.itemMove(t, e);
},
checkIsMove: function(t, e) {
for (var i = 0; i < this.currFk.items.length; i++) {
var s = this.currFk.items[i].info;
if (t) {
var n = s.y + e;
if (n < 0 || this.maps[n * this.size_w + s.x]) {
this.fkChange();
return !1;
}
} else {
var r = s.x + e;
if (r < 0 || r >= this.size_w || this.maps[s.y * this.size_w + r]) return !1;
}
}
return !0;
},
itemMove: function(t, e) {
for (var i = 0; i < this.currFk.items.length; i++) if (t) {
this.currFk.items[i].y += this.fk_w * e;
this.currFk.items[i].info.y += e;
} else {
this.currFk.items[i].x += this.fk_w * e;
this.currFk.items[i].info.x += e;
}
},
fkChange: function() {
var t = this;
if (this.currFk.items.find(function(e) {
return e.info.y >= t.size_h;
})) this.gameOver(); else {
this.btnIndex = -1;
for (var e = 0; e < this.currFk.items.length; e++) {
var i = this.currFk.items[e].info;
this.maps[i.y * this.size_w + i.x] = this.currFk.items[e];
}
t = this;
this.checkIsScore(function() {
t.createNextFk();
});
}
},
checkIsScore: function(t) {
for (var e = [], i = [], s = 0; s < this.currFk.items.length; s++) this.checkScore(e, this.currFk.items[s].info.y) && i.push(this.currFk.items[s].info.y);
var n = i.length;
if (n > 0) {
this.currString += 100 * n;
this.score.string = this.currString;
this.clearScoreLayer(i);
}
t();
},
checkScore: function(t, e) {
for (var i = 0; i < t.length; i++) if (t[i] == e) return !1;
t.push(e);
for (i = 0; i < this.size_w; i++) if (!this.maps[e * this.size_w + i]) return !1;
return !0;
},
clearScoreLayer: function(t) {
if (!(t.length <= 0)) {
var e = this, i = -1;
t.forEach(function(t) {
for (var s = 0; s < e.size_w; s++) {
e.maps[t * e.size_w + s].destroy();
e.maps[t * e.size_w + s] = null;
}
t > i && (i = t);
});
for (var s = (i + 1) * this.size_w; s < this.size_w * this.size_h; s++) if (this.maps[s]) {
this.maps[s - 10 * t.length] = this.maps[s];
this.maps[s] = null;
this.maps[s - 10 * t.length].y -= this.fk_w * t.length;
}
}
},
onclickbeginGame: function() {
this.beginCountDown();
},
onClickLeft: function() {
this.fkMove(!1, -1);
},
onClickRight: function() {
this.fkMove(!1, 1);
},
onClickDwon: function() {
this.fkMove(!0, -1);
},
onClickChange: function() {
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
}
},
sanJiaoChange: function() {
switch (this.currFk.state) {
case 0:
if (this.itemChange(0, !0, -1)) return;
if (this.itemChange(0, !1, -1)) return;
if (this.itemChange(1, !0, 1)) return;
if (this.itemChange(1, !1, -1)) return;
if (this.itemChange(3, !0, -1)) return;
if (this.itemChange(3, !1, 1)) return;
break;

case 1:
if (this.itemChange(3, !0, 1)) return;
if (this.itemChange(3, !1, -1)) return;
break;

case 2:
if (this.itemChange(0, !0, 1)) return;
if (this.itemChange(0, !1, 1)) return;
break;

case 3:
if (this.itemChange(1, !0, -1)) return;
if (this.itemChange(1, !1, 1)) return;
}
this.currFk.state++;
this.currFk.state > 3 && (this.currFk.state = 0);
},
zhiZiChange: function() {
switch (this.currFk.state) {
case 0:
if (this.itemChange(2, !0, -1)) return;
if (this.itemChange(3, !0, -1)) return;
if (this.itemChange(3, !1, 2)) return;
break;

case 1:
if (this.itemChange(2, !0, 1)) return;
if (this.itemChange(3, !0, 1)) return;
if (this.itemChange(3, !1, -2)) return;
}
this.currFk.state++;
this.currFk.state > 1 && (this.currFk.state = 0);
},
chuTouChange: function() {
switch (this.currFk.state) {
case 0:
if (this.itemChange(0, !0, 1)) return;
if (this.itemChange(3, !0, -1)) return;
if (this.itemChange(3, !1, 2)) return;
break;

case 1:
if (this.itemChange(1, !1, 1)) return;
if (this.itemChange(2, !0, 1)) return;
if (this.itemChange(3, !0, 1)) return;
if (this.itemChange(3, !1, -1)) return;
break;

case 2:
if (this.itemChange(0, !0, -1)) return;
if (this.itemChange(0, !1, 1)) return;
if (this.itemChange(2, !0, -2)) return;
if (this.itemChange(3, !0, -1)) return;
if (this.itemChange(3, !1, 1)) return;
break;

case 3:
if (this.itemChange(0, !1, -1)) return;
if (this.itemChange(1, !1, -1)) return;
if (this.itemChange(2, !0, 1)) return;
if (this.itemChange(3, !0, 1)) return;
if (this.itemChange(3, !1, -2)) return;
}
this.currFk.state++;
this.currFk.state > 3 && (this.currFk.state = 0);
},
tiaoChange: function() {
switch (this.currFk.state) {
case 0:
if (this.itemChange(0, !0, 1)) return;
if (this.itemChange(0, !1, 1)) return;
if (this.itemChange(2, !0, -1)) return;
if (this.itemChange(2, !1, 2)) return;
if (this.itemChange(3, !0, -2)) return;
if (this.itemChange(3, !1, 3)) return;
break;

case 1:
if (this.itemChange(0, !0, -1)) return;
if (this.itemChange(0, !1, -1)) return;
if (this.itemChange(2, !0, 1)) return;
if (this.itemChange(2, !1, -2)) return;
if (this.itemChange(3, !0, 2)) return;
if (this.itemChange(3, !1, -3)) return;
}
this.currFk.state++;
this.currFk.state > 1 && (this.currFk.state = 0);
},
itemChange: function(t, e, i) {
var s = this.currFk.items[t].info;
if (this.maps[s.y * this.size_w + s.x]) return !0;
if (e) {
var n = this.currFk.items[t].info.x + i;
if (n < 0 || n >= this.size_w) return !0;
this.currFk.items[t].x += i * this.fk_w;
this.currFk.items[t].info.x = n;
} else {
var r = this.currFk.items[t].info.y + i;
if (r < 0) return !0;
this.currFk.items[t].y += i * this.fk_w;
this.currFk.items[t].info.y = r;
}
return !1;
},
update: function(t) {
if (this.gameStatus) {
this.currTime += t;
if (this.currTime >= this.moveTime) {
this.currTime = 0;
if (1 == this.gameStatus) {
this.beginTime--;
this.countDown.getComponent(cc.Label).string = "游戏开始 " + this.beginTime;
if (0 == this.beginTime) {
this.gameStatus = 2;
this.countDown.active = !1;
this.createNextFk();
}
} else 2 == this.gameStatus && this.fkMove(!0, -1);
}
if (this.btnIndex >= 0) {
this.delyTime += t;
if (this.delyTime >= this.moveDelyTime) {
this.delyTime = 0;
this.moveDelyTime /= 2;
switch (this.btnIndex) {
case 0:
this.onClickLeft();
break;

case 1:
this.onClickRight();
break;

case 2:
this.onClickDwon();
}
}
}
}
},
gameOver: function() {
this.countDown.active = !1;
this.gameStatus = 0;
this.delyTime = 0;
this.btnIndex = -1;
this.allScoreNode.getComponent(cc.Label).string = "总得分：\n" + this.score.string;
this.beginBtn.active = !0;
this.allScoreNode.active = !0;
},
onClickQiePing: function() {
this.isHengPing = !this.isHengPing;
this.changeRootViewController(this.isHengPing);
this.isHengPing ? cc.director.loadScene("gameScene") : cc.director.loadScene("testScene");
},
changeRootViewController: function(t) {
return cc.sys.os == cc.sys.OS_IOS ? jsb.reflection.callStaticMethod("AppController", "changeOrienttationH:", t) : cc.sys.os == cc.sys.OS_ANDROID ? jsb.reflection.callStaticMethod("org.cocos2dx.javascript/AppActivity", "changeOrientationH", "(Z)V", t) : void 0;
}
});
cc._RF.pop();
}, {} ],
loginSCript: [ function(t, e, i) {
"use strict";
cc._RF.push(e, "64678+xuQpJw5DaWIF8anXN", "loginSCript");
cc.Class({
extends: cc.Component,
properties: {},
start: function() {}
});
cc._RF.pop();
}, {} ],
testScript: [ function(t, e, i) {
"use strict";
cc._RF.push(e, "76085ab+KVLGJqPwMMdaTq2", "testScript");
cc.Class({
extends: cc.Component,
properties: {},
onLoad: function() {
this.isHengPing = !1;
},
start: function() {},
onClickQiePing: function() {
this.isHengPing = !this.isHengPing;
this.changeRootViewController(this.isHengPing);
this.isHengPing ? cc.director.loadScene("gameScene") : cc.director.loadScene("testScene");
},
changeRootViewController: function(t) {
return cc.sys.os == cc.sys.OS_IOS ? jsb.reflection.callStaticMethod("AppController", "changeOrienttationH:", t) : cc.sys.os == cc.sys.OS_ANDROID ? jsb.reflection.callStaticMethod("org.cocos2dx.javascript/AppActivity", "changeOrientationH", "(Z)V", t) : void 0;
}
});
cc._RF.pop();
}, {} ]
}, {}, [ "HelloWorld", "HotUpdate", "game", "loginSCript", "testScript" ]);