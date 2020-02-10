const fs = require('fs');
const checkDiskSpace = require('check-disk-space');
const sharp = require("sharp");
exports.res = (response, code, message) =>{
    return response.status(code).json({
        response: message
    })
};
exports.checkFreeSpace = (req, res, uploadDir, fileInBytes) => {
    checkDiskSpace(process.env.PRJ_PATH + uploadDir)
        .then( diskSpace =>{
            if(fileInBytes >= diskSpace + 1024*1024*1024*50 /*50MB Buffer*/){
                this.res(res, 400, "Cannot upload media, not enough space!");
            }
        })
        .catch(error =>{
            this.res(res, 500, "Cannot check free storage " + error);
        })
};

exports.upload = ( req, res, filepath) =>{
    req.pipe(req.busboy);
    let startUpload = Date.now();
    console.log('Start uploading at ' + startUpload.toString());
    req.busboy.on('file', (fieldname, file, filename) =>{
        let writeStream = fs.createWriteStream(filepath);
        file.pipe(writeStream);
        writeStream.on('close', () =>{
            let fileName = filepath.split("/")[filepath.split("/").length-1];
            if(
                filepath.includes("video_thumbnails") ||
                filepath.includes("audio_thumbnails")
            ){
                let OUT = '';
                filepath.includes('audio_thumbnails') ?  OUT = process.env.AUDIO_THUMBNAILS :  OUT = process.env.VIDEO_THUMBNAILS;
                sharp(OUT+fileName)
                    .resize(800, 800, {
                        fit: sharp.fit.inside,
                        withoutEnlargement: true
                    })
                    .toFormat('jpeg')
                    .toBuffer()
                    .then(function(outputBuffer) {
                        fs.writeFileSync(OUT+fileName, outputBuffer, (error) =>{
                            if(error){
                                console.log(error);
                                throw error;
                            }else{
                                console.log("image thumbnail has been replaced")
                            }
                        })
                    });
            }else if(filepath.includes("/images/")){
                sharp(filepath)
                    .resize(320).toFile(process.env.IMAGE_THUMBNAILS + fileName, (err) =>{
                    if(!err){
                        console.log("thumbnail created")
                    }else{
                        console.log(err)
                    }
                })
            }
            let endTime = Date.now();
            let uploadTime = (endTime - startUpload)/1000;
            console.log('Uploading finished at ' + endTime.toString());
            console.log(filepath+ ' upload time ' + uploadTime.toString() + 's');
            this.res(res, 200, "Media file uploaded");
        });
    });
};

exports.removeMedia = (filepath) =>{
    fs.unlink(filepath, (err) =>{
        if(err) {
            console.log(err);
        }else{
            console.log("media removed from server")
        }
    });
};

exports.renameMedia = (oldPath, newPath ) => {
    if(!fs.existsSync(oldPath)){
        return "File does not exist";
    }
    fs.rename(oldPath, newPath, (err) => {
        if(err){
            console.log(err);
            return "Cannot delete media file";
        }
    });
    return "New path to media file: " + newPath;
};

//V1 - nie mozna manipulowac czasem
/*exports.streamMedia = (response, filePath) =>{
    response.writeHead(200, {'Content-Type': 'video/mp4'});
    const streaming = fs.createReadStream(filePath);
    streaming.pipe(response);
};*/
/*V2 Możliwość manipulacji czasem*/
exports.streamMedia = (response, request, filePath, contentType) =>{
    const fileStats = fs.statSync(filePath);
    const fileSize = fileStats.size;
    const range = request.headers.range;
    try {
        if (range) {
            const parts = range.replace(/bytes=/, "").split("-");
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
            const chunkSize = (end - start) + 1;
            const headers = {
                'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunkSize,
                'Content-Type': contentType,
            };
            response.writeHead(206, headers);
            const toStream = fs.createReadStream(filePath, {highWaterMark: 1024 * 1024 * 2, start: start, end: end});
            toStream.pipe(response);
        } else {
            const headers = {
                'Content-Length': fileSize - 1,
                'Content-Type': contentType
            };
            response.writeHead(200, headers);
            const toStream = fs.createReadStream(filePath, {highWaterMark: 1024 * 1024 * 2});
            toStream.pipe(response);
        }
    }catch(error){
        console.log(error)
    }
};