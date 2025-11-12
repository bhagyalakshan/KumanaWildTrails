import axios from "axios";

const BASE_URL = "http://localhost:8080/api/safari";

export const addPoint = (point) => axios.post(`${BASE_URL}/point`, point);
export const getPoints = (tourId) => axios.get(`${BASE_URL}/points/${tourId}`);
