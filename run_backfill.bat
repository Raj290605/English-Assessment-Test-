set PATH=C:\Users\91982\node-v20;%PATH%
node backfill_execute.js > backfill_out.txt 2>&1
echo %ERRORLEVEL% > backfill_status.txt
