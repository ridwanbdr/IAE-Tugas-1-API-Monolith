const searchBtn = document.getElementById("searchBtn");
const mealList = document.getElementById("meal");
const mealDetailsContent = document.querySelector("meal-details-content");
const recipeClosebtn = document.getElementById("recipe-close-btn");
const countryList = document.getElementById('country');

// event-listener
mealList.addEventListener('click', getMealRecipe);
searchBtn.addEventListener('click', getMealList);
countryList.addEventListener('click', getMealsByCountry);


// get meal list
function getMealList(e) {
    e.preventDefault();
    let searchInputTxt = document.getElementById('searchInput').value.trim();
    
    // Check if input is empty
    if(searchInputTxt === '') {
        mealList.innerHTML = `<p class="text-center">Please enter an ingredient to search</p>`;
        return;
    }
    
    // Show loading indicator
    mealList.innerHTML = `<p class="text-center">Searching for meals with ${searchInputTxt}...</p>`;
    
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInputTxt}`)
    .then(response => response.json())
    .then(data => {
        console.log(data);
        let html = "";
        if(data.meals) {
            data.meals.forEach(meal => {
                html += `
                <div class="col">
                    <div class="card shadow-sm meal-item" data-id="${meal.idMeal}">
                        <img src="${meal.strMealThumb}" class="card-img-top img-fluid rounded mx-auto d-block mt-3" alt="${meal.strMeal}" style="max-height: 200px; max-width: 300px;">
                        <div class="card-body text-center">
                            <h5 class="card-title">${meal.strMeal}</h5>
                            <button type="button" class="btn btn-warning text-white recipe-btn" data-bs-toggle="modal" data-bs-target="#exampleModal">
                                See Recipe
                            </button>
                        </div>
                    </div>
                </div>
                `;
            });
            mealList.innerHTML = html;
        } else {
            html = `<p class="text-center text-warning">Sorry, we didn't find any meal with "${searchInputTxt}"!</p>`;
            mealList.innerHTML = html;
        }
    })
    .catch(error => {
        mealList.innerHTML = `<p class="text-center">Error fetching data. Please try again.</p>`;
        console.error('Error fetching data:', error);
    });
}


// get meal recipe
function getMealRecipe(e) {
    e.preventDefault();
    if(e.target.classList.contains('recipe-btn')) {
        let mealItem = e.target.closest('.meal-item');
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            mealRecipeModal(data.meals[0]);
        })
        .catch(error => {
            console.error('Error fetching recipe details:', error);
            document.getElementById('mealDetailsContent').innerHTML = `
                <div class="modal-header">
                    <h1 class="modal-title fs-5">Error</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <p>Failed to load recipe details. Please try again.</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-warning text-white" data-bs-dismiss="modal">Close</button>
                </div>
            `;
        });
    }
}

// create a modal
function mealRecipeModal(meal) {
    let html = `
        <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">${meal.strMeal}</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
            <div class="meals-img">
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="img-fluid rounded w-50 h-25 mb-3">
            </div>
            <div class="meals-name">
                <h4>Meals Name</h4>
                <p>${meal.strMeal}</p>
            </div>
            <div class="meals-category">
                <h5>Category</h5>
                <p>${meal.strCategory}</p>
            </div>
            <div class="meals-instruction p-3">
                <h5>Instruction</h5>
                <p class="text-start p-3">${meal.strInstructions}</p>
            </div>
            ${meal.strYoutube ? `
            <div class="link-meals mt-3 mb-3">
                <p><a href="${meal.strYoutube}" target="_blank">Watch on Youtube</a></p>
            </div>` : ''}
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-warning text-white" data-bs-dismiss="modal">Close</button>
        </div>
    `;
    document.getElementById('mealDetailsContent').innerHTML = html;
}

// Function to get meals by country
function getMealsByCountry(e) {
    if (e.target.closest('.country-item')) {
        const countryId = e.target.closest('.country-item').id;
        
        // Show loading indicator
        mealList.innerHTML = `<p class="text-center">Searching for meals from ${countryId}...</p>`;
        
        fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${countryId}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            let html = "";
            if (data.meals) {
                data.meals.forEach(meal => {
                    html += `
                    <div class="col">
                        <div class="card shadow-sm meal-item" data-id="${meal.idMeal}">
                            <img src="${meal.strMealThumb}" class="card-img-top img-fluid rounded mx-auto d-block mt-3" alt="${meal.strMeal}" style="max-height: 200px; max-width: 300px;">
                            <div class="card-body text-center">
                                <h5 class="card-title">${meal.strMeal}</h5>
                                <button type="button" class="btn btn-warning text-white recipe-btn" data-bs-toggle="modal" data-bs-target="#exampleModal">
                                    See Recipe
                                </button>
                            </div>
                        </div>
                    </div>
                    `;
                });
                mealList.innerHTML = html;
            } else {
                html = `<p class="text-center text-warning">Sorry, we didn't find any meals from "${countryId}"!</p>`;
                mealList.innerHTML = html;
            }
        })
        .catch(error => {
            mealList.innerHTML = `<p class="text-center">Error fetching data. Please try again.</p>`;
            console.error('Error fetching data:', error);
        });
    }
}

