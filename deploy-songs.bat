
sc stop songs

set deployroot=c:\tmp\deploy\songs

webpack --config webpack-server.config.js

move /Y dist\bundle-server.js  %deployroot%

ng build --prod  --outputPath %deployroot%/client

sc start songs

