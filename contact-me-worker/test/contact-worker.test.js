const path = require('path');
const { assert } = require('chai');
const {
  makeCloudflareWorkerEnv,
  makeCloudflareWorkerRequest,
} = require('cloudflare-worker-mock');

global.CORS_ALLOW = '*';

describe('Contact Form Worker Tests', function () {
  beforeEach(function () {
    Object.assign(global, makeCloudflareWorkerEnv());
    const workerPath = path.normalize(path.join(__dirname, '../index.js'));
    delete require.cache[workerPath];
    require(workerPath);
  });

  it('adds a fetch listener', async function () {
    assert.exists(self.listeners.get('fetch'), 'fetch listener is registered');
  });

  it('returns a "method not allowed" response to a GET request', async function () {
    const request = makeCloudflareWorkerRequest('/');
    const response = await self.trigger('fetch', request);

    assert.equal(response.status, 405);
  });

  it('responds to a CORS prefetch request', async function () {
    const request = makeCloudflareWorkerRequest('/', {
      method: 'OPTIONS',
      headers: {
        Origin: 'http://testsite.notreal',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type',
      },
      cf: {},
    });
    const response = await self.trigger('fetch', request);

    assert(response.headers.has('Access-Control-Allow-Origin'));
    assert.equal(
      response.headers.get('Access-Control-Allow-Origin'),
      CORS_ALLOW
    );

    assert(response.headers.has('Access-Control-Allow-Methods'));
    assert.equal(
      response.headers.get('Access-Control-Allow-Methods'),
      'POST, OPTIONS'
    );

    assert(response.headers.has('Access-Control-Allow-Headers'));
    assert.equal(
      response.headers.get('Access-Control-Allow-Headers'),
      'Content-Type'
    );
  });

  it('returns an "unsupported media type" response if the Content-Type is not application/json', async function () {
    const request = makeCloudflareWorkerRequest('/', {
      method: 'POST',
      body: 'Hello',
      cf: {},
    });
    const response = await self.trigger('fetch', request);

    assert.equal(response.status, 415);
  });

  it.skip('returns a "bad request" response if the body is invalid json', async function () {
    const request = makeCloudflareWorkerRequest('/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: '{Hello',
      cf: {},
    });
    const response = await self.trigger('fetch', request);

    assert.equal(response.status, 400);
  });

  it('returns a "bad request" response if a field is missing', async function () {
    const request = makeCloudflareWorkerRequest('/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Testey McTestface',
        email: 'test@notreal.test',
      }),
      cf: {},
    });
    const response = await self.trigger('fetch', request);

    assert.equal(response.status, 400);
  });
});
