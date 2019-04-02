import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://mvp-ro.firebaseio.com/'
})

export default instance;