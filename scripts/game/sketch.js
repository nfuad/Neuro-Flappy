/**
 * @summary
 *
 */

let TOTAL = 350 // number of birds per generation (population)
let gen = 1 // generation count
let max = 0 // max score
let current = 0 // current score of all the alive birds

// birds
let alive_birds = []
let dead_birds = []
let best_bird

// pipes
let pipes
let nearest_x // the nearest pipe's x coordinate
let nearest_y // the nearest pipe's y coordinate

// parameter sliders
let pop_slider // slider controlling the population (TOTAL)
let speed_slider // slider controlling the speed of pipes (pipes.speed)
let gap_slider // slider controlling the length of gaps in pipes (pipes.gaps)
let dist_slider // slider controlling the distance between 2 consecutive pipes (pipes.distance)
let soe_slider // slider controlling speed of evolution

// -------------------------------------
// HELPER FUNCTIONS - BEGIN
// -------------------------------------

const resize_width = (x) => windowWidth * (x / 840)

const resize_height = (x) => windowHeight * (x / 803)

const windowResized = () => resizeCanvas(windowWidth, resize_height(600))

// -------------------------------------
// HELPER FUNCTIONS - END
// -------------------------------------

// generate new birds for the next generation
function nextGen() {
  // 90% new birds are mutations of the best_bird
  for (let i = 0; i < TOTAL * 0.9; i++) {
    let child = new Bird()
    child.brain = best_bird.brain.mutate()
    alive_birds[i] = child
  }
  // 10% birds are the same as the best_bird
  for (let i = TOTAL * 0.9; i < TOTAL; i++) {
    let child = new Bird()
    child.brain = best_bird.brain
    alive_birds[i] = child
  }
  // empty the dead_birds array for the next generation
  dead_birds = []

  // new set of pipes
  pipes.x_values = [width]
  pipes.y_values = [Math.random() * (height - pipes.gap)]

  // update generation count
  gen += 1
  document.getElementById('gen').innerHTML = gen
}

// reset/update the parameters
function resetSketch() {
  gen = 1
  max = 0
  current = 0

  alive_birds = []
  dead_birds = []
  best_bird = null

  pipes = new Pipes()
  nearest_x = null
  nearest_y = null

  TOTAL = pop_slider.value()
  pipes.speed = speed_slider.value()
  pipes.gap = gap_slider.value()
  pipes.distance = dist_slider.value()
  soe_slider.elt.valueAsNumber = 1

  // generate a new but random pop
  for (let i = 0; i < TOTAL; i++) {
    alive_birds.push(new Bird())
  }
  document.getElementById('gen').innerHTML = gen
  document.getElementById('pop-count').innerHTML = TOTAL
  document.getElementById('pipes-speed').innerHTML = pipes.speed
  document.getElementById('pipes-gap').innerHTML = pipes.gap
  document.getElementById('pipes-dist').innerHTML = pipes.distance
}

function setup() {
  let canvas = createCanvas(windowWidth, resize_height(600))
  canvas.parent('canvas')

  // create parameter sliders
  pop_slider = select('#pop-count-slider')
  speed_slider = select('#pipes-speed-slider')
  gap_slider = select('#pipes-gap-slider')
  dist_slider = select('#pipes-dist-slider')
  soe_slider = select('#soe-slider')

  resetSketch()
}

function draw() {
  // update the parameters according to the position of their respective sliders
  document.getElementById('pop-count').innerHTML = pop_slider.value()
  document.getElementById('pipes-speed').innerHTML = speed_slider.value()
  document.getElementById('pipes-gap').innerHTML = gap_slider.value()
  document.getElementById('pipes-dist').innerHTML = dist_slider.value()

  // loop as many times as the value of the soe_slider, per frame
  for (let c = 0; c < soe_slider.value(); c++) {
    // update the current score
    if (alive_birds.length > 0) {
      current = alive_birds[0].score
    }
    document.getElementById('current').innerHTML = current

    // update the current score if its more than max score
    if (current >= max) max = current

    document.getElementById('score').innerHTML = max

    // update alive birds
    document.getElementById('alive-birds').innerHTML =
      alive_birds.length + '/' + TOTAL

    // delete pipes out of the canvas
    pipes.delete()
    // generate new pipes
    pipes.generate()
    // update the positions of each pipe
    pipes.update()

    // if all birds are dead in that current gen
    if (alive_birds.length === 0) {
      // if the last bird to die beat the highest score,
      // make it update the best_bird
      if (dead_birds[TOTAL - 1].score >= max) {
        max = dead_birds[TOTAL - 1].score
        best_bird = dead_birds[TOTAL - 1]
      }

      nextGen()
    }

    // if any bird is dead, then adds it to dead_birds and removes it from the alive_birds
    for (let i = 0; i < alive_birds.length; i++) {
      if (alive_birds[i].death(pipes)) {
        dead_birds.push(alive_birds.splice(i, 1)[0])
      }
    }

    // update the position of each bird
    for (let i = 0; i < alive_birds.length; i++) {
      let bird = alive_birds[i]

      bird.decide()
      bird.update()
    }
  }

  // animate everything
  clear()
  background(200)

  pipes.show() // show pipes

  for (let i = 0; i < alive_birds.length; i++) {
    alive_birds[i].show() // show alive birds
  }
}
