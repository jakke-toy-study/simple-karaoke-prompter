const fs = require('fs');
const path = require('path');

const src = path.resolve(__dirname, '.env');
const dest = path.resolve(__dirname, 'dist', '.env');

fs.copyFileSync(src, dest);
console.log(`.env copied to dist/.env`);