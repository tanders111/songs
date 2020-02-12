
# To allow local scripts OR remote signed scripts
# Set-ExecutionPolicy -ExecutionPolicy RemoteSigned"   

Start-Process -FilePath "dotnet" -Wait  -ArgumentList "publish -c Release" 

Write-Host "publish complete"

Set-Location "Songs.Web/ClientApp" 

npx ng build --prod  --outputPath ..\bin\Release\netcoreapp3.1\ClientApp\dist

robocopy ..\..\files ..\bin\Release\netcoreapp3.1\publish\files

Stop-Service -name song

$deployroot = "c:\tmp\deploy\song"

Write-Host $deployroot

robocopy ..\bin\Release\netcoreapp3.1\publish $deployroot /MIR

Start-Service -name song


