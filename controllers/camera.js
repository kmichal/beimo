var mongoose = require('mongoose')
  , Camera = mongoose.model('Camera')
  , EventFile = mongoose.model('EventFile')
  , request = require('request')
  , util    = require('util')
  , fs      = require('fs')
  , basicAuth = require('basic-auth')
  , utils   = require('../config/utils')
  , config  = require('../config/config') ;



exports.load = function(req, res, next, cameraid){
    var Camera = mongoose.model('Camera');

    Camera.findOne({_id:cameraid}, function (err, camera) {
        if (err) return next(err);
        if (!camera) return next(new Error('not found'));
        req.camera = camera;
        next();
    })
}


 exports.add = function (req, res) {
 	var newcam = new Camera();

 	console.log(req.body.nickname);

 	newcam.cameraid 	= req.body.cameraid;
    newcam.nickname 	= req.body.nickname;
    newcam.ipaddress 	= req.body.ipaddress;
    newcam.usingMotion 	= req.body.usingmotion;
    newcam.motionDir 	= req.body.motiondir;
    newcam.liveMotion 	= req.body.livemotion;
    newcam.liveimgUrl  	= req.body.liveimgurl;

    newcam.genUploadCreds();

    newcam.save(function(err) {
        if (err)
        {
            throw err;
            res.json(err);
        }
    });


 	res.json({message: "ok"});
 } 
 
 exports.getAll = function (callback) {
    Camera.find().exec(callback);
}

exports.getLiveImg = function (req, res)
{
    reqUrl = 'http://' + req.camera.ipaddress + req.camera.liveimgUrl;

    if (typeof req.camera.camusername != "undefined") {
        request.get(reqUrl).auth(req.camera.camusername, req.camera.campassword, false).pipe(res);
    }
    else {
        request.get(reqUrl).pipe(res);
    }


}

exports.addImage = function (req, res)
{

    var camid = '537d55231499739f37edb9a3'; //test


    var auth = basicAuth(req);
    var img_path = config.imagepath();
    var filename = '';
    
    //if (auth) { //The camera sent us credentials
       // console.log(auth);



        if (typeof req.headers['content-type'] != 'undefined' && req.headers['content-type'] == 'image/jpeg' ) 
        {
            var filename = utils.getFilenameFromHeader(req.headers['content-disposition']);

            var dst = fs.createWriteStream(img_path + filename);
            req.pipe(dst);
            
            req.on('end', function(){
                //Once file is saved end the necessary record in the database
                eventfile = new EventFile();
                eventfile.cameraid = camid;
                eventfile.time = Date();
                eventfile.filename = filename;

                eventfile.save(function(err) 
                {
                    if (err)
                    {
                        throw err;
                        console.log(err);
                    }
                });

                filename = null;
                dst = null;
                res.send('Upload OK\r\n');
                
            });
            dst.on('error', function (err) {
                console.log(err);
            });

        }

        console.log(filename);

   // }
   // else { //If the camera did not send credentials send 401 status code

    //    res.statusCode = 401;
    //    res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"');
    //    res.end('<html><body>Username & Password Required</body></html>');
    //}


}
exports.getConfigInfo = function (req, res)
{
    var config = {
        "message": "ok",
        "Nickname": req.camera.nickname,
        "IP Address": req.camera.ipaddress,
        "Managed by Motion": req.camera.usingMotion,
        "Use Motion for Live View": req.camera.liveMotion,
        "Camera Admin Username": req.camera.camusername,
        "Camera Admin Password": req.camera.campassword,
        "Path to Camera Images": req.camera.motionDir,
        "Upload Username": req.camera.uploadUsername,
        "Upload Password": req.camera.uploadPassword,
        "Internal ID": req.camera._id
        };
        
   
    res.json(config);   

}

exports.delete = function (req, res) {
    req.camera.remove(function(err){
        res.json({message: 'ok'});
    });

}