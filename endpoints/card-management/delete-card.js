const { createHandler } = require('@app-core/server');
const deleteCardService = require('@app/services/card-management/delete-card');

module.exports = createHandler({
  path: '/creator-cards/:slug',
  method: 'delete',
  middlewares: [],
  async handler(rc, helpers) {
    const payload = rc.body;
    const options = rc.params;

    const response = await deleteCardService(payload, options);
    return {
      status: helpers.http_statuses.HTTP_200_OK,
      message: 'Creator Card Deleted Successfully.',
      data: response,
    };
  },
});
