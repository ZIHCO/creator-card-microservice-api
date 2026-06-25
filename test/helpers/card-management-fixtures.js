const CREATOR_REFERENCE = 'cr8ref00000000000001';

function buildCreatePayload(overrides = {}) {
  return {
    title: 'My Creator Card',
    description: 'A test creator card description',
    slug: 'my-creator-card',
    creator_reference: CREATOR_REFERENCE,
    links: [{ title: 'Website', url: 'https://example.com' }],
    service_rates: {
      currency: 'USD',
      rates: [
        {
          name: 'Consulting',
          description: 'Hourly consulting rate',
          amount: 100,
        },
      ],
    },
    status: 'published',
    access_type: 'public',
    ...overrides,
  };
}

function buildCardDoc(overrides = {}) {
  return {
    _id: '01HXYZ000000000000000000',
    title: 'My Creator Card',
    description: 'A test creator card description',
    slug: 'my-creator-card',
    creator_reference: CREATOR_REFERENCE,
    links: [{ title: 'Website', url: 'https://example.com' }],
    service_rates: {
      currency: 'USD',
      rates: [
        {
          name: 'Consulting',
          description: 'Hourly consulting rate',
          amount: 100,
        },
      ],
    },
    status: 'published',
    access_type: 'public',
    access_code: null,
    created: Date.now(),
    updated: Date.now(),
    deleted: null,
    ...overrides,
  };
}

module.exports = {
  CREATOR_REFERENCE,
  buildCreatePayload,
  buildCardDoc,
};
