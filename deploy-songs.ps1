
# To allow local scripts OR remote signed scripts
# Set-ExecutionPolicy -ExecutionPolicy RemoteSigned"   
function WaitUntilServices($searchString, $status) {
    # Get all services where DisplayName matches $searchString and loop through each of them.
    foreach ($service in (Get-Service -DisplayName $searchString)) {
        # Wait for the service to reach the $status or a maximum of 30 seconds
        $service.WaitForStatus($status, '00:00:30')
    }

    Write-Host $searchString $status
}

function buildClient() {
    Set-Location $clientroot

    New-Item -ItemType Directory -Force -Path $pubroot\ClientApp\dist
    npx ng build --prod  --outputPath $pubroot\ClientApp\dist

    Write-Host angular build complete

    Set-Location $root
}

function deployAll() {
    Start-Process -FilePath "dotnet" -Wait  -ArgumentList "publish -c Release" 

    Write-Host "dotnet publish complete"

    buildClient

    Stop-Service -name song
    WaitUntilServices "song" "Stopped"

    robocopy $root\files $pubroot\files /MIR
    robocopy $pubroot $deployroot /MIR

    Start-Service -name song
    WaitUntilServices "song" "Running"
}

$root = Get-Location;

$deployroot = "c:\tmp\deploy\song"
$pubroot = Join-Path $root "Songs.Web\bin\Release\netcoreapp3.1\publish"
$clientroot = Join-Path $root "Songs.Web\ClientApp"

if ($args[0] -eq "env") {
    Set-Location $deployroot
    Set-Location $pubroot
    Set-Location $clientroot

    Write-Host "deploy "  $deployroot
    Write-Host "publish" $pubroot
    Write-Host "client " $clientroot
}
elseif ($args[0] -eq "client") {
    buildClient
}
elseif ($args[0] -eq "deploy") {
    deployAll
}
else {
    Write-Host "Usage:  deploySongs env | client | deploy"
}

Set-Location $root

