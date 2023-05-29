const axios = require('axios').default;
const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '36842504-7fab98a4d3d9ea25f6c54f655';

export default class SearchImages {
    constructor() {
        this.searchQuery = "";
        this.page = 1;
        this.per_page = 40;
    }

    async fetchImages() {

        const images = await axios.get(`${BASE_URL}?key=${API_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${this.per_page}&page=${this.page}`);
        console.log(images.data);
        return images.data;
    }

    incrementPage() {
        this.page += 1;
    }

    resetPage() {
        this.page = 1;
    }

    get searchQuery() {
        return this.query;
    }

    set searchQuery(newQuery) {
        this.query = newQuery;
    }
    
}