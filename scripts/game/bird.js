/**
 * @summary
 *
 *
 */

class Bird {
  constructor() {
    this.radius = 32 // bird's radius
    this.x = 200 // bird's x coordinate
    this.y = 300 // bird's y coordinate
    this.vel = 0 // bird's velocity
    this.g = 0.8 // gravity
    this.brain = new NeuralNetwork(5, 10, 1) // bird's brain
    this.score = 0 // bird's score
  }

  // decide whether bird should jump or not
  decide() {
    // find/update coordinates of the nearest pipe
    for (let i = 0; i < pipes.x_values.length; i++) {
      if (this.x - pipes.x_values[i] < 0) {
        nearest_x = pipes.x_values[i]
        nearest_y = pipes.y_values[i]
        break
      } else if (this.x - pipes.x_values[i] - pipes.gap < 0) {
        nearest_x = pipes.x_values[i] + pipes.gap
        nearest_y = pipes.y_values[i]
        break
      }
    }

    let input = new Matrix(5, 1)

    // input1 = bird's y coordinate
    // input2 = top of the nearest pipe's y coordinate
    // input3 = bottom of the nearest pipe's y coordinate
    // input4 = the nearest pipe's x coordinate
    // input5 = bird's velocity

    // the neural network takes inputs as a 2d array
    let input1 = [this.y / height] // normalized value of bird's y coordinate
    let input2 = [nearest_y / (height - pipes.gap)] // normalized value of top of the nearest pipe's y coordinate
    let input3 = [(nearest_y + pipes.gap) / (height - pipes.gap)] // normalized value of bottom of the nearest pipe's y coordinate
    let input4 = [nearest_x / width] // normalized value of nearest pipe's x coordinate
    let input5 = [this.vel / 10] // normalized value of bird's velocity

    input.array = [input1, input2, input3, input4, input5]

    // predict wether to jump or not given the inputs
    let prediction = this.brain.predict(input)[0][0]
    if (prediction > 0.5) this.up()
  }

  // show the bird on canvas
  show() {
    // use fill & ellipse from p5.js
    fill(244, 0, 0) // red color rgb
    ellipse(this.x, this.y, this.radius, this.radius)
  }

  // update bird's position & score
  update() {
    this.score += 1
    this.vel += this.g
    this.vel *= 0.95
    this.y += this.vel
  }

  // move up
  up() {
    this.vel -= 20
  }

  // check if bird goes out of the canvas
  // or touches any of the pipes
  death(pipes) {
    if (this.y <= 0 || this.y >= height) return true

    for (let i = 0; i < pipes.y_values.length; i++) {
      if (
        (this.y <= pipes.y_values[i] ||
          this.y >= pipes.y_values[i] + pipes.gap) &&
        this.x >= pipes.x_values[i] &&
        this.x <= pipes.x_values[i] + pipes.w
      ) {
        return true
      }
    }
  }
}
