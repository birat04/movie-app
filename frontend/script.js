const APILINK = 'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=41ee980e4b5f05f6693fda00eb7c4fd4&page=1';
    const IMG_PATH = "https://image.tmdb.org/t/p/w1280";
    const SEARCHAPI = "https://api.themoviedb.org/3/search/movie?&api_key=41ee980e4b5f05f6693fda00eb7c4fd4&query=";

    const main = document.getElementById("section");
    const form = document.getElementById("search-form");
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
            image.src = IMG_PATH + element.poster_path;

            
            image.addEventListener('click', () => {
              showMovieDetails(element);
            });

            const title = document.createElement('h3');
            title.innerHTML = `${element.title}`;

            div_card.appendChild(image);
            div_card.appendChild(title);
            main.appendChild(div_card);
          });
        })
        .catch(err => {
          console.error('Error fetching movies:', err);
          main.innerHTML = `<p>Failed to load movies. Please try again later.</p>`;
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

    
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const searchItem = search.value;

      if (searchItem) {
        returnMovies(SEARCHAPI + searchItem);
        search.value = ""; 
      }
    });
