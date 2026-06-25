const path = require('path');
const { expect } = require('chai');
const createMockServer = require('@app-core/mock-server');
const { CardMessages } = require('@app/messages');
const { CREATOR_REFERENCE, buildCardDoc } = require('../../helpers/card-management-fixtures');
const {
  stubFindOneCard,
  stubFindOneNull,
  stubDeleteSuccess,
  revertStubs,
} = require('../../helpers/mock-stubs');

describe('DELETE /creator-cards/:slug endpoint', () => {
  const activeStubs = [];
  const server = createMockServer([
    path.join(process.cwd(), 'endpoints/card-management/delete-card.js'),
  ]);
  const slug = 'my-creator-card';

  afterEach(() => {
    revertStubs(activeStubs);
  });

  it('returns a success response when the card is deleted', async () => {
    stubFindOneCard(activeStubs, buildCardDoc({ slug }));
    stubDeleteSuccess(activeStubs);

    const response = await server.delete(`/creator-cards/${slug}`, {
      body: { creator_reference: CREATOR_REFERENCE },
    });

    expect(response.statusCode).to.equal(200);
    expect(response.data.status).to.equal('success');
    expect(response.data.message).to.equal('Creator Card Deleted Successfully.');
    expect(response.data.data.slug).to.equal(slug);
    expect(response.data.data.deleted).to.be.a('number');
  });

  it('returns not found when the card does not exist', async () => {
    stubFindOneNull(activeStubs);

    const response = await server.delete(`/creator-cards/${slug}`, {
      body: { creator_reference: CREATOR_REFERENCE },
    });

    expect(response.statusCode).to.equal(404);
    expect(response.data.status).to.equal('error');
    expect(response.data.message).to.equal(CardMessages.NF01);
    expect(response.data.errors.code).to.equal('NF01');
  });
});
