
function render (html) {
  document.getElementById('out').innerHTML = html
}


let lastRandom = null
let userName = 'please enter your name below'

function greet () {
  render(`Hello there, ${userName}!`)
}


function averageNumbers () {
  const input = prompt('Enter a list of numbers separated by commas (e.g. 1, 2, 3)')


  if (input === null || input.trim() === '') {
    if (lastRandom === null) {
      render('No numbers provided and no previously generated random number to use.')
      return
    }
    render(`Using last random number ${lastRandom} — Average: ${lastRandom}`)
    return
  }

  const parts = input.split(',').map(p => p.trim()).filter(p => p !== '')

  if (parts.length === 0) {
    render('No numbers provided.')
    return
  }

  const nums = []
  for (const p of parts) {
    const n = Number(p)
    if (Number.isNaN(n)) {
      render(`Invalid number found: "${p}"`)
      return
    }
    nums.push(n)
  }

  const sum = nums.reduce((a, b) => a + b, 0)
  const avg = sum / nums.length

  render(`Numbers: [${nums.join(', ')}] <br> Average: ${avg}`)
}


function timeOfDay () {
  const now = new Date()
  const hour = now.getHours()

  let msg = ''
  if (hour >= 5 && hour < 12) {
    msg = 'Good morning!'
  } else if (hour >= 12 && hour < 18) {
    msg = 'Good afternoon!'
  } else {
    msg = 'Good evening!'
  }

  render(`${msg} The current hour is ${hour}.`)
}


function randomBetween () {
  const result = Math.floor(Math.random() * 100000) + 1
  lastRandom = result
  render(`Random number generated: <strong>${result}</strong>`) 
}

function clearOutput () {
  const out = document.getElementById('out')
  if (out) {
    out.innerHTML = 'Output cleared. Memory reset.'
    out.style.color = ''
    out.style.backgroundColor = ''
    lastRandom = null
  }
}


document.getElementById('btnGreet').addEventListener('click', greet)
document.getElementById('btnAvg').addEventListener('click', averageNumbers)
document.getElementById('btnTime').addEventListener('click', timeOfDay)
document.getElementById('btnRandom').addEventListener('click', randomBetween)
document.getElementById('btnClear').addEventListener('click', clearOutput)


const pageTitles = [
  '🍂Fall Time🍂',
  '🍂Spooky Time🍂',
  '🍂Harvest Time🍂',
  '🍂Pumpkin Time🍂',
  '🍂Autumn Time🍂'
]

function changePageTitle() {
  const randomTitle = pageTitles[Math.floor(Math.random() * pageTitles.length)]
  document.title = randomTitle
  const h1 = document.querySelector('header h1')
  if (h1) h1.textContent = randomTitle
  render(`Page title updated to: ${randomTitle}`)
}

const colorCycle = ['#431407', '#0f172a', '#065f46', '#7c2d12', '#881337']
let colorIndex = 0
function cycleOutputColor() {
  const out = document.getElementById('out')
  if (!out) return
  out.style.color = colorCycle[colorIndex]
  colorIndex = (colorIndex + 1) % colorCycle.length
  render(`Output text color changed to <span style="color:${out.style.color}">${out.style.color}</span>`)
}

function randomBgColor() {
  const out = document.getElementById('out')
  if (!out) return
  const rand = Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')
  const color = `#${rand}`
  document.body.style.backgroundColor = color
  document.body.style.backgroundImage = 'none'
  render(`Background color set to <span style="background:${color};padding:0 .25rem">${color}</span>`)
}

function setHalloweenTheme() {
  document.body.style.backgroundColor = '#1a1a1a'
  document.body.style.backgroundImage = 'radial-gradient(circle at 50% 50%, #2a2a2a 0%, #1a1a1a 100%)'
  render('Halloween theme activated! 🎃')
}

function doubleNumber() {
  const input = prompt('Enter a number to double:')
  let n
  if (input === null || input.trim() === '') {
    if (lastRandom === null) { render('No number provided and no previously generated random number to use.'); return }
    n = lastRandom
  } else {
    n = Number(input)
    if (Number.isNaN(n)) { render('That is not a valid number.'); return }
  }

  const doubled = n * 2
  // persist the doubled value so subsequent doubles work
  lastRandom = doubled
  render(`${n} doubled is ${doubled}`)
}

// Attach student buttons (if present)
const btnChange = document.getElementById('btnChangeTitle')
if (btnChange) btnChange.addEventListener('click', changePageTitle)
const btnCycle = document.getElementById('btnCycleColor')
if (btnCycle) btnCycle.addEventListener('click', cycleOutputColor)
const btnBg = document.getElementById('btnBgColor')
if (btnBg) btnBg.addEventListener('click', randomBgColor)
const btnHalloween = document.getElementById('btnHalloweenTheme')
if (btnHalloween) btnHalloween.addEventListener('click', setHalloweenTheme)
const btnDouble = document.getElementById('btnDouble')
if (btnDouble) btnDouble.addEventListener('click', doubleNumber)

// Name input form handling
const btnSubmitName = document.getElementById('btnSubmitName')
const nameInput = document.getElementById('nameInput')
if (btnSubmitName && nameInput) {
  btnSubmitName.addEventListener('click', () => {
    const newName = nameInput.value.trim()
    if (newName) {
      userName = newName
      render(`Name updated to: ${userName}`)
      nameInput.value = '' // Clear the input
    } else {
      render('Please enter a name first.')
    }
  })
}

/* 
  ------------------------------------------
  Student Challenge Section 
  ------------------------------------------
  Add 4 new functions here, each with its own button in index.html:
  
  1) Change the page title text to something new.
  2) Cycle the output box text color (switch to a different color each time clicked).
  3) Change BOTH the text and background color of #out.
  4) Angry Mode (toggle) — switch the Bootstrap theme colors to look "angry."
  
  Write each function below, and don’t forget to connect each one 
  to a new button in index.html using addEventListener.
*/
