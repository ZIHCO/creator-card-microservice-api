const path = require('path');
const { expect } = require('chai');
const createMockServer = require('@app-core/mock-server');
const { CardMessages } = require('@app/messages');
const { buildCardDoc } = require('../../helpers/card-management-fixtures');
const { stubFindOneCard, stubFindOneNull, revertStubs } = require('../../helpers/mock-stubs');

describe('GET /creator-cards/:slug endpoint', () => {
  const activeStubs = [];
  const server = createMockServer([
    path.join(process.cwd(), 'endpoints/card-management/retrieve-card.js'),
  ]);
  const slug = 'my-creator-card';

  afterEach(() => {
    revertStubs(activeStubs);
  });

  it('returns a success response for a published public card', async () => {
    stubFindOneCard(activeStubs, buildCardDoc({ slug, status: 'published' }));

    const response = await server.get(`/creator-cards/${slug}`);

    expect(response.statusCode).to.equal(200);
    expect(response.data.status).to.equal('success');
    expect(response.data.message).to.equal('Creator Card Retrieved Successfully.');
    expect(response.data.data).to.include({
      slug,
      title: 'My Creator Card',
      status: 'published',
      access_type: 'public',
    });
  });

  it('returns not found when the card does not exist', async () => {
    stubFindOneNull(activeStubs);

    const response = await server.get(`/creator-cards/${slug}`);

    expect(response.statusCode).to.equal(404);
    expect(response.data.status).to.equal('error');
    expect(response.data.message).to.equal(CardMessages.NF01);
    expect(response.data.errors.code).to.equal('NF01');
  });

  it('requires an access_code for private cards', async () => {
    stubFindOneCard(
      activeStubs,
      buildCardDoc({
        slug,
        status: 'published',
        access_type: 'private',
        access_code: 'ABC123',
      })
    );

    const response = await server.get(`/creator-cards/${slug}`);

    expect(response.statusCode).to.equal(403);
    expect(response.data.status).to.equal('error');
    expect(response.data.message).to.equal(CardMessages.AC03);
    expect(response.data.errors.code).to.equal('AC03');
  });
});
