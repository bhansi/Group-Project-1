document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("searchForm");

  const inputContainers = document.getElementsByClassName("input-container");
  const cbFields = document.getElementsByClassName("checkbox-field");
  const inputFields = document.getElementsByClassName("input-field");

  const cbEisodeQuantity = document.getElementById("cbEpisodeQuantity");
  const cbSeriesRating = document.getElementById("cbSeriesRating");
  const cbEpisodeGenre = document.getElementById("cbEpisodeGenre");

  const btnBinge = document.getElementById("btnBinge");

  let optionChecked = false;

  function isOptionChecked() {
    return cbEisodeQuantity.checked || cbSeriesRating.checked || cbEpisodeGenre.checked;
  }

  cbEisodeQuantity.addEventListener("click", function() {
    if(cbEisodeQuantity.checked) {
      inputContainers[0].style.border = "solid";
      inputFields[0].style.transform = "translateX(0%)";
      cbFields[0].classList.add("rounded-l-lg");

      if(!optionChecked) {
        btnBinge.style.transform = "translateY(0%)";
        optionChecked = true;
      }
    }
    else {
      inputContainers[0].style.border = "solid rgb(5 150 105)";
      inputFields[0].style.transform = "translateX(-100%)";
      cbFields[0].classList.remove("rounded-l-lg");
      
      if(!isOptionChecked()) {
        btnBinge.style.transform = "translateY(-150%)";
        optionChecked = false;
      }
    }
  });
  
  cbSeriesRating.addEventListener("click", function() {
    if(cbSeriesRating.checked) {
      inputContainers[1].style.border = "solid";
      inputFields[1].style.transform = "translateX(0%)";
      cbFields[1].classList.add("rounded-l-lg");
      
      if(!optionChecked) {
        btnBinge.style.transform = "translateY(0%)";
        optionChecked = true;
      }
    }
    else {
      inputContainers[1].style.border = "solid rgb(5 150 105)";
      inputFields[1].style.transform = "translateX(-100%)";
      cbFields[1].classList.remove("rounded-l-lg");
      
      if(!isOptionChecked()) {
        btnBinge.style.transform = "translateY(-150%)";
        optionChecked = false;
      }
    }
  });
    
  cbEpisodeGenre.addEventListener("click", function() {
    if(cbEpisodeGenre.checked) {
      inputContainers[2].style.border = "solid";
      inputFields[2].style.transform = "translateX(0%)";
      cbFields[2].classList.add("rounded-l-lg");
      
      if(!optionChecked) {
        btnBinge.style.transform = "translateY(0%)";
        optionChecked = true;
      }
    }
    else {
      inputContainers[2].style.border = "solid rgb(5 150 105)";
      inputFields[2].style.transform = "translateX(-100%)";
      cbFields[2].classList.remove("rounded-l-lg");
  
      if(!isOptionChecked()) {
        btnBinge.style.transform = "translateY(-150%)";
        optionChecked = false;
      }
    }
  });
  
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const episodeQuantity = document.getElementById("nbrEpisodeQuantity").value;
    const seriesRating = document.getElementById("nbrSeriesRating").value;
    const episodeGenre = document.getElementById("ddEpisodeGenre").value;
    const resultsDiv = document.getElementById("results");
    
    // Clear past search results for current search results
    resultsDiv.innerHTML = "";
    
    let page = 0;
    let numberOfDisplayedSeries = 0;
    let doneDisplaying = false;
    
    let query = "";
    if (episodeGenreChecked) {
      query += `&with_genres=${episodeGenre}`;
    }
    if (seriesRatingChecked) {
      query += `&vote_average.gte=${seriesRating}`;
    }

    try {
      while(!doneDisplaying) {
          page++;
          const apiKey = "3e1cf70d880acb18f154700af5ac63f8";
          const url = "https://api.themoviedb.org/3/discover/tv?include_adult=true&include_null_first_air_dates=true&language=en-US&sort_by=popularity.desc" + query + "&page=" + page + "&api_key=" + apiKey;
          
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();

          let shows = data.results;

          shows = await Promise.all(shows.map(async show => {
            const seriesUrl = `https://api.themoviedb.org/3/tv/${show.id}?language=en-US&api_key=${apiKey}`;
            const seriesResponse = await fetch(seriesUrl);
            const seriesData = await seriesResponse.json();
            show.total_episodes = seriesData.number_of_episodes;
            show.rating = seriesData.vote_average;
            return show;
          }));

          if(shows.length < 1) { break; } // Stop calling API if there are no more shows

          if (episodeQuantityChecked) {
            shows = shows.filter(show => show.total_episodes >= episodeQuantity);
          }

          shows.forEach(show => {
            if(!doneDisplaying) {
              const card = document.createElement("div");
              card.className = "bg-white rounded overflow-hidden shadow-lg p-4";
              card.innerHTML = `
                <img class="w-full" src="https://image.tmdb.org/t/p/w500${show.poster_path}" alt="${show.name}">
                <div class="px-6 py-4">
                  <div class="font-bold text-xl mb-2">${show.name}</div>
                  <p class="text-gray-700 text-base">${show.overview}</p>
                </div>
              `;
              resultsDiv.appendChild(card);
            }

            numberOfDisplayedSeries++;
            if(numberOfDisplayedSeries === 18) {
              doneDisplaying = true;
            }
          });
        }
      }
      catch (error) {
        console.error("Fetch Error:", error);
      }
  });
});
  



