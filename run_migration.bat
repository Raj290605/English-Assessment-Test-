set PATH=C:\Users\91982\node-v20;%PATH%
call npx prisma migrate dev --name add_question_snapshot_and_active > migrate_out.txt 2>&1
echo %ERRORLEVEL% > migrate_status.txt
