"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.random = random;
function random(len) {
    let option = "ahioadiaodjamndoaijdo";
    let length = option.length;
    let ans = "";
    for (let i = 0; i < length; i++) {
        ans += option[Math.floor(Math.random() * length)];
    }
    return ans;
}
//# sourceMappingURL=utils.js.map