const request = require('supertest');
const {Genre} = require('../../models/genre');
const {User} = require('../../models/user');
const mongoose = require('mongoose');

let server;
let token;
let genre;
describe('/api/genre', () => {
    // This will make sure the server is closed after each test suit execution and reload before the next test suit execution.
    // If not it will try to open the already opened port and result in "Port already in user" error
    beforeEach(() => {
        server = require('../../index');
    });
    afterEach( async() => {
        server.close();
        await Genre.remove({});//Remove all dummy data at the end on each test suit execution.
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
    });

    describe('GET /:id', () => {
        it('should return a genre if valid id is passed', async () =>{
            const genre = new Genre({name: 'Genre 1'});
            const result = await genre.save();

            const response = await request(server).get('/api/genres/' + genre._id);
            console.log(result);

            expect(response.status).toBe(200);
            
            expect(response.body).toHaveProperty('name', genre.name);
            //expect(response.body.some(g => g.name === 'Genre 2')).toBeTruthy()
        });

        it('should return 404 if invalid id is passed', async () =>{
            const response = await request(server).get('/api/genres/1');
            expect(response.status).toBe(404);
        });
        
        it('should return 404 if no genre with the given id exists', async () =>{
            const genreId = mongoose.Types.ObjectId().toHexString;
            const response = await request(server).get('/api/genres/' + genreId);
            expect(response.status).toBe(404);
        });
    });

    const exec = async () => {
        return await request(server)
            .post('/api/genres')
            .set('x-auth-token', token)
            .send(genre);
    }

    describe('POST /', () =>{

        beforeEach(async () => {
            token = new User().generateAuthToken();
            genre = {name: 'Genre 1'};
        })


        it('should return 401 if client is not logged in', async () => {
            token = '';
            const response = await exec();
            expect(response.status).toBe(401);
        });

        it('should return 400 if genre name is less than 5 characters', async () => {
            genre = {name: '123'};
            const response = await exec();
            expect(response.status).toBe(400);
        });

        it('should return 400 if genre name is more than 50 characters', async () => {
            genre = { name: new Array(52).join('a') }; //Create a string of 51 characters
            const response = await exec();
            expect(response.status).toBe(400);
        });

        it('should should save the genre if it is valid', async () => {
            const response = await exec();
            genre = await Genre.find({name: 'Genre 1'});
            expect(genre).not.toBeNull();
        });

        it('should return the  genre if it is valid', async () => {
            const response = await exec();
            expect(response.body).toHaveProperty('_id');
            expect(response.body).toHaveProperty('name', 'Genre 1');
        });
    });
});