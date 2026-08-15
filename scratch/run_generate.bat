set PATH=C:\Users\91982\node-v20;%PATH%
npx prisma generate > scratch\generate_out.txt 2>&1
echo %ERRORLEVEL% > scratch\generate_status.txt
