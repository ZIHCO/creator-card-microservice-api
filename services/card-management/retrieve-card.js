// const validator = require('@app-core/validator');
const { appLogger } = require('@app-core/logger');
const { CardMessages } = require('@app/messages');
const { throwAppError, ERROR_CODE } = require('@app-core/errors');
/* const {
  isAsciiAlphaNumeric,
  isPositiveInteger,
  generateSlugFromTitle,
} = require('@app/services/utils'); */
const { Card } = require('@app/models');
const repositoryFactory = require('@app-core/repository-factory');
// const random = require('@app-core/randomness');

// Parse the spec outside the service function
// const parsedSpec = validator.parse(spec);

async function retrieveCard(serviceData, options = {}) {
  // Validate incoming data
  // const data = validator.validate(serviceData, parsedSpec);
  let response;

  try {
    const { slug } = serviceData;
    const accessCode = options.access_code;
    const Cards = repositoryFactory(Card);
    const errors = {};
    const existingCard = await Cards.findOne({
      query: { slug },
    });

    if (!existingCard) {
      errors.code = 'NF01';
      throwAppError(CardMessages.NF01, ERROR_CODE.NOTFOUND, { details: errors });
    }

    if (existingCard.status === 'draft') {
      errors.code = 'NF02';
      throwAppError(CardMessages.NF02, ERROR_CODE.NOTFOUND, { details: errors });
    }

    if (existingCard.access_type === 'private' && !accessCode) {
      errors.code = 'AC03';
      throwAppError(CardMessages.AC03, ERROR_CODE.INVLDREQ, { details: errors });
    }

    /* let accessType = data.access_type;
    const accessCode = data.access_code;

    accessType = accessType === undefined ? 'public' : accessType;

    if (accessType === 'private' && !accessCode) {
      errors.code = 'AC01';
      throwAppError(ValidationMessages.AC01, ERROR_CODE.VALIDATIONERR, { details: errors });
    }

    if (accessType === 'public' && !!accessCode) {
      errors.code = 'AC05';
      throwAppError(ValidationMessages.AC05, ERROR_CODE.VALIDATIONERR, { details: errors });
    }

    if (accessCode && !isAsciiAlphaNumeric(accessCode)) {
      errors.code = 'AC02';
      throwAppError(ValidationMessages.AC02, ERROR_CODE.VALIDATIONERR, { details: errors });
    }

    const rates = data.service_rates?.rates;
    for (let i = 0; i < rates.length; i++) {
      if (!isPositiveInteger(rates[i].amount)) {
        errors.code = 'SRA01';
        throwAppError(ValidationMessages.SRA01, ERROR_CODE.VALIDATIONERR, { details: errors });
      }
    }

    const { links } = data;
    for (let i = 0; i < links?.length; i++) {
      const { url } = links[i];
      const isHttp = url.startsWith('http://');
      const isHttps = url.startsWith('https://');
      if (!(isHttp || isHttps) && (url.length < 10 || !url.includes('.'))) {
        errors.code = 'URL01';
        throwAppError(ValidationMessages.URL01, ERROR_CODE.VALIDATIONERR, { details: errors });
      }
    }

    if (slug) {
      const slugWithoutHyphens_ = slug.replaceAll('-', '').replaceAll('_', '');
      errors.code = 'SL01';
      if (!isAsciiAlphaNumeric(slugWithoutHyphens_)) {
        throwAppError(ValidationMessages.SL01, ERROR_CODE.VALIDATIONERR, { details: errors });
      }
    } else {
      const { title } = data;
      slug = generateSlugFromTitle(title);

      if (slug.length < 5 || existingCard) {
        slug += `-${random.randomBytes(6)}`;
      }
      Object.assign(data, { slug });
    }

    existingCard = await Cards.findOne({
      query: { slug },
    });

    const card = await Cards.create(data);
    const id = card._id;

    delete card._id; */

    response = {
      // id,
      ...existingCard,
    };
  } catch (error) {
    appLogger.errorX(error, 'creator-cards-error');
    throw error;
  }

  return response;
}

module.exports = retrieveCard;
