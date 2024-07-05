import express from 'express';  //framework para crear el servidor
import path from 'path'; // Módulo para trabajar con rutas de archivos
import router from './src/routers/routes.js'; //importamos las rutas de routes.js
import { fileURLToPath } from 'url';

const app = express(); //instanciamos Express

// Obtener el directorio actual en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json()); //usamos express para poder recibir y enviar archivos json

// Middleware para servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

app.use("/api", router); // middleware para usar las rutas de routes.js

app.get('/', (req, res) => {
    res.send('Hello World!');
});

export default app; //exportamos app