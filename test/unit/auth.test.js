const {User} = require('../../models/user');
const auth = require('../../middleware/auth');
const mongoose = require('mongoose');

describe('auth middleware', () => {
    it('should populate req.user with the payload of a valid jwt', () => {
        const user = {
            _id: mongoose.Types.ObjectId().toHexString(),
            isAdmin: true
        };
        const token = new User(user).generateAuthToken();

        //mocking request object
        const req = {
            //Since it fetches the token using req.header(), we need to mock the header() 
            //so that it returns a valid token
            header: jest.fn().mockReturnValue(token)
        };
        //Mocking response
        const res = {}; //no need to mock any functions as they are not used
        //Mocking next()
        const next = jest.fn();//mocks only the next() as it is used

        auth(req, res, next);

        expect(req.user).toMatchObject(user);
    });
});