# FilaVirtualBack

Backend para un proyecto simple pero que utiliza varias tecnologías para lograr una fila virtual en tiempo real con un CRUD de turnos.

## Comenzando 🚀

Usa `npm i` para instalar los paquetes necesarios.

Conecta una base de datos, crea un archivo .env y pega la uri de mongoDB con este nombre de variable MONGO_URI.

Corre `npm run dev` para levantar un servidor dev.

Ve a `http://github.com/benjapob/fila-virtual-front` y sigue las instrucciones para levantar el front si aún no lo has hecho.

## Overview

El backend consta de 4 rutas, get, create, update y delete.

Se usa socket para mandar señales de actualización al front cada vez que se haga una operación que involucre los turnos.

## Construido con 🛠️

* [Express](https://expressjs.com/es/) - El framework para el Backend

* [Mongoose](https://mongoosejs.com/docs/guide.html) - Para conectar la base de datos

* [Socket](https://socket.io/docs/v4/) - Para manejar las actualizaciones en tiempo real

---
⌨️ por [benjapob](https://github.com/benjapob)