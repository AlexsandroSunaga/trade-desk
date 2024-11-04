$root = $PSScriptRoot
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$root\nest-api'; npm run start:dev"
Start-Sleep -Seconds 3
Set-Location "$root\web"
$env:VITE_API_BASE = "http://localhost:8012"
npm run dev
