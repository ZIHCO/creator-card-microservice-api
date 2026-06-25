process.env.USE_MOCK_MODEL = '1';

const Module = require('module');
const path = require('path');

const projectRoot = path.join(__dirname, '..');
const servicesRoot = path.join(projectRoot, 'services');
const originalResolveFilename = Module._resolveFilename;

Module._resolveFilename = function resolveFilename(request, parent, isMain, options) {
  if (request.startsWith('@app/services/')) {
    const subpath = request.slice('@app/services/'.length);
    const candidates = [
      path.join(servicesRoot, subpath),
      path.join(servicesRoot, `${subpath}.js`),
      path.join(servicesRoot, subpath, 'index.js'),
    ];

    const resolvedPath = candidates
      .map((candidate) => {
        try {
          return originalResolveFilename.call(this, candidate, parent, isMain, options);
        } catch (error) {
          if (error.code !== 'MODULE_NOT_FOUND') {
            throw error;
          }
          return null;
        }
      })
      .find((result) => result !== null);

    if (resolvedPath) {
      return resolvedPath;
    }
  }

  return originalResolveFilename.call(this, request, parent, isMain, options);
};
