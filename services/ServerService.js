const si = require("systeminformation");
const diskusage = require('diskusage');
exports.test = (req, res) => {
    res.status(200).json({
        info: "Server Controller is working"
    })
};

exports.info = async (req, res) => {
    let serverParameters = {};
    si.cpu().then(data => {
        serverParameters.cpu = data;
    }).then(si.mem().then(data => {
        serverParameters.mem = data;
    }).then(si.currentLoad().then(data => {
        serverParameters.current = data;
    }))).then(si.networkInterfaces().then(data => {
        serverParameters.net = data;
    })).then(() =>{
        diskusage.check(process.env.IMAGE_PATH).then(data => {
            serverParameters.image = data;
        })
        diskusage.check(process.env.IMAGE_THUMBNAILS).then(data => {
            serverParameters.imageTh = data;
        })
        diskusage.check(process.env.AUDIO_PATH).then(data => {
            serverParameters.audio = data;
        })
        diskusage.check(process.env.AUDIO_THUMBNAILS).then(data => {
            serverParameters.audioTh = data;
        })
        diskusage.check(process.env.VIDEO_PATH).then(data => {
            serverParameters.video = data;
        })
        diskusage.check(process.env.VIDEO_THUMBNAILS).then(data => {
            serverParameters.videoTh = data;
        })
    }).then(() => {
        res.status(200).json({
            params: serverParameters
        })
    });
};