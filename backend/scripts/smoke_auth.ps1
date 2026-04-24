Set-Location "$PSScriptRoot\.."
$ErrorActionPreference = "Stop"

$pythonCmd = "e:/pgliving/.venv/Scripts/python.exe"
$tokensOutput = & $pythonCmd scripts/generate_dev_tokens.py
$adminToken = ($tokensOutput | Where-Object { $_ -like 'ADMIN=*' }) -replace '^ADMIN=', ''
$ownerToken = ($tokensOutput | Where-Object { $_ -like 'OWNER=*' }) -replace '^OWNER=', ''
$studentToken = ($tokensOutput | Where-Object { $_ -like 'STUDENT=*' }) -replace '^STUDENT=', ''

Write-Host "Running authenticated smoke tests..."

if (-not $adminToken -or -not $ownerToken -or -not $studentToken) {
  throw "Token generation failed. Ensure backend/.env has DEV_AUTH_SECRET and DEV_AUTH_ENABLED=true"
}

$ownerHeaders = @{ Authorization = "Bearer $ownerToken" }
$studentHeaders = @{ Authorization = "Bearer $studentToken" }
$adminHeaders = @{ Authorization = "Bearer $adminToken" }

$createBody = @{
  title = "Owner Smoke Listing"
  property_type = "pg"
  primary_college_id = "sample-college-1"
  address_text = "Near College Gate"
  latitude = 17.39
  longitude = 78.48
  rent_min = 7000
  rent_max = 9000
  security_deposit = 5000
  amenities = @("wifi", "food")
} | ConvertTo-Json

$created = Invoke-RestMethod -Uri "http://localhost:8000/api/v1/owner/properties" -Method POST -Headers $ownerHeaders -ContentType "application/json" -Body $createBody
Write-Host "OWNER_CREATE_OK property_id=$($created.property_id)"

$pending = Invoke-RestMethod -Uri "http://localhost:8000/api/v1/admin/listings/pending" -Method GET -Headers $adminHeaders
Write-Host "ADMIN_PENDING_OK count=$($pending.Count)"

$approve = Invoke-RestMethod -Uri "http://localhost:8000/api/v1/admin/properties/$($created.property_id)/approve" -Method PATCH -Headers $adminHeaders
Write-Host "ADMIN_APPROVE_OK status=$($approve.approval_status)"

$shortlist = Invoke-RestMethod -Uri "http://localhost:8000/api/v1/properties/$($created.property_id)/shortlist" -Method POST -Headers $studentHeaders
Write-Host "STUDENT_SHORTLIST_OK property_id=$($shortlist.property_id)"

$alertsBody = @{ college_id = "sample-college-1"; radius_km = 2; active = $true } | ConvertTo-Json
$alert = Invoke-RestMethod -Uri "http://localhost:8000/api/v1/me/alerts" -Method POST -Headers $studentHeaders -ContentType "application/json" -Body $alertsBody
Write-Host "STUDENT_ALERT_OK alert_id=$($alert.alert_id)"

$overview = Invoke-RestMethod -Uri "http://localhost:8000/api/v1/admin/analytics/overview" -Method GET -Headers $adminHeaders
Write-Host "ADMIN_ANALYTICS_OK total_properties=$($overview.total_properties)"
