const request = require('supertest');
let server;
describe('/api/genre', () => {
    
    // This will make sure the server is closed after each test suit execution and reload before the next test suit execution.
    // If not it will try to open the already opened port and result in "Port already in user" error
    beforeEach(() => {server = require('../../index'); });
    afterEach(() => {server.close();});
    
    describe('GET /', () => {
        it('should return all genres', async () =>{
            const response = await request(server).get('/api/genres');
            expect(response.status).toBe(200);
        });
    })
});