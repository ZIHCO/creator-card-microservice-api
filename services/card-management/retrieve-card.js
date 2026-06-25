const validator = require('@app-core/validator');
const { appLogger } = require('@app-core/logger');
const { CardMessages } = require('@app/messages');
const { throwAppError, ERROR_CODE } = require('@app-core/errors');
const repositoryFactory = require('@app-core/repository-factory');

// Spec for creator-cards service
const spec = `root {
  slug string<trim|minLength:5|maxLength:50>
  access_code? string<length:6>
}`;

// Parse the spec outside the service function
const parsedSpec = validator.parse(spec);

async function retrieveCard(serviceData) {
  // Validate incoming data
  const data = validator.validate(serviceData, parsedSpec);
  let response;

  try {
    const { slug } = data;
    const accessCode = data.access_code ?? data.access_code;
    const Cards = repositoryFactory('Card');
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

    if (existingCard.access_type === 'private' && accessCode !== existingCard.access_code) {
      errors.code = 'AC04';
      throwAppError(CardMessages.AC04, ERROR_CODE.INVLDREQ, { details: errors });
    }

    const links = existingCard.links.map((link) => ({
      title: link.title,
      url: link.url,
    }));
    const rates = existingCard.service_rates.rates.map((rate) => ({
      name: rate.name,
      description: rate.description,
      amount: rate.amount,
    }));

    response = {
      id: existingCard._id,
      title: existingCard.title,
      description: existingCard.description,
      slug,
      creator_reference: existingCard.creator_reference,
      links,
      service_rates: {
        currency: existingCard.service_rates.currency,
        rates,
      },
      status: existingCard.status,
      access_type: existingCard.access_type,
      created: existingCard.created,
      updated: existingCard.updated,
      deleted: null,
    };
  } catch (error) {
    appLogger.errorX(error, 'retrieve-card-error');
    throw error;
  }

  return response;
}

module.exports = retrieveCard;
