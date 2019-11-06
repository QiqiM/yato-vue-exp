const pass = [
    "/user/login"
];

function requireLogin(app){
    return function filter(req, resp, next){
        if(pass.indexOf(req.path) > -1) return next();
        if(!req.session.account){
            resp.send({code:50014, message: "permission denied"});
            return;
        }
        next();
    }
}


module.exports = requireLogin;