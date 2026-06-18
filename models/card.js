const { ModelSchema, SchemaTypes, DatabaseModel } = require('@app-core/mongoose');

const modelName = 'cards';

/**
 * @typedef {Object} Card
 * @property {String} _id
 * @property {String} title
 * @property {String} description
 * @property {String} slug
 * @property {String} creator_reference
 * @property {Array<Object>} links
 * @property {Object} service_rates
 * @property {String} status
 * @property {String} access_type
 * @property {String} access_code
 * @property {Number} created
 * @property {Number} updated
 * @property {Number} deleted
 */

const schemaConfig = {
  _id: { type: SchemaTypes.ULID },

  title: { type: SchemaTypes.String },
  description: { type: SchemaTypes.String },
  slug: { type: SchemaTypes.String, lowercase: true, index: true },
  creator_reference: { type: SchemaTypes.String, index: true },

  links: [
    {
      title: { type: SchemaTypes.String },
      url: { type: SchemaTypes.String },
    },
  ],

  service_rates: {
    currency: { type: SchemaTypes.String },
    rates: [
      {
        name: { type: SchemaTypes.String },
        description: { type: SchemaTypes.String },
        amount: { type: SchemaTypes.Number },
      },
    ],
  },

  status: { type: SchemaTypes.String },
  access_type: { type: SchemaTypes.String, default: 'public' },
  access_code: { type: SchemaTypes.String },
  created: { type: SchemaTypes.Number, default: Date.now, immutable: true },
  updated: { type: SchemaTypes.Number, default: Date.now },
  deleted: { type: SchemaTypes.Number, default: null },
};

const modelSchema = new ModelSchema(schemaConfig, {
  collection: modelName,
});

/** @type {ModelSchema} */
module.exports = DatabaseModel.model(modelName, modelSchema, { paranoid: true });
