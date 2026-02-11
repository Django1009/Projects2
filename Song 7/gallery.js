let mCurrentIndex = 0 // Tracks the current image index
let mImages = [] // Array to hold GalleryImage objects
const mUrl = 'images.json' // Local JSON file in project
const mWaitTime = 5000 // Timer interval in milliseconds
let mTimerId = null // Holds the interval ID for slideshow


$(document).ready(() => {
  $('.details').hide() // Hide details initially

  // More indicator toggles metadata details and rotates
  $('.moreIndicator').on('click', function () {
    $(this).toggleClass('rot90 rot270')
    $('.details').slideToggle()
  })

  // Navigation buttons
  $('#nextPhoto').on('click', function () {
    showNextPhoto()
    startTimer()
  })

  $('#prevPhoto').on('click', function () {
    showPrevPhoto()
    startTimer()
  })

  // Load JSON and start slideshow
  fetchJSON()
})

// Function to fetch JSON data and store it in mImages
function fetchJSON () {
  $.ajax({
    url: mUrl,
    dataType: 'json'
  })
    .done(function (data) {
      if (data && data.images && data.images.length > 0) {
        mImages = data.images
        mCurrentIndex = 0
        swapPhoto()
        startTimer()
      } else {
        console.error('No images found in JSON')
      }
    })
    .fail(function (jqxhr, textStatus, error) {
      console.error('Failed to load JSON:', textStatus, error)
    })
}

// Function to swap and display the next photo in the slideshow
function swapPhoto () {
  if (!mImages || mImages.length === 0) return
  const img = mImages[mCurrentIndex]
  $('#photo').attr('src', img.imgPath)
  $('.location').text('Location: ' + (img.imgLocation || ''))
  $('.description').text('Description: ' + (img.description || ''))
  $('.date').text('Date: ' + (img.date || ''))
}

// Advances to the next photo, loops to the first photo if the end of array is reached
function showNextPhoto () {
  if (!mImages || mImages.length === 0) return
  mCurrentIndex = (mCurrentIndex + 1) % mImages.length
  swapPhoto()
}

// Goes to the previous photo, loops to the last photo if mCurrentIndex goes negative
function showPrevPhoto () {
  if (!mImages || mImages.length === 0) return
  mCurrentIndex = (mCurrentIndex - 1 + mImages.length) % mImages.length
  swapPhoto()
}

// Starter code for the timer function
function startTimer () {
  // Ensure only one timer runs
  if (mTimerId) {
    clearInterval(mTimerId)
    mTimerId = null
  }
  mTimerId = setInterval(showNextPhoto, mWaitTime)
}
