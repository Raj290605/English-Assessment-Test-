set PATH=C:\Users\91982\node-v20;%PATH%
node check_assessments.js > check_assessments_out.txt 2>&1
echo %ERRORLEVEL% > check_assessments_status.txt
