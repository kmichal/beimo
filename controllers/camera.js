var mongoose = require('mongoose')
  , Camera = mongoose.model('Camera');


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

exports.delete = function (req, res) {
    
}