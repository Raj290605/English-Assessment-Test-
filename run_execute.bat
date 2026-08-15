set PATH=C:\Users\91982\node-v20;%PATH%
node execute_sql2.js > execute_out.txt 2>&1
echo %ERRORLEVEL% > execute_status.txt
