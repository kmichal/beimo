var mongoose = require('mongoose')
  , Camera = mongoose.model('Camera')
  , request = require('request');



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

    newcam.save(function(err) {
        if (err)
        {
            throw err;
            res.json(err);
        }	//res.redirect('/configure');
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

exports.delete = function (req, res) {
    req.camera.remove(function(err){
        res.json({message: 'ok'});
    });

}