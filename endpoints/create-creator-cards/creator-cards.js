const { createHandler } = require('@app-core/server');
const { appLogger } = require('@app-core/logger');
const creatorCardsService = require('@app/services/create-creator-cards/creator-cards');

module.exports = createHandler({
  path: '/creator-cards',
  method: 'post',
  middlewares: [],
  async onResponseEnd(rc, rs) {
    appLogger.info({ requestContext: rc, response: rs }, 'creator-cards-completed');
  },
  async handler(rc, helpers) {
    const payload = rc.body;

    const response = await creatorCardsService(payload);
    return {
      status: helpers.http_statuses.HTTP_200_OK,
      messgae: 'Creator Card Created Successfully.',
      data: response,
    };
  },
});
