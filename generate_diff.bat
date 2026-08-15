set PATH=C:\Users\91982\node-v20;%PATH%
call npx prisma migrate diff --from-schema-datasource prisma/schema.prisma --to-schema-datamodel prisma/schema.prisma --script > add_snapshot.sql 2> diff_error.txt
echo %ERRORLEVEL% > diff_status.txt
