set PATH=C:\Users\91982\node-v20;%PATH%
npm run build > scratch\build_out.txt 2>&1
echo %ERRORLEVEL% > scratch\build_status.txt
