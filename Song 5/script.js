// Demo data array we will use in all examples
const foods = ['Pizza', 'Tacos', 'Ice Cream', 'Burgers', 'Pasta']

// helper function: will display whatever HTML/text we pass into the #out div
function render (html) {
  document.getElementById('out').innerHTML = html
}

/* 
  1) listFoods()
     - Use a for...of loop
     - Output all foods into the #out div (as <p> tags or list items)
*/

function listFoods () {
  // Start with an empty string to hold our HTML
  let html = '';

  // Loop through each food using for...of
  for (const food of foods) {
    html += `<p>${food}</p>`; // or use <li>${food}</li> if you want a list
  }

  // Use the provided render() helper to display it
  render(html);
}


/* 
  2) numberedFoods()
     - Use a classic for loop with index
     - Output foods as an ordered list (<ol><li>...</li></ol>)
*/
function numberedFoods () {
   // Start building the list
  let html = '<ol>';

  // Classic for loop with index
  for (let i = 0; i < foods.length; i++) {
    html += `<li>${foods[i]}</li>`;
  }

  // Close the list
  html += '</ol>';

  // Display it using the render() helper
  render(html);
}


/* 
  3) filterFoods()
     - Prompt the user for a letter
     - Loop through foods
     - Only show foods that start with that letter
     - If no matches, display a "not found" message
*/
function filterFoods () {
  // Create search interface
  const html = `
    <div class="mb-3">
      <div class="input-group">
        <input type="text" 
               id="letterInput" 
               class="form-control" 
               placeholder="Enter a letter" 
               maxlength="1">
        <button class="btn btn-warning" id="searchBtn">Search</button>
      </div>
    </div>
    <div id="searchResults"></div>
  `;
  render(html);

  // Add event listeners for search
  document.getElementById('letterInput').addEventListener('input', performSearch);
  document.getElementById('searchBtn').addEventListener('click', performSearch);
  document.getElementById('letterInput').addEventListener('keyup', e => {
    if (e.key === 'Enter') performSearch();
  });

  // Search function
  function performSearch() {
    const letter = document.getElementById('letterInput').value.toLowerCase();
    let resultsHtml = '';
    let found = false;

    if (letter) {
      resultsHtml = '<ul class="list-group">';
      
      foods.forEach(food => {
        if (food.toLowerCase().includes(letter)) {
          // Highlight all occurrences of the letter
          const highlightedFood = food.split('').map(char => 
            char.toLowerCase() === letter ? 
            `<span class="bg-warning">${char}</span>` : char
          ).join('');
          
          resultsHtml += `<li class="list-group-item">${highlightedFood}</li>`;
          found = true;
        }
      });

      if (found) {
        resultsHtml += '</ul>';
      } else {
        resultsHtml = `
          <div class="alert alert-warning" role="alert">
            No foods found containing "${letter}"
          </div>
        `;
      }
    }

    document.getElementById('searchResults').innerHTML = resultsHtml;
  }
}


/* 
  4) forEachFoods()
     - Use foods.forEach()
     - Output each food as a Bootstrap card
     - Cards should be placed in a centered row
*/
function forEachFoods () {
  // Start a Bootstrap row (centered using justify-content-center)
  let html = '<div class="row justify-content-center">';

  // Loop through each food using forEach
  foods.forEach(food => {
    html += `
      <div class="col-md-3">
        <div class="card text-center m-2 shadow-sm">
          <div class="card-body">
            <h5 class="card-title">${food}</h5>
          </div>
        </div>
      </div>
    `;
  });

  // Close the row
  html += '</div>';

  // Display it using render()
  render(html);
}


// ---- Event listeners (buttons) ----
document.getElementById('btnList').addEventListener('click', listFoods)
document.getElementById('btnNums').addEventListener('click', numberedFoods)
document.getElementById('btnFilter').addEventListener('click', filterFoods)
document.getElementById('btnForEach').addEventListener('click', forEachFoods)

//  ---------------STUDENT WORK SECTION--------------

/* 
  Task 1 — Uppercase List
  -----------------------
  - Use .map() to create a new array with all foods in uppercase
  - Display the results as an unordered list (<ul>)
*/
function uppercaseList () {
  // Use map to create uppercase array
  const upperFoods = foods.map(food => food.toUpperCase());
  
  // Create unordered list HTML
  let html = '<ul class="list-group">';
  upperFoods.forEach(food => {
    html += `<li class="list-group-item">${food}</li>`;
  });
  html += '</ul>';
  
  render(html);
}

/* 
  Task 2 — Reverse List
  ---------------------
  - Show the foods array in reverse order
  - You may use a backwards loop OR the built-in .reverse()
*/
function reverseList () {
  // Create a copy and reverse it (to not modify original array)
  const reversedFoods = [...foods].reverse();
  
  // Create HTML output
  let html = '<ul class="list-group">';
  reversedFoods.forEach(food => {
    html += `<li class="list-group-item">${food}</li>`;
  });
  html += '</ul>';
  
  render(html);
}

/* 
  Task 3 — Random Food Picker
  ---------------------------
  - Use Math.random to pick a random food from the array
  - Display it in a Bootstrap card with a heading like "Today's Pick"
*/
function randomFoodPicker () {
  // Get random index and food
  const randomIndex = Math.floor(Math.random() * foods.length);
  const randomFood = foods[randomIndex];
  
  // Create Bootstrap card
  const html = `
    <div class="card w-50 mx-auto">
      <div class="card-body text-center">
        <h5 class="card-title">Today's Pick</h5>
        <p class="card-text display-4">${randomFood}</p>
      </div>
    </div>
  `;
  
  render(html);
}

/* 
  Task 4 — Word Lengths
  ---------------------
  - Loop through each food in the array
  - Count the number of characters in each one
  - Display results in the format: Food — X letters
*/
function wordLengths () {
  // Create list showing each food and its length
  let html = '<ul class="list-group">';
  foods.forEach(food => {
    html += `<li class="list-group-item">${food} - ${food.length} letters</li>`;
  });
  html += '</ul>';
  
  render(html);
}

// ---- Event listeners for the new buttons ----
// (Make sure to add matching buttons in index.html)
document.getElementById('btnUppercase').addEventListener('click', uppercaseList)
document.getElementById('btnReverse').addEventListener('click', reverseList)
document.getElementById('btnRandom').addEventListener('click', randomFoodPicker)
document.getElementById('btnLengths').addEventListener('click', wordLengths)