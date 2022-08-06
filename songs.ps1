
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

    npx ng build --configuration production  --output-path $pubroot\ClientApp\dist

    Write-Host angular build complete
}

function copySongFiles() {
    robocopy $songroot $deployroot\files /MIR 
    robocopy $songroot $pubroot\files /MIR   
}

function deployAll() {
    
    Write-Host "initiating sc stop songs"
    Stop-Service -name song -ErrorAction Stop
    Start-Sleep -Seconds 1

    Write-Host "begin dotnet publish"
    
    Start-Process -FilePath "dotnet" -Wait  -ArgumentList "publish -c Release" -ErrorAction Stop

    Write-Host "dotnet publish complete.   starting client buid"

    buildClient

    Write-Host "client build complete.  waiting for service to stop"
    WaitUntilServices "song" "Stopped"

    robocopy $songroot $pubroot\files /MIR

    robocopy $pubroot $deployroot /MIR

    Write-Host "deploy complete.  initiating sc start songs"

    Start-Service -name song
    WaitUntilServices "song" "Running"
}

function copyDist() {
    WaitUntilServices "song" "Stopped"

    robocopy $songroot $pubroot\files /MIR

    robocopy $pubroot $deployroot

    Start-Service -name song
    WaitUntilServices "song" "Running"
}

function usage() {
    Write-Host ""
    Write-Host "Usage:  songs env | client | deploy | files"
    Write-Host ""
    Write-Host "files:  copies the song text files"
    Write-Host "client: builds angular app  and copeis  files"
    Write-Host "deploy: server + client + files"
}

$root = Get-Location;

$deployroot = "c:\tmp\deploy\song"
$pubroot = Join-Path $root "Songs.Web\bin\Release\netcoreapp3.1\publish"
$clientroot = Join-Path $root "Songs.Web\ClientApp"
$songroot = "C:\Users\Todd\OneDrive\Todd\music\songs"

if (!(Test-Path "songs.sln")) {
    $defaultRoot = "c:/dev/songs"
    Write-Host "Need to run from the root of songs solution e.g. " $defaultRoot 
    return 
}

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
elseif ($args[0] -eq "files") {
    copySongFiles
}
elseif ($args[0] -eq "deploy") {
    Write-Host "***   Make sure you are running as administrator or the stop start service will fail"
    deployAll
}
elseif ($args[0] -eq "copyDist") {
    Write-Host "***   Make sure you are running as administrator or the stop start service will fail"
    copyDist
}
else {
    usage
}

Set-Location $root