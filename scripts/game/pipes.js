/**
 * @summary
 *
 *
 */

class Pipes {
  constructor() {
    this.distance = 300 // distance between 2 consecutive pipes
    this.gap = 150 // length of gap between 2 consecutive pipes
    this.w = 100 // width of a pipe
    this.x_values = [width] // array of the pipes' x coordinates
    this.y_values = [Math.random() * (height - this.gap)] // array of the pipes' y coordinates
    this.speed = 4 // speed
  }

  // generate new pipes
  generate() {
    let a = this.x_values
    let l = this.x_values.length
    if (l < 10) {
      this.x_values.push(a[l - 1] + this.distance + this.gap)
      this.y_values.push(Math.random() * (height - this.gap))
    }
  }

  // show pipes on the canvas
  show() {
    let a = this.x_values
    let b = this.y_values
    let l = this.x_values.length
    for (var i = 0; i < l; i++) {
      let y_gap = Math.random() * (height - this.gap)
      fill(255, 255, 255)
      rect(a[i], 0, this.w, b[i])
      rect(a[i], b[i] + this.gap, this.w, height - b[i] + this.gap)
    }
  }

  // update position of pipes
  update() {
    let l = this.x_values.length
    for (var i = 0; i < l; i++) {
      this.x_values[i] -= this.speed
    }
  }

  // delete pipes out of the canvas
  delete() {
    let a = this.x_values
    let l = this.x_values.length
    for (var i = 0; i < l; i++) {
      if (a[i] <= -this.gap) {
        this.x_values.splice(i, 1)
        this.y_values.splice(i, 1)
      }
    }
  }
}
