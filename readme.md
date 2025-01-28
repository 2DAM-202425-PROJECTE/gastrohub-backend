npm i -g nodemon
npm i -g typescript
npm i

nodemon dist/app.js
tsc --watch

docker

docker pull postgres

docker run --name NOM -p 5432:5432 -e postgres_password=CONTRASEÑA -d postgres
docker run --name gastrohub -e POSTGRES_PASSWORD=gastrohubadmin -d -p 5432:5432 postgres

docker exec -it gastrohub bash
psql -U postgres
CREATE DATABASE gastrohub;

