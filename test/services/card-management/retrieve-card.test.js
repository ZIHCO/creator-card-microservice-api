const { expect } = require('chai');
const { ERROR_CODE } = require('@app-core/errors');
const { CardMessages } = require('@app/messages');
const retrieveCard = require('@app/services/card-management/retrieve-card');
const { buildCardDoc } = require('../../helpers/card-management-fixtures');
const { stubFindOneNull, stubFindOneCard, revertStubs } = require('../../helpers/mock-stubs');

describe('retrieve-card service', () => {
  const activeStubs = [];
  const slug = 'my-creator-card';

  afterEach(() => {
    revertStubs(activeStubs);
  });

  it('retrieves a published public card', async () => {
    stubFindOneCard(activeStubs, buildCardDoc({ slug, status: 'published' }));

    const result = await retrieveCard({ slug });

    expect(result).to.include({
      slug,
      title: 'My Creator Card',
      status: 'published',
      access_type: 'public',
      deleted: null,
    });
    expect(result.links).to.deep.equal(buildCardDoc().links);
    expect(result.service_rates).to.deep.equal(buildCardDoc().service_rates);
  });

  it('retrieves a private card when the access_code matches', async () => {
    stubFindOneCard(
      activeStubs,
      buildCardDoc({
        slug,
        status: 'published',
        access_type: 'private',
        access_code: 'ABC123',
      })
    );

    const result = await retrieveCard({ slug, access_code: 'ABC123' });

    expect(result.access_type).to.equal('private');
    expect(result.slug).to.equal(slug);
  });

  it('returns not found when the card does not exist', async () => {
    stubFindOneNull(activeStubs);

    try {
      await retrieveCard({ slug });
      expect.fail('Expected retrieveCard to throw');
    } catch (error) {
      expect(error.message).to.equal(CardMessages.NF01);
      expect(error.errorCode).to.equal(ERROR_CODE.NOTFOUND);
      expect(error.details.code).to.equal('NF01');
    }
  });

  it('returns not found for draft cards', async () => {
    stubFindOneCard(activeStubs, buildCardDoc({ slug, status: 'draft' }));

    try {
      await retrieveCard({ slug });
      expect.fail('Expected retrieveCard to throw');
    } catch (error) {
      expect(error.message).to.equal(CardMessages.NF02);
      expect(error.errorCode).to.equal(ERROR_CODE.NOTFOUND);
      expect(error.details.code).to.equal('NF02');
    }
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

    try {
      await retrieveCard({ slug });
      expect.fail('Expected retrieveCard to throw');
    } catch (error) {
      expect(error.message).to.equal(CardMessages.AC03);
      expect(error.errorCode).to.equal(ERROR_CODE.INVLDREQ);
      expect(error.details.code).to.equal('AC03');
    }
  });

  it('rejects private cards when the access_code is incorrect', async () => {
    stubFindOneCard(
      activeStubs,
      buildCardDoc({
        slug,
        status: 'published',
        access_type: 'private',
        access_code: 'ABC123',
      })
    );

    try {
      await retrieveCard({ slug, access_code: 'WRONG1' });
      expect.fail('Expected retrieveCard to throw');
    } catch (error) {
      expect(error.message).to.equal(CardMessages.AC04);
      expect(error.errorCode).to.equal(ERROR_CODE.INVLDREQ);
      expect(error.details.code).to.equal('AC04');
    }
  });
});
