const validator = require('@app-core/validator');
const { appLogger } = require('@app-core/logger');
const { CardMessages } = require('@app/messages');
const { throwAppError, ERROR_CODE } = require('@app-core/errors');
const { Card } = require('@app/models');
const repositoryFactory = require('@app-core/repository-factory');

// Spec for creator-cards service
const spec = `root {
  creator_reference string<trim|length:20>
}`;

// Parse the spec outside the service function
const parsedSpec = validator.parse(spec);

async function deleteCard(serviceData, options) {
  // Validate incoming data
  const data = validator.validate(serviceData, parsedSpec);
  let response;

  try {
    const creatorReference = data.creator_reference;
    const errors = {};
    const { slug } = options;
    const Cards = repositoryFactory(Card);
    const existingCard = await Cards.findOne({
      query: { slug },
    });

    if (!existingCard) {
      errors.code = 'NF01';
      throwAppError(CardMessages.NF01, ERROR_CODE.NOTFOUND, { details: errors });
    }

    if (creatorReference !== existingCard.creator_reference) {
      errors.code = 'CR01';
      throwAppError(CardMessages.CR01, ERROR_CODE.INVLDREQ, { details: errors });
    }

    const result = await Cards.deleteOne({
      query: { slug },
    });

    let deleted;
    if (result.modifiedCount > 0) {
      deleted = Date.now();
    } else {
      deleted = null;
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
    let accessCode;
    if (!existingCard.access_code) {
      accessCode = null;
    } else {
      accessCode = existingCard.access_code;
    }

    response = {
      id: existingCard._id,
      title: existingCard.title,
      description: existingCard.description,
      slug,
      creator_reference: creatorReference,
      links,
      service_rates: {
        currency: existingCard.service_rates.currency,
        rates,
      },
      status: existingCard.status,
      access_type: existingCard.access_type,
      acces_code: accessCode,
      created: existingCard.created,
      updated: existingCard.updated,
      deleted,
    };
  } catch (error) {
    appLogger.errorX(error, 'creator-cards-error');
    throw error;
  }

  return response;
}

module.exports = deleteCard;
