const fs = require('fs');

exports.res = (response, code, message) =>{
    return response.status(code).json({
        response: message
    })
};

exports.upload = ( req, res, filepath) =>{
    req.pipe(req.busboy);
    req.busboy.on('file', (fieldname, file, filename) =>{
        let fstream = fs.createWriteStream(filepath);
        file.pipe(fstream);
        fstream.on('close', () =>{
            this.res(res, 200, "Media file uploaded");
        });
    });
};

exports.removeMedia = (filepath) =>{
    fs.unlink(filepath, (err) =>{
        if(err) {
            console.log(err);
        }
    });
};

//V1 - nie mozna manipulowac czasem
/*exports.streamMedia = (response, filePath) =>{
    response.writeHead(200, {'Content-Type': 'video/mp4'});
    const streaming = fs.createReadStream(filePath);
    streaming.pipe(response);
};*/
/*V2 Możliwość manipulacji czasem*/
exports.streamMedia = (response, request, filePath) =>{
    const fileStats = fs.statSync(filePath);
    const fileSize = fileStats.size;
    const range = request.headers.range;
    if(range){
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize-1;
        const chunkSize = (end - start)+1;
        const headers = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunkSize,
            'Content-Type': 'video/mp4',
        };
        response.writeHead(206, headers);
        const toStream = fs.createReadStream(filePath, {highWaterMark: 1024 * 1024 * 2, start: start, end: end});
        toStream.pipe(response);
    }else {
        const headers = {
            'Content-Length': fileSize-1,
            'Content-Type': 'video/mp4'
        };
        response.writeHead(200, headers);
        const toStream = fs.createReadStream(filePath, {highWaterMark: 1024 * 1024 * 2});
        toStream.pipe(response);
    }
};