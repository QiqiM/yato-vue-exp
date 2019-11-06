const fs = require('fs');
const path = require('path');
const async = require('async');


const shell = module.exports;


/**
 *  mv -f src dest cb
 *  mv src dest cb
 */
shell.x_mv = function (...args) {
    let options = [];
    let src, dest, cb;
    if(args.length === 4){
        options = args[0].split(" ");
        src = args[1];
        dest = args[2];
        cb = args[3]
    }else if(args.length === 3){
        src = args[0];
        dest = args[1];
        cb = args[2]
    }else {
        cb = args.pop();
        cb(new Error('argument error'));
        return;
    }
    const srcExists = fs.existsSync(src);
    if(!srcExists){
        return cb(new Error('src not exists'));
    }
    if(fs.statSync(src).isDirectory()){
        return cb(new Error("no surport directory"))
    }

    const exists = fs.existsSync(dest);

    // Dest is an existing file, but no -f given
    if (exists &&  fs.statSync(dest).isFile() && options.indexOf("-f") === -1) {
        return cb(new Error("dest file exist"));
    }

    if (exists && fs.statSync(dest).isDirectory()) {
        dest = path.normalize(dest + '/' + path.basename(src));
    }

    fs.rename(src, dest, function (err) {
        if (err) {
            if (err.code === 'EXDEV') {
                copyFile(src, dest, function () {
                    fs.unlink(src, cb);
                });
            } else {
                cb(err);
            }
            return;
        }
        cb();
    });

};


function copyFile(src, dest, callback) {
    let readStream = fs.createReadStream(src);
    let writeStream = fs.createWriteStream(dest);

    readStream.on('error', callback);
    writeStream.on('error', callback);

    readStream.on('close', function () {
       callback();
    });
    readStream.pipe(writeStream);
}


/**
 *
 * @param src file
 * @param dest
 * @param callback
 */
shell.x_copy = function (src, dest, callback) {
    copyFile(src, dest, callback);
};

/**
 *
 * ls +s /
 * ls -l /root/*.zip
 * @param args
 */
shell.x_ls = function (...args) {
    let options,src,cb;
    if(args.length === 2){
        options = [];
        src = args[0];
        cb = args[1];
    }else if(args.length === 3){
        options = args[0].split(" ").filter(o=> o !== "");
        src = args[1];
        cb = args[2];
    }else{
        throw  new Error("ls param error");
        return;
    }

    let info = extraSrc(src);
    let filter = info.matcher;
    let baseDir = info.baseDir;

    fs.readdir(baseDir, function (err, files) {
        if(err) return cb(err);
        let list = [];
        for(let i =0; i < files.length; i++){
            if(filter.test(files[i])){
                let fullPath = path.join(baseDir, files[i]);
                if(options.indexOf("-l") > -1 || options.indexOf("-s") > -1){
                    let stats = {};
                    try{
                        stats = fs.lstatSync(fullPath);
                    }catch (e){}
                    list.push({
                        fullPath: fullPath,
                        name: files[i],
                        mode: stats.mode,
                        nlink: stats.nlink,
                        uid: stats.uid,
                        gid: stats.gid,
                        size: stats.size,
                        mtime: stats.mtime
                    });
                }else if(info.fullPath){
                    list.push(fullPath);
                }else {
                    list.push(files[i]);
                }
            }
        }

        if(options.indexOf("-s") > -1){
            list = list.sort((a, b) => b.mtime - a.mtime).map(e => e.fullPath);
        }
        cb(null, list);
    })
};

/**
 *  . | ./
 *  .. | ../
 *  /root/
 *  /root/*
 *  /root/*.zip
 * @param src
 */
function extraSrc(src){
    if(!path.isAbsolute(src)){
        src = path.join(__dirname, src);
    }
    let basename = path.basename(src);
    let basedir = path.dirname(src);
    if(!fs.existsSync(basedir)){
        throw new Error('path not exists');
    }

    if(hasMatchOP(basename)){
        return {
            fullPath: true,
            baseDir: basedir,
            matcher: getMatcher(basename),
        };
    }else {
        let stats = fs.lstatSync(src);
        if(stats.isDirectory()){
            return {
                fullPath: false,
                baseDir: src,
                matcher: /.*/,
            }
        }else{
            return {
                fullPath: false,
                baseDir: basedir,
                matcher: getMatcher(basename),
            };
        }
    }

    function hasMatchOP(s) {
        return s.indexOf("*") > -1;
    }
    
    function getMatcher(s) {
        let reg = s.replace(/\./g, "\.").replace(/\*/g, ".") + "$";
        return new RegExp(reg);
    }
}

