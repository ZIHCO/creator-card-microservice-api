const path = require('path');
const { expect } = require('chai');
const createMockServer = require('@app-core/mock-server');
const { ValidationMessages } = require('@app/messages');
const { buildCreatePayload } = require('../../helpers/card-management-fixtures');
const { stubFindOneNull, revertStubs } = require('../../helpers/mock-stubs');

describe('POST /creator-cards endpoint', () => {
  const activeStubs = [];
  const server = createMockServer([
    path.join(process.cwd(), 'endpoints/card-management/create-card.js'),
  ]);

  afterEach(() => {
    revertStubs(activeStubs);
  });

  it('returns a success response when the card is created', async () => {
    stubFindOneNull(activeStubs);

    const payload = buildCreatePayload();
    const response = await server.post('/creator-cards', { body: payload });

    expect(response.statusCode).to.equal(200);
    expect(response.data.status).to.equal('success');
    expect(response.data.message).to.equal('Creator Card Created Successfully.');
    expect(response.data.data).to.include({
      title: payload.title,
      slug: payload.slug,
      creator_reference: payload.creator_reference,
      status: payload.status,
    });
  });

  it('returns a validation error for invalid payloads', async () => {
    const response = await server.post('/creator-cards', {
      body: buildCreatePayload({
        access_type: 'private',
        access_code: undefined,
      }),
    });

    expect(response.statusCode).to.equal(400);
    expect(response.data.status).to.equal('error');
    expect(response.data.message).to.equal(ValidationMessages.AC01);
    expect(response.data.errors.code).to.equal('AC01');
  });
});
