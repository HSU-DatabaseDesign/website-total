# 백엔드 프로세스 종료 PowerShell 스크립트

Write-Host "포트 8080을 사용하는 프로세스를 찾는 중..." -ForegroundColor Yellow

# 포트 8080을 사용하는 프로세스 찾기
$connections = netstat -ano | Select-String ":8080" | Select-String "LISTENING"

if ($null -eq $connections) {
    Write-Host "포트 8080을 사용하는 프로세스가 없습니다." -ForegroundColor Green
    exit 0
}

# PID 추출
$pid = ($connections -split '\s+')[-1]

if ($pid) {
    Write-Host "프로세스 PID: $pid 종료 중..." -ForegroundColor Yellow
    taskkill /F /PID $pid
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ 백엔드 프로세스가 종료되었습니다." -ForegroundColor Green
    } else {
        Write-Host "❌ 프로세스 종료 실패" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "PID를 찾을 수 없습니다." -ForegroundColor Red
    exit 1
}

