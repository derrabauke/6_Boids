let flock = []

function setup() {
    createCanvas(640,360)
    for(let i=0; i<50; i++){
        flock.push(new Boid(random(width), random(height)))
    }
}

function draw() {
    background(51)
    const previousFlock = flock.slice()
    for (let boid of flock) {
        boid.edges()
        boid.flock(previousFlock)
        boid.update()
        boid.show()
    }
}
