let food = []
let flock

function setup() {
    aText = createP("Click to insert some food into the aquarium.");
    aText.position(width / 4, 10)
    createCanvas(innerWidth, innerHeight)
    flock = new Flock(0, 0, innerWidth, innerHeight)
    for (let i = 0; i < 250; i++) {
        flock.addBoid(new Boid(random(width), random(height)))
    }
}

function mousePressed() {
    food.push(new Food(mouseX, mouseY))
}

function draw() {
    background(51)
    food = food.filter(f => f.fresh())
    for (let peace of food) {
        peace.show()
    }
    const boids = flock.getAllBoids()
    for (let boid of boids) {
        boid.findFood(food)
    }

    flock.run()
    boids[0].drawView(flock.getNeighbours(boids[0]))
}
