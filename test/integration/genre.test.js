const request = require('supertest');
const {Genre} = require('../../models/genre');
let server;
describe('/api/genre', () => {
    // This will make sure the server is closed after each test suit execution and reload before the next test suit execution.
    // If not it will try to open the already opened port and result in "Port already in user" error
    beforeEach(() => {server = require('../../index'); });
    afterEach( async() => {
        server.close();
        await Genre.remove({});
    });
    
    describe('GET /', () => {
        it('should return all genres', async () =>{
            await Genre.collection.insertMany([
                {name: 'Genre 1'},
                {name: 'Genre 2'}
            ]);

            const response = await request(server).get('/api/genres');
            expect(response.status).toBe(200);
            expect(response.body.length).toBe(2);
            expect(response.body.some(g => g.name === 'Genre 1')).toBeTruthy()
            expect(response.body.some(g => g.name === 'Genre 2')).toBeTruthy()
        });
    })
});