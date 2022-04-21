const server = require('./app.js');
const supertest = require('supertest');
const requestWithSupertest = supertest(server);

describe('API testing', () => {

  it('GET /api/comments should return 200', async () => {
    const res = await requestWithSupertest.get('/api/comments');
      expect(res.status).toEqual(200);
      expect(res.type).toEqual(expect.stringContaining('json'));
  });

  it('POST /api/comment when empty should return 400', async () => {
    const res = await requestWithSupertest.post('/api/comment');
      expect(res.status).toEqual(400);
  });

  it('POST /api/comment should return 200', async () => {
    const res = await requestWithSupertest.post('/api/comment').set('Content-type', 'application/x-www-form-urlencoded').send({comment: "testing", name: "tester"});
      expect(res.status).toEqual(200);
  });

  it('GET /api/comments should return comments and POST /api/upvote should return 200', async () => {
    const res = await requestWithSupertest.get('/api/comments');
      expect(res.status).toEqual(200);
      expect(res.body).toHaveProperty('length', 1);
      expect(res.body[0]).toHaveProperty('comment', 'testing');

    const postRes = await requestWithSupertest.post('/api/upvote').set('Content-type', 'application/x-www-form-urlencoded').send({comment_id: res.body[0].comment_id, name: "tester"});
      expect(postRes.status).toEqual(200);
  });

  it('POST /api/upvote should return 400 on invalid comment', async () => {
    const res = await requestWithSupertest.get('/api/comments');
      expect(res.status).toEqual(200);
      expect(res.body).toHaveProperty('length', 1);
      expect(res.body[0]).toHaveProperty('comment', 'testing');

    const postRes = await requestWithSupertest.post('/api/upvote').set('Content-type', 'application/x-www-form-urlencoded').send({comment_id: "tester", name: "tester"});
      expect(postRes.status).toEqual(400);
  });

  it('GET /api/comments should return comments and POST /api/upvote should return 400 if you try to upvote twice', async () => {
    const res = await requestWithSupertest.get('/api/comments');
      expect(res.status).toEqual(200);
      expect(res.body).toHaveProperty('length', 1);
      expect(res.body[0]).toHaveProperty('comment', 'testing');

    const postRes = await requestWithSupertest.post('/api/upvote').set('Content-type', 'application/x-www-form-urlencoded').send({comment_id: res.body[0].comment_id, name: "tester"});
      expect(postRes.status).toEqual(400);
  });

  it('GET /api/comments should return upvotes', async () => {
    const res = await requestWithSupertest.get('/api/comments');
      expect(res.status).toEqual(200);
      expect(res.body).toHaveProperty('length', 1);
      expect(res.body[0]).toHaveProperty('upvotes', 1);
  });

  it('POST /api/comment should return 400 on invalid parent comment', async () => {
    const res = await requestWithSupertest.post('/api/comment').set('Content-type', 'application/x-www-form-urlencoded').send({comment: "testing", parent_id: "test", name: "tester"});
      expect(res.status).toEqual(400);
  });
});