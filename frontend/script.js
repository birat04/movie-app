const APILINK = 'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=41ee980e4b5f05f6693fda00eb7c4fd4&page=1';
const IMG_PATH = "https://image.tmdb.org/t/p/w1280";
const SEARCHAPI = "https://api.themoviedb.org/3/search/movie?&api_key=41ee980e4b5f05f6693fda00eb7c4fd4&query=";
const REVIEWS_API_URL = 'http://localhost:8000/api/v1/reviews/movie/'; 

const main = document.getElementById("section");
const form = document.getElementById("form");
const search = document.getElementById("query");
const movieDetailsModal = document.getElementById("movie-details-modal");
const modalContent = document.getElementById("modal-content");
const closeModalBtn = document.getElementById("close-modal");

returnMovies(APILINK);

function returnMovies(url) {
  fetch(url)
    .then(res => res.json())
    .then(function (data) {
      console.log(data.results);
      main.innerHTML = ""; 
      data.results.forEach(element => {
        const div_card = document.createElement('div');
        div_card.setAttribute('class', 'card');
        
        const image = document.createElement('img');
        image.setAttribute('class', 'thumbnail');
        image.setAttribute('id', 'image');
        image.src = IMG_PATH + element.poster_path;

       
        image.addEventListener('click', () => {
          console.log("Image clicked:", element.title); 
          showMovieDetails(element);
        });
  
        const title = document.createElement('h3');
        title.setAttribute('id', 'title');
        title.innerHTML = `${element.title}`;
  
        const div_column = document.createElement('div');
        div_column.setAttribute('class', 'column');
  
        const center = document.createElement('center');
        center.appendChild(image);
  
        div_card.appendChild(center);
        div_card.appendChild(title);
        div_column.appendChild(div_card);
        main.appendChild(div_column);

        getReviews(element.id, div_card);
      });
    });
}

function showMovieDetails(movie) {
  
  const movieInfo = `
    <h2>${movie.title}</h2>
    <p><strong>Release Date:</strong> ${movie.release_date}</p>
    <p><strong>Overview:</strong> ${movie.overview}</p>
    <p><strong>Rating:</strong> ${movie.vote_average}</p>
  `;
  
  modalContent.innerHTML = movieInfo; 
  movieDetailsModal.style.display = "block"; 
}


closeModalBtn.addEventListener('click', () => {
  movieDetailsModal.style.display = "none";
});


window.addEventListener('click', (e) => {
  if (e.target === movieDetailsModal) {
    movieDetailsModal.style.display = "none";
  }
});

function getReviews(movieId, movieCard) {
  fetch(`${REVIEWS_API_URL}${movieId}`)
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        console.log('No reviews found.');
        return;
      }
      const reviewsDiv = document.createElement('div');
      reviewsDiv.setAttribute('class', 'reviews');
      
      data.forEach(review => {
        const reviewElement = document.createElement('p');
        reviewElement.innerHTML = `<strong>${review.user}</strong>: ${review.review}`;
        reviewsDiv.appendChild(reviewElement);
      });

      const reviewForm = document.createElement('form');
      reviewForm.setAttribute('class', 'review-form');
      
      const reviewInput = document.createElement('input');
      reviewInput.setAttribute('type', 'text');
      reviewInput.setAttribute('placeholder', 'Write a review');
      
      const submitButton = document.createElement('button');
      submitButton.textContent = 'Submit Review';
      
      reviewForm.appendChild(reviewInput);
      reviewForm.appendChild(submitButton);
      
      reviewForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const reviewText = reviewInput.value;
        const user = 'Guest'; 

        if (reviewText) {
          postReview(movieId, user, reviewText);
          reviewInput.value = ''; 
          addReviewToUI(movieId, user, reviewText, reviewsDiv); 
        }
      });

      movieCard.appendChild(reviewsDiv);
      movieCard.appendChild(reviewForm);
    });
}

function postReview(movieId, user, review) {
  const reviewData = {
    movieId: movieId,
    user: user,
    review: review
  };

  fetch('http://localhost:8000/api/v1/reviews/new', {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(reviewData)
  })
    .then(res => res.json())
    .then(result => {
      console.log(result);
      alert('Review submitted successfully');
    })
    .catch(err => console.error('Error posting review:', err));
}

function addReviewToUI(movieId, user, review, reviewsDiv) {
  const newReview = document.createElement('p');
  newReview.innerHTML = `<strong>${user}</strong>: ${review}`;
  reviewsDiv.appendChild(newReview);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  main.innerHTML = ''; 

  const searchItem = search.value;

  if (searchItem) {
    returnMovies(SEARCHAPI + searchItem);
    search.value = ""; 
  }
});
