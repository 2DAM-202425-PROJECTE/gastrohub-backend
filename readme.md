npm i -g nodemon
npm i -g typescript
npm i

nodemon dist/app.js
tsc --watch

docker

docker pull postgres

docker run --name NOM -p 5432:5432 -e postgres_password=CONTRASEÑA -d postgres