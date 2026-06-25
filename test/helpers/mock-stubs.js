const { MockModelStubs } = require('@app/mock-models');

function trackStub(stubRegistry, stub) {
  stubRegistry.push(stub);
  return stub;
}

function stubFindOneNull(stubRegistry) {
  return trackStub(
    stubRegistry,
    MockModelStubs.Card.configureStubs({
      method: 'findOne',
      mockNull: true,
    })
  );
}

function stubFindOneCard(stubRegistry, docConfig) {
  return trackStub(
    stubRegistry,
    MockModelStubs.Card.configureStubs({
      method: 'findOne',
      docConfig,
    })
  );
}

function stubDeleteSuccess(stubRegistry) {
  return trackStub(
    stubRegistry,
    MockModelStubs.Card.configureStubs({
      method: 'deleteOne',
      overrideFn: () => ({ modifiedCount: 1 }),
    })
  );
}

function revertStubs(stubRegistry) {
  stubRegistry.forEach((stub) => stub.revert());
  stubRegistry.splice(0);
}

module.exports = {
  stubFindOneNull,
  stubFindOneCard,
  stubDeleteSuccess,
  revertStubs,
};
