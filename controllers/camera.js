var mongoose = require('mongoose')
  , Camera = mongoose.model('Camera')
  , EventFile = mongoose.model('EventFile')
  , request = require('request')
  , util    = require('util')
  , fs      = require('fs')
  , basicAuth = require('basic-auth')
  , utils   = require('../config/utils')
  , config  = require('../config/config');



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
    var options = {
        url: 'http://' + req.camera.ipaddress + req.camera.liveimgUrl,
        timeout: 1000
    }

    if (typeof req.camera.camusername != "undefined") {
        request.get(options, function (error, response, body) {
        	if (error) {

                res.writeHead(200, {'Content-Type': 'image/jpeg' });
                res.end(fs.readFileSync(__dirname + '/../public/img/beimo_error.jpg'), 'binary');
        		console.log('Could not connect to camera.' + req.camera.nickname + '@' + req.camera.ipaddress);
        	}
    	}).auth(req.camera.camusername, req.camera.campassword, false).pipe(res);
    }
    else 
    {
        request.get(options, function (error, response, body) {
        	if (!error && response.statusCode == 200) {
        		pipe(res);
            }
            else
            {
                res.writeHead(200, {'Content-Type': 'image/jpeg' });
                res.end(fs.readFileSync(__dirname + '/../public/img/beimo_error.jpg'), 'binary');
                console.log('Could not connect to camera.' + req.camera.nickname + '@' + req.camera.ipaddress);
                 
            }
        });
    }

}

exports.addImageAuth = function (req, res)
{


    var camera = mongoose.model('Camera');


    var auth = basicAuth(req);
    var img_path = config.imagepath();
    var filename = '';
    
    if (auth) { //The camera sent us credentials

            camera.findOne({ uploadUsername: auth.name, uploadPassword: auth.pass}, function (err, cam) {
            if(err)
            {
                throw err;
            }
            else if (cam) 
            {
                if (typeof req.headers['content-type'] != 'undefined' && req.headers['content-type'] == 'image/jpeg' ) 
                {
                    var filename = utils.getFilenameFromHeader(req.headers['content-disposition']);

                    if (!fs.existsSync(img_path + cam._id + '/')) {
                        fs.mkdirSync(img_path + cam._id + '/');
                    }
                    var dst = fs.createWriteStream(img_path + cam._id + '/'+ filename);
                    req.pipe(dst);
                    
                    req.on('end', function(){
                        //Once file is saved end the necessary record in the database
                        eventfile = new EventFile();
                        eventfile.cameraid = cam._id;
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
                        console.log(filename);
                        res.send('Upload OK\r\n');
                        
                    });
                    dst.on('error', function (err) {
                        console.log(err);
                    });

                }
                else
                {
                    console.log('No image detected.');
                }
            }
            else
            {
                console.log('Camera with those credentials doesn\'t exist.')
                res.status(404).send('Camera with those credentials doesn\'t exist.');
            }
        })

        


    }
    else //If the camera did not send credentials send 401 status code
    {
        res.status(401).header('WWW-Authenticate', 'Basic realm="Secure Area"').end('<html><body>Username & Password Required</body></html>');
    }


}


exports.addImageWithToken = function (req, res)
{
    console.log(req.camera.nickname);

    if (req.query.s == req.camera.uploadPassword) 
    {

        /** 
         ** @TODO - Put follwing code in seperate function. Repeats in addImage()
         **/
        if (typeof req.headers['content-type'] != 'undefined' && req.headers['content-type'] == 'image/jpeg' ) 
        {
            var img_path = config.imagepath();
            var filename = utils.getFilenameFromHeader(req.headers['content-disposition']);

            if (!fs.existsSync(img_path + req.camera._id + '/')) {
                fs.mkdirSync(img_path + req.camera._id + '/');
            }
            var dst = fs.createWriteStream(img_path + req.camera._id + '/'+ filename);
            req.pipe(dst);
            
            req.on('end', function(){
                //Once file is saved enter the necessary record in the database
                eventfile = new EventFile();
                eventfile.cameraid = req.camera._id;
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

                res.send('Upload OK\r\n');
                
            });
            dst.on('error', function (err) {
                console.log(err);
            });

        }
        else
        {
            console.log('No image detected.');
        }
    }
    else
    {
        console.log('Passwords don\'t match');
    }

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