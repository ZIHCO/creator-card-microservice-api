const { expect } = require('chai');
const { ERROR_CODE } = require('@app-core/errors');
const { CardMessages } = require('@app/messages');
const deleteCard = require('@app/services/card-management/delete-card');
const { CREATOR_REFERENCE, buildCardDoc } = require('../../helpers/card-management-fixtures');
const {
  stubFindOneNull,
  stubFindOneCard,
  stubDeleteSuccess,
  revertStubs,
} = require('../../helpers/mock-stubs');

describe('delete-card service', () => {
  const activeStubs = [];
  const slug = 'my-creator-card';

  afterEach(() => {
    revertStubs(activeStubs);
  });

  it('soft-deletes a card when the creator_reference matches', async () => {
    stubFindOneCard(activeStubs, buildCardDoc({ slug }));
    stubDeleteSuccess(activeStubs);

    const result = await deleteCard({ creator_reference: CREATOR_REFERENCE, slug });

    expect(result).to.include({
      slug,
      creator_reference: CREATOR_REFERENCE,
      title: 'My Creator Card',
      status: 'published',
      access_type: 'public',
      acces_code: null,
    });
    expect(result.deleted).to.be.a('number');
    expect(result.links).to.deep.equal(buildCardDoc().links);
    expect(result.service_rates).to.deep.equal(buildCardDoc().service_rates);
  });

  it('returns not found when the card does not exist', async () => {
    stubFindOneNull(activeStubs);

    try {
      await deleteCard({ creator_reference: CREATOR_REFERENCE, slug });
      expect.fail('Expected deleteCard to throw');
    } catch (error) {
      expect(error.message).to.equal(CardMessages.NF01);
      expect(error.errorCode).to.equal(ERROR_CODE.NOTFOUND);
      expect(error.details.code).to.equal('NF01');
    }
  });

  it('rejects deletion when the creator_reference does not match', async () => {
    stubFindOneCard(
      activeStubs,
      buildCardDoc({
        slug,
        creator_reference: 'wrongref000000000000',
      })
    );

    try {
      await deleteCard({ creator_reference: CREATOR_REFERENCE, slug });
      expect.fail('Expected deleteCard to throw');
    } catch (error) {
      expect(error.message).to.equal(CardMessages.CR01);
      expect(error.errorCode).to.equal(ERROR_CODE.INVLDREQ);
      expect(error.details.code).to.equal('CR01');
    }
  });
});
