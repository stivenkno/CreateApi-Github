import { Octokit } from "@octokit/rest";
import { config } from "dotenv";
import { isValidGitHubUsername, isValidGitHubRepoName } from "./utils.js";

config(); // Cargar las variables de entorno

// Configurar Octokit con el token de acceso personal
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

/*
   Descripción: Función para obtener un usuario de GitHub
   parámetros:
   `username` (string) Nombre de usuario de GitHub

   queries:
   `include_repos` (boolean) incluir la lista de repositorios. include_repos=(bool)

   Ejemplo de uso: /api/github/user/username?include_repos=true
*/
export const getUser = async (req, res) => {
  const { username } = req.params;
  const include_repos = req.query.include_repos === "true"; // Convertir a booleano

  if (!isValidGitHubUsername(username)) {
    return res.status(400).json({
      message: `400 Bad Request: El parámetro ${username} no es válido.`,
    });
  }

  try {
    // Hacer una solicitud a la API de GitHub para obtener el usuario
    const { data } = await octokit.users.getByUsername({ username }); // Devuelve los datos del usuario, si no existe error 404

    if (include_repos) {
      // Agregar la lista de repositorios a userData
      data.repos = await getReposBasicInfoList(username);
    }

    res.status(200).json(data); // Pedido exitoso
  } catch (error) {
    if (error.status === 404) {
      // Si el usuario no existe, devolver un código de estado 404
      return res.status(404).json({
        message: "404 Not Found: El nombre de usuario proporcionado no existe.",
      });
    } else {
      // Para otros errores, devolver un código de estado 500
      res.status(500).json({
        message: "500 Internal Server Error: Error del servidor al procesar la solicitud.",
      });
    }
  }
};

/*
   Descripción: Función para obtener los repositorios de un usuario de GitHub
   parámetros:
   `username` (string) Nombre de usuario de GitHub

  queries:
   `sort` (string) - Criterio para ordenar los repositorios. Valores posibles: `created`, `updated`, `pushed`, `full_name`. Por defecto, `full_name`.
   `direction` (string) - Dirección de la ordenación. Valores posibles: `asc`, `desc`. Por defecto, `asc`.

   Ejemplo de uso: /api/github/user/username/repos?sort=updated&direction=desc
*/
export const getRepos = async (req, res) => {
  const { username } = req.params;
  const sort = req.query.sort || 'full_name';
  const direction = req.query.direction || 'asc';

  if (!isValidGitHubUsername(username)) {
    return res.status(400).json({
      message: `400 Bad Request: El parámetro ${username} no es válido.`,
    });
  }

  try {
    const { data } = await octokit.users.getByUsername({ username }); // Verificar si el usuario existe, si no existe error 404

    const reposResponse = await octokit.repos.listForUser({
      username,
    });

    // Mapear los datos básicos de repositorios
    const reposList = reposResponse.data.map((repo) => ({
      name: repo.name,
      html_url: repo.html_url,
      description: repo.description,
      updated_at: repo.updated_at,
      created_at: repo.created_at,
      pushed_at: repo.pushed_at,
    }));

    // Ordenar la lista de repositorios según el criterio especificado
    switch (sort) {
      case 'created':
        reposList.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
      case 'updated':
        reposList.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
        break;
      case 'pushed':
        reposList.sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at));
        break;
      case 'full_name':
        reposList.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        reposList.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    // Revertir la lista de repositorios si la ordenación es descendente
    if (direction === 'desc') {
      reposList.reverse();
    }

    res.status(200).json(reposList); // Pedido exitoso
  } catch (error) {
    if (error.status === 404) {
      // Si el usuario no existe, devolver un código de estado 404
      return res.status(404).json({
        message: "404 Not Found: El nombre de usuario proporcionado no existe.",
      });
    } else {
      // Para otros errores, devolver un código de estado 500
      res.status(500).json({
        message: "500 Internal Server Error: Error del servidor al procesar la solicitud.",
      });
    }
  }
};

/* Descripción: Recupera información detallada sobre un repositorio público específico de un usuario de GitHub.
Parámetros:
Path Parameters:
`:username` (string) - El nombre de usuario de GitHub.
`:repo` (string) - El nombre del repositorio del que se desea obtener información.

Ejemplo de uso: /api/github/user/:username/repos/:repo
*/
export const getRepoDetails = async (req, res) => {
  const { username, repo } = req.params; // Se piden los parámetros de nombre de ususario y repositorio
  if (!isValidGitHubUsername(username)) {
    return res.status(400).json({
      message: `400 Bad Request: El parámetro ${username} no es válido.`,
    });
  }

  if (!isValidGitHubRepoName(repo)) {
    return res.status(400).json({
      message: `400 Bad Request: El parámetro ${repo} no es válido.`,
    });
  }

  

  try {
    const { data } = await octokit.repos.get({
      owner: username,
      repo,
    }); // Verificar si el repositorio existe, si no existe error 404

    res.status(200).json(data); // Pedido exitoso con el repositorio
  } catch (error) {
    if (error.status === 404) {
      // Si el repositorio no existe, devolver un código de estado 404
      return res.status(404).json({
        message: "404 Not Found: El repositorio proporcionado no existe.",
      });
    } else {
      // Para otros errores, devolver un código de estado 500
      res.status(500).json({
        message: "500 Internal Server Error: Error del servidor al procesar la solicitud.",
      });
    }
  }
};

/* 
  Función para obtener la lista de repositorios de un usuario de GitHub
*/
const getReposBasicInfoList = async (username) => {
  const reposResponse = await octokit.repos.listForUser({
    username,
  });

  // Mapear los datos básicos de repositorios
  const reposList = reposResponse.data.map((repo) => ({
    name: repo.name,
    html_url: repo.html_url,
    description: repo.description,
    updated_at: repo.updated_at,
  }));

  return reposList;
};