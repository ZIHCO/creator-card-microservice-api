const validator = require('@app-core/validator');
const { appLogger } = require('@app-core/logger');
const { ValidationMessages } = require('@app/messages');
const { throwAppError, ERROR_CODE } = require('@app-core/errors');
const {
  isAsciiAlphaNumeric,
  isPositiveInteger,
  generateSlugFromTitle,
} = require('@app/services/utils');
const { Card } = require('@app/models');
const repositoryFactory = require('@app-core/repository-factory');
const random = require('@app-core/randomness');

// Spec for creator-cards service
const spec = `root {
  title string<trim|minLength:3|maxLength:100>
  description? string<trim|maxLength:500>
  slug? string<trim|minLength:5|maxLength:50>
  creator_reference string<trim|length:20>
  links[]? {
    title string<trim|minLength:1|maxLength:100>
    url string<trim|startWith:http>
  }
  service_rates? {
    currency string(NGN|USD|GBP|GHS)
    rates[] {
      name string<trim|minLength:3|maxLength:100>
      description string<trim|maxLength:250>
      amount number<min:1>
    }
  }
  status string(draft|published)
  access_type? string(public|private)
  access_code? string<trim|length:6>
}`;

// Parse the spec outside the service function
const parsedSpec = validator.parse(spec);

async function createCard(serviceData) {
  // Validate incoming data
  const data = validator.validate(serviceData, parsedSpec);
  let response;

  try {
    let accessType = data.access_type;
    const accessCode = data.access_code || null;
    const errors = {};

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

    const Cards = repositoryFactory(Card);
    let { slug } = data;
    let existingCard;

    if (slug) {
      const slugWithoutHyphens_ = slug.replaceAll('-', '').replaceAll('_', '');
      errors.code = 'SL01';
      if (!isAsciiAlphaNumeric(slugWithoutHyphens_)) {
        throwAppError(ValidationMessages.SL01, ERROR_CODE.VALIDATIONERR, { details: errors });
      }
    } else {
      const { title } = data;
      slug = generateSlugFromTitle(title);
      existingCard = await Cards.findOne({
        query: { slug },
      });

      if (slug.length < 5 || existingCard) {
        slug += `-${random.randomBytes(6)}`;
      }
      Object.assign(data, { slug });
    }

    existingCard = await Cards.findOne({
      query: { slug },
    });

    if (existingCard) {
      errors.code = 'SL02';
      throwAppError(ValidationMessages.SL02, ERROR_CODE.VALIDATIONERR, { details: errors });
    }

    const card = await Cards.create(data);

    response = {
      id: card._id,
      title: card.title,
      description: card.description,
      slug,
      creator_reference: card.creator_reference,
      links,
      service_rates: {
        currency: card.service_rates.currency,
        rates,
      },
      status: card.status,
      access_type: card.access_type,
      acces_code: accessCode,
      created: card.created,
      updated: card.updated,
      deleted: null,
    };
  } catch (error) {
    appLogger.errorX(error, 'create-card-error');
    throw error;
  }

  return response;
}

module.exports = createCard;
