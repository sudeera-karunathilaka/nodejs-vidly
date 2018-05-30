const request = require('supertest');
const {User} = require('../../models/user');
let token;
describe('authorization middleware', () => {
    const exec = async () => {
        return await request(server)
            .post('/api/genres')
            .set('x-auth-token', token)
            .send(genre);
    }

    beforeEach(()=>{
        server = require('../../index');
        genre = {name: 'Genre 1'};
        token = new User().generateAuthToken();
    });
    
    afterEach( async() => {
        server.close();
    });

    it('should return 401 if no token is provider', async() =>{
        token = '';
        const response = exec();
        expect(response.status).toBe(401);
    });

    it('should return 400 if no token is invalid', async() =>{
        token = null;
        const response = exec();
        expect(response.status).toBe(400);
    });

    it('should return 200 if token is valid', async() =>{
        const response = exec();
        expect(response.status).toBe(400);
    });
});