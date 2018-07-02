var fs = require('fs');
var path = require('path');

// 直接替换源文件，一定要备份

// css文件根目录
var ROOT_DIR_PATH = './src';
var NUM_SCALE = 100;

const handleCssFile = filePath => {
    fs.readFile(filePath, 'utf8', (err, file) => {
        if (err) {
            throw new Error(err);
        }

        var matched = file.match(/[\.\d]+rem/mg);
        var fragments = file.split(/[\.\d]+rem/);
        if (!matched) {
            return;
        }
        // 最省事
        var remExpCount = matched.length;
        var result = fragments.reduce((result, frag) => {
            var remExp = matched.shift();
            result += frag;
            if (remExp) {
                result += parseFloat(remExp) * NUM_SCALE + 'rpx';
            }
            return result;
        }, '');

        fs.writeFile(filePath, result, {encoding: 'utf8'}, (err) => {
            if (!err) {
                console.log(`rem修改成功(${remExpCount}处) - ` + filePath);
            }
        });
    });
};

const traverseDir = dirPath => {
    fs.readdir(dirPath, (err, files) => {
        if (err) {
            throw new Error(err);
        }
        files.forEach(f => {
            var filePath = path.resolve(dirPath, f);
            fs.lstat(filePath, (err, stats) => {
                if (err) {
                    throw new Error(err);
                }
                if (stats.isDirectory()) {
                    traverseDir(filePath);
                }
                else if (path.extname(filePath) === '.css') {
                    handleCssFile(filePath);
                }
            });
        });
    });
};

traverseDir(ROOT_DIR_PATH);
