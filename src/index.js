import 'simplelightbox/dist/simple-lightbox.min.css';
import SearchImages from './js/fetchImages';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import simpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import './css/styles.css';

const searchImages = new SearchImages();

const refs = {
    searchForm: document.querySelector('.search-form'),
    gallery: document.querySelector('.gallery'),
    loadMoreBtn: document.querySelector('.load-more'),
    seaerchBtn: document.querySelector('.seaerch-button'),
};

const lightbox = new simpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionsDelay: '250',
});

refs.loadMoreBtn.classList.add('hidden');

refs.searchForm.addEventListener('submit', onSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

async function onSubmit (e) {
    e.preventDefault();
    clearGallery();

    refs.loadMoreBtn.classList.add('hidden');

    searchImages.searchQuery = e.currentTarget.elements.searchQuery.value.trim();

    if (searchImages.searchQuery === '') {
        Notify.failure(`Please, enter your request`);
        return;
    }

    searchImages.resetPage();

    const imageData = await searchImages.fetchImages()

    renderGallery(imageData);
    
    if (imageData.totalHits !== 0) {
        Notify.success(`Hooray! We found ${imageData.totalHits} images.`);
    }

    searchImages.incrementPage();

    if (imageData.hits.length < imageData.totalHits) {
        refs.loadMoreBtn.classList.remove('hidden');
    }
};

async function onLoadMore () {
    const loadMoreImages = await searchImages.fetchImages();

    renderGallery(loadMoreImages);

    searchImages.incrementPage();

    if ((searchImages.page - 1) * 40 >= loadMoreImages.totalHits) {
        refs.loadMoreBtn.classList.add('hidden'); 
    }
}

function renderGallery(data) {
    try{
        if (data.totalHits === 0) {
                refs.loadBtn.classList.add('hidden');
                Notify.failure(`Sorry, there are no images matching your search query. Please try again.`);
                return;
            }

        const imgCards = data.hits.map(({
            webformatURL,
            largeImageURL,
            tags,
            likes,
            views,
            comments,
            downloads,
            }) => `<div class="photo-card">
                        <a class="photo-card__item" href="${largeImageURL}">
                            <div class="photo-card__tumb">
                                <img class="photo-card__img" src="${webformatURL}" alt="${tags}" loading="lazy" />
                            </div>
                            <div class="info">
                                <p class="info-item">
                                    <b class="info-item__param">Likes</b>
                                    <span class="info-item__num">${likes}</span>
                                </p>
                                <p class="info-item">
                                    <b class="info-item__param">Views</b>
                                    <span class="info-item__num">${views}</span>
                                </p>
                                <p class="info-item">
                                    <b class="info-item__param">Comments</b>
                                    <span class="info-item__num">${comments}</span>
                                </p>
                                <p class="info-item">
                                    <b class="info-item__param">Downloads</b>
                                    <span class="info-item__num">${downloads}</span>
                                </p>
                            </div>
                        </a>
                    </div>`).join('');

        refs.gallery.insertAdjacentHTML('beforeend', imgCards);

        lightbox.refresh();
    } catch (error) {
        Notify.failure(`Oops! Something went wrong. Error: ${error.message}`);
    };

};

const clearGallery = () => (refs.gallery.innerHTML = '');
