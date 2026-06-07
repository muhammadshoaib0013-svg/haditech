const fs = require('fs');
const path = require('path');
const hex = '89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4890000000d49444154789c6360606060000000050001a5f645400000000049454e44ae426082';
const buffer = Buffer.from(hex, 'hex');
fs.writeFileSync(path.join(__dirname, '../public/favicon.ico'), buffer);
console.log('Favicon created successfully');
