# Songs


development & debug
--------------------
```
Run the node server using F5 
or from command line:  node  ..path/server/index.js  [port:3002]  
see launch.json for setting server port = 3002

start client app using a proxy to route server requests coming in on port 4200 to port 3002
from cmd prompt   [root]>npm run start which is configure to run ng-serve like this:
ng serve  --proxy-config proxy.conf.json


with proxy there is no need for the angular service to change the server port to 3002 if app was served from localhost:4200

to edit text files in create a link to them:
mklink /J files C:\Users\Todd\Documents\music\songs
```


prod mode

```
Running the server in prod mode

The port for prod is 3001

see deploy-songs.bat

build the server bundle

webpack --config webpack-server.config.js

puts bundle-server.js in dist directory

copy bundle-server.js to deploy-root

build the client

ng build --prod  --outputPath %deployroot/client
e.g.  ng build --prod  --outputPath c:/tmp/deploy/songs/client

run the server:

node bundle-server.js

the node server will look for static files in 'client' directory and default is index.html
```

setting up the windows service
```
to edit the service name is songs:
nssm edit songs


path     = C:\Program Files\nodejs\node.exe
startdir = c:\tmp\deploy\songs
arguments= bundle-server.js
logs redirected to c:\tmp\log\songs.out|err.log
make sure console box is unchecked on process tab!!!!!!
```


