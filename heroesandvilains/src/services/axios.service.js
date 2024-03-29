import axios from "axios";
import {eventBus} from "./../utilits/eventBus"

// créer une instance personnalisée d'Axios
const axiosAgent = axios.create({
  baseURL: "https://apidemo.iut-bm.univ-fcomte.fr/herocorp",
  headers: {
    "Content-Type": "application/json",
  },
});

// méthode de traitement des erreurs
const handleError = (error) => {
  const errorMessage = error.response
    ? error.response.data.data
    : "Une erreur réseau est survenue.";

    eventBus.$emit('show-snackbar', errorMessage);
};

// méthode générique pour les requêtes GET
const get = (url) => {
  return axiosAgent
    .get(url)
    .then((response) => response.data)
    .catch(handleError);
};

// méthode générique pour les requêtes POST
const post = (url, data) => {
  return axiosAgent
    .post(url, data)
    .then((response) => response.data)
    .catch(handleError);
};

// méthode générique pour les requêtes PUT
const put = (url, data) => {
  return axiosAgent
    .put(url, data)
    .then((response) => response.data)
    .catch(handleError);
};

const patch = (url, data) => {
  return axiosAgent
    .patch(url, data)
    .then((response) => response.data)
    .catch(handleError);
};

export default {
  get,
  post,
  put,
  patch
};
