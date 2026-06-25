const { expect } = require('chai');
const { ERROR_CODE } = require('@app-core/errors');
const { ValidationMessages } = require('@app/messages');
const createCard = require('@app/services/card-management/create-card');
const { CREATOR_REFERENCE, buildCreatePayload } = require('../../helpers/card-management-fixtures');
const { stubFindOneNull, stubFindOneCard, revertStubs } = require('../../helpers/mock-stubs');

describe('create-card service', () => {
  const activeStubs = [];

  afterEach(() => {
    revertStubs(activeStubs);
  });

  it('creates a public card with a provided slug', async () => {
    stubFindOneNull(activeStubs);

    const payload = buildCreatePayload();
    const result = await createCard(payload);

    expect(result).to.include({
      title: payload.title,
      description: payload.description,
      slug: payload.slug,
      creator_reference: CREATOR_REFERENCE,
      status: payload.status,
      access_type: 'public',
      acces_code: null,
      deleted: null,
    });
    expect(result.links).to.deep.equal(payload.links);
    expect(result.service_rates).to.deep.equal(payload.service_rates);
    expect(result).to.have.property('id');
    expect(result).to.have.property('created');
    expect(result).to.have.property('updated');
  });

  it('generates a slug from the title when slug is omitted', async () => {
    stubFindOneNull(activeStubs);

    const payload = buildCreatePayload({ slug: undefined, title: 'My Published Card' });
    const result = await createCard(payload);

    expect(result.slug).to.equal('my-published-card');
  });

  it('rejects private cards without an access_code', async () => {
    const payload = buildCreatePayload({
      access_type: 'private',
      access_code: undefined,
    });

    try {
      await createCard(payload);
      expect.fail('Expected createCard to throw');
    } catch (error) {
      expect(error.isApplicationError).to.equal(true);
      expect(error.message).to.equal(ValidationMessages.AC01);
      expect(error.errorCode).to.equal(ERROR_CODE.VALIDATIONERR);
      expect(error.details.code).to.equal('AC01');
    }
  });

  it('rejects public cards that include an access_code', async () => {
    const payload = buildCreatePayload({
      access_type: 'public',
      access_code: 'ABC123',
    });

    try {
      await createCard(payload);
      expect.fail('Expected createCard to throw');
    } catch (error) {
      expect(error.message).to.equal(ValidationMessages.AC05);
      expect(error.errorCode).to.equal(ERROR_CODE.VALIDATIONERR);
      expect(error.details.code).to.equal('AC05');
    }
  });

  it('rejects non-alphanumeric access codes', async () => {
    const payload = buildCreatePayload({
      access_type: 'private',
      access_code: 'AB-123',
    });

    try {
      await createCard(payload);
      expect.fail('Expected createCard to throw');
    } catch (error) {
      expect(error.message).to.equal(ValidationMessages.AC02);
      expect(error.errorCode).to.equal(ERROR_CODE.VALIDATIONERR);
      expect(error.details.code).to.equal('AC02');
    }
  });

  it('rejects service rates that are not positive integers', async () => {
    const payload = buildCreatePayload({
      service_rates: {
        currency: 'USD',
        rates: [
          {
            name: 'Consulting',
            description: 'Hourly consulting rate',
            amount: 99.5,
          },
        ],
      },
    });

    try {
      await createCard(payload);
      expect.fail('Expected createCard to throw');
    } catch (error) {
      expect(error.message).to.equal(ValidationMessages.SRA01);
      expect(error.errorCode).to.equal(ERROR_CODE.VALIDATIONERR);
      expect(error.details.code).to.equal('SRA01');
    }
  });

  it('rejects slugs with invalid characters', async () => {
    const payload = buildCreatePayload({ slug: 'bad slug!' });

    try {
      await createCard(payload);
      expect.fail('Expected createCard to throw');
    } catch (error) {
      expect(error.message).to.equal(ValidationMessages.SL01);
      expect(error.errorCode).to.equal(ERROR_CODE.VALIDATIONERR);
      expect(error.details.code).to.equal('SL01');
    }
  });

  it('rejects slugs that are already taken', async () => {
    stubFindOneCard(activeStubs, { slug: 'my-creator-card' });

    try {
      await createCard(buildCreatePayload());
      expect.fail('Expected createCard to throw');
    } catch (error) {
      expect(error.message).to.equal(ValidationMessages.SL02);
      expect(error.errorCode).to.equal(ERROR_CODE.VALIDATIONERR);
      expect(error.details.code).to.equal('SL02');
    }
  });
});
