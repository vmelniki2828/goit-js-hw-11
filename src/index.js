import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import myJs from "./js/myJs";

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

const fs = new myJs();
let galleryPhoto = new SimpleLightbox('.gallery a', { captionsData: 'alt',
    captionPosition:'bottom', captionDelay: 250});


form.addEventListener('submit', onSearchBtn);
loadMoreBtn.addEventListener('click', onLoadMore);

async function onSearchBtn(evt) {
  evt.preventDefault();
  clearMarkup();
  fs.query = evt.currentTarget.elements.searchQuery.value;
  fs.resetPage();
  if (fs.query.trim() === '') {
    return;
  }
  try {
    const response = await fs.onFetchPixabay();
    renderMarkup(response);
    loadMoreBtn.classList.remove('ishidden');
  }
  catch (error) {
    console.log(error.message);
  };
}

async function onLoadMore() {
  try {
    const response = await fs.onFetchPixabay();
    if(response.length === 0) {
      Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
      loadMoreBtn.classList.add('ishidden');
    }
    renderMarkup(response);
  }
  catch (error) {
    console.log(error.message);
  };

}

function clearMarkup() {
    gallery.innerHTML = '';
    loadMoreBtn.classList.add('ishidden');
}

function renderMarkup(images) {
  const markup = images
    .map(
      image =>
   
        (
            image = `<a  href="${image.largeImageURL}">
            <div class="thumb">            
            <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy"  />
            </div>
            <div class="info">
              <p class="info-item">
               <span><b>Likes</b></span><span>${image.likes}</span>  
              </p>
              <p class="info-item">
                <span><b>Views</b></span><span> ${image.views}</span> 
              </p>
              <p class="info-item">
                <span><b>Comments</b></span><span> ${image.comments}</span> 
              </p>
              <p class="info-item">
                <span><b>Downloads</b></span><span>${image.downloads}</span> 
              </p>
            </div>
          </a>`
        )
    )
    .join('');
    gallery.insertAdjacentHTML("beforeend",markup);
    galleryPhoto.refresh();

}