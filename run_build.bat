set PATH=C:\Users\91982\node-v20;%PATH%
rmdir /s /q .next
call npm run build > build_check.txt 2>&1
echo %ERRORLEVEL% > build_status.txt
