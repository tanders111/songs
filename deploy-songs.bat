
@echo off
echo ------------------- run the following commmands to deploy 
echo ------------------- running the bat file does not work because all commands after webpack do not execute


set deployroot=c:\tmp\deploy\songs

echo sc stop songs

echo webpack --config webpack-server.config.js

echo move /Y dist\bundle-server.js  %deployroot%

echo ng build --prod  --outputPath %deployroot%/client
echo or use npx to use the local version of angular cli
echo npx ng build --prod  --outputPath %deployroot%/client

echo sc start songs


