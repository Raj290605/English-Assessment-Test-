set PATH=C:\Users\91982\node-v20;%PATH%
node scratch\backfill.js > scratch\backfill_out.txt 2>&1
echo %ERRORLEVEL% > scratch\backfill_status.txt
