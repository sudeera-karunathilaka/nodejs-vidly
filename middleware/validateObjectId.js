const mongoose = require('mongoose');
function validateObjectId(req, res, next){
    if(!mongoose.Types.ObjectId.isValid(req.params.id)){
        return res.status(404).send('Invalid genre id');
    }
    next();
}

module.exports = validateObjectId;