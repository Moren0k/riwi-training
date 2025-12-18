# Andres

Editar la cadena de coneccion;

"Server=localhost;Port=3306;Database=defaultdb;User=kevin;Password=4995;SslMode=None;"

## BORRAR LA BASE COMPLETA

DROP DATABASE defaultdb;
CREATE DATABASE defaultdb;
USE defaultdb;

## > BORRAR MIGRACIÓN DEFECTUOSA <

## CREAR MIGRACIÓN NUEVA
dotnet ef migrations add InitialCreate \
 --project src/TalentoPlus.Infrastructure \
 --startup-project src/TalentoPlus.Api \
 --context TalentoPlusDbContext

## APLICAR MIGRACIÓN
dotnet ef database update \
 --project src/TalentoPlus.Infrastructure \
 --startup-project src/TalentoPlus.Api \
 --context TalentoPlusDbContext

