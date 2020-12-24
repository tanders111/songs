
# To allow local scripts OR remote signed scripts
# Set-ExecutionPolicy -ExecutionPolicy RemoteSigned"   

Start-Process -FilePath "webpack" -Wait  -ArgumentList "--config webpack-server.config.js" 

Write-Host "webpack complete"

robocopy files dist\files /MIR
xcopy /Y dist-package.json dist\package.json

npx ng build --prod  --outputPath dist/client

Stop-Service -name songs

$deployroot = "c:\tmp\deploy\songs"

Write-Host $deployroot

robocopy dist $deployroot /MIR

Start-Service -name songs


