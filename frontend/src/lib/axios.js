import axios from 'axios'

export const axiosInstance=axios.create({
  baseURL: 'http://localhost:5001/api', //replace with your backend url
  withCredentials: true //send cookies in every single request
})