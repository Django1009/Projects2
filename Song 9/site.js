/* SITE.JS: THIS FILE CONTAINS THE METHODS/FUNCTIONS AND VARIABLES CONTROLLING YOUR SITE
//
*/

/* NOTE: MOVIES.JSON CONTAINS A LIST OF MOVIES AND ACCOMPANYING METADATA
//
//    They are in the following format:
//    title (String): the name of the movie
//    iscore (Number): the IMDB score
//    rating (String): the movie's MPAA rating
//    released (Array): the release date. Note that the order of the array is:  YYYY, MM, DD
//    country (String): the country of production
//    posters (Array): an array of String values with the URL to movie posters (in your img/ directory)
//    imdb (String): the URL to the corresponding IMDB website
//    website (String): the URL to the corresponding official website
//    likes (Number): a fictitious number of user likes
//    dislikes (Number): a fictitious number of user dislikes
//    posterindex (Number): a counter to use with the "posters" array to keep track of the current displayed poster index
//
// FOR STEP 16, ADD THREE OF YOUR OWN FAVORITE MOVIES WITH METADATA TO THE END OF THE JSON FILE LIST
*/


const vue_app = Vue.createApp({
      // This automatically imports your movies.json file and puts it into
      //   the variable: movies
      created () {
            // fetch movies and set loading/error state
            fetch('movies.json')
              .then(response => {
                if (!response.ok) throw new Error('Network response was not ok')
                return response.json()
              })
              .then(json => {
                  this.movies = json
                  this.loading = false
              })
              .catch(err => {
                  console.error('Failed to load movies.json:', err)
                  this.error = 'Failed to load movie data.'
                  this.loading = false
              })
      },
      data() {
        return {
            // This holds your movies.json data.
            movies: [],
            loading: true,
            error: '',
                                    /* ADD ADDITIONAL VARIABLES FOR STEP 3 HERE */
                                    // App-level variables for bindings
                                    title: 'IS219 Gallery (Project 3)',
                                    owner: 'Project Owner',
                                    // Replace with your GitHub repo URL (used by footer button)
                                    github: 'https://github.com/your-username/your-repo'
         
      }
      },
      methods: {
            /* ADD FUNCTIONS/METHODS FOR STEP 7 HERE */
            formatReleased(released) {
                  if (!released || !Array.isArray(released)) return ''
                  const [y, m, d] = released
                  const mm = String(m).padStart(2, '0')
                  const dd = String(d).padStart(2, '0')
                  return `${y}-${mm}-${dd}`
            }
      }
})

vue_app.mount("#vue_app")
