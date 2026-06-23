const { createHandler } = require('@app-core/server');
const { appLogger } = require('@app-core/logger');
const retrieveCardService = require('@app/services/card-management/retrieve-card');

module.exports = createHandler({
  path: '/creator-cards/:slug',
  method: 'get',
  middlewares: [],
  async handler(rc, helpers) {
    const payload = rc.params;
    const options = rc.query;

    const response = await retrieveCardService(payload, options);
    return {
      status: helpers.http_statuses.HTTP_200_OK,
      message: 'Creator Card Retrieved Successfully.',
      data: response,
    };
  },
});
