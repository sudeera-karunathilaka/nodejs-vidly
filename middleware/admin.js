function checkRole(req, res, next){
    //Checks for admin role
    console.log(req.user);
    if(!req.user.isAdmin){
        return res.status(403).send('Access denied.');
    }
    next();
}

module.exports = checkRole;