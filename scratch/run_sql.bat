set PATH=C:\Users\91982\node-v20;%PATH%
node scratch\run_sql_seq.js > scratch\sql_out.txt 2>&1
echo %ERRORLEVEL% > scratch\sql_status.txt
