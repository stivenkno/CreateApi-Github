import app from "./app.js"; // Importamos app de app.js
import { config } from "dotenv"; // Importamos dotenv para gestionar variables de entorno

console.clear(); // Limpiamos la consola para mantener el log limpio

config(); // Cargamos las variables de entorno desde el archivo .env

const PORT = process.env.PORT || 3001; // Definimos que el puerto será el 3001 o el que nos dé el servidor

// Iniciamos el servidor en el puerto definido y mostramos un mensaje de comprobación
app.listen(PORT, () => {
  console.log(`>>>>>>>>> Server on port ${PORT}`);
});
