
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

function copySongFiles() {
    robocopy $root\files $deployroot\files /MIR  
}
function deployAll() {
    Start-Process -FilePath "dotnet" -Wait  -ArgumentList "publish -c Release" 

    Write-Host "dotnet publish complete"

    buildClient

    Stop-Service -name song -ErrorAction Stop
    WaitUntilServices "song" "Stopped"

    robocopy $pubroot\files $root\files  /MIR  
    robocopy $pubroot $deployroot /MIR

    Start-Service -name song
    WaitUntilServices "song" "Running"
}

function usage() {
    Write-Host "Usage:  songs env | client | deploy"
}

$root = Get-Location;

$deployroot = "c:\tmp\deploy\song"
$pubroot = Join-Path $root "Songs.Web\bin\Release\netcoreapp3.1\publish"
$clientroot = Join-Path $root "Songs.Web\ClientApp"

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
else {
    usage
}


    

Set-Location $root