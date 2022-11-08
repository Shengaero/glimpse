const fs = require('fs');
const path = require('path');

fs.rmSync(path.join(__dirname, 'server', 'build'), { recursive: true, force: true });
