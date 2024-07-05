import { Router } from "express";
import path from 'path';
import { fileURLToPath } from 'url';
import { getUser, getRepos, getRepoDetails } from "../controllers/controllers.js";

const router = Router();

// Obtener el directorio actual en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ruta para la raíz de la API, sirve el archivo HTML
router.get("/", (req, res) => {
  console.log("Rutas de la API");
  res.sendFile(path.join(__dirname, '../../public', 'index.html'));  // Se envia el archivo HTML con la documentación
});


router.get("/github/user/:username", getUser); // Ruta para obtener un usuario de GitHub. query: include_repos
router.get("/github/user/:username/repos", getRepos); // Ruta para obtener los repositorios de un usuario de GitHub
router.get("/github/user/:username/repos/:repo",  getRepoDetails ); // Ruta para obtener la información detallada de un repositorio

export default router; //Exportamos las rutas
