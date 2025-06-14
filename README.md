# Songs


## development & debug using node server

```
Run the dotnet server using F5 
 
see launch.json for setting hosturls = need to http://locahost:5080,http://0.0.0.0:5080 so localhost launches and accessible from other ips

start client app using port 4205
from cmd prompt   ....Songs.Web\ClientApp>npm start
which is configure to run ng serve like this:  ng serve --port 4205 

from the browser go to  http://localhost:5080


to edit text files in vscode create a link to them:
mklink /J files C:\Users\Todd\OneDrive\Todd\music\songs
```

## azure
sign in to azure extension

right click "...\bin\Release\net8.0\publish"  and select 'Deploy to web app'

confirm the app service is tsongs

in azure portal the setup is in Settings/Resources from the home page

## prod mode

```
Running the server in prod mode

see songs.ps1 for build

To run from commandline   Songs.Web.Exe --hosturls "http://0.0.0.0:3080"

build the client

```

## setting up the windows service
```
to edit the service name is songs:
nssm edit songs

make sure console box is unchecked on process tab!!!!!!

root = published app   

path     = root\Songs.Web.exe
startdir = root
arguments= --hosturls http://0.0.0.0:3080
logs redirected to c:\tmp\log\songs.out|err.log

```


