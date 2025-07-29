// prisma/seed.cjs
require('ts-node').register({
  transpileOnly: true,
  compilerOptions: { module: 'commonjs' }
});

module.exports = require('./seed.ts');
