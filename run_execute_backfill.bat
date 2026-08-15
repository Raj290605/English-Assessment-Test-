set PATH=C:\Users\91982\node-v20;%PATH%
node execute_backfill.js > execute_backfill_out.txt 2>&1
echo %ERRORLEVEL% > execute_backfill_status.txt
