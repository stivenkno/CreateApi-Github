// Función para validar el nombre de usuario de GitHub
export const isValidGitHubUsername = (username) => {
    // Expresión regular para verificar caracteres válidos
    const validUsernameRegex = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;
  
    // Verificar longitud del nombre de usuario
    if (username.length < 1 || username.length > 39) {
      return false;
    }
  
    // Verificar caracteres permitidos
    if (!validUsernameRegex.test(username)) {
      return false;
    }
  
    // Verificar que no comience ni termine con guión
    if (username.startsWith('-') || username.endsWith('-')) {
      return false;
    }
  
    return true;
  }

// Función para validar el nombre de un repositorio de GitHub
export const isValidGitHubRepoName = (repoName) => {
    // Expresión regular para verificar caracteres válidos
    const validRepoNameRegex = /^[a-z\d-]{1,100}$/i;
  
    // Verificar longitud del nombre del repositorio
    if (repoName.length < 1 || repoName.length > 100) {
      return false;
    }

    // Verificar caracteres permitidos
    if (!validRepoNameRegex.test(repoName)) {
      return false;
    }

    console.log("Hello")
  
    return true;
  };
  