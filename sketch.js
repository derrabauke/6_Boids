let fishImage, fishImageGreen, fishImageRed, flock, predator
let food = []
let boidCount = 50
let debugView = false
let avoidLOSB = false

function preload() {
    fishImage = loadImage('assets/fish.png')
    fishImageGreen = loadImage('assets/fish_green.png')
    fishImageRed = loadImage('assets/fish_red.png')
    backgroundimage = loadImage('assets/background.jpg')
}

function setup() {
    createCanvas(innerWidth, innerHeight)
    console.log('Image Credits: "aquarium-3" by www.happybarcelona.eu is licensed under CC BY-NC 2.0')

    checkbox = createCheckbox("Debug View", debugView)
    checkbox.changed(toggleDebug)

    selLabel = createSpan("Boid count: ")
    sel = createSelect();
    sel.option("50", 50)
    sel.option("100", 100)
    sel.option("250", 250)
    sel.option("500", 500)
    sel.option("1000", 1000)
    sel.changed(countSelection);

    // flocking stuff
    initFlock()
}

function initFlock() {
    flock = new Flock(0, 0, innerWidth, innerHeight)
    for (let i = 0; i < boidCount; i++) {
        flock.addBoid(new Boid(random(width), random(height)))
    }
}

function mousePressed() {
    food.push(new Food(mouseX, mouseY))
}

function toggleDebug() {
    debugView = !debugView
}

function toggleLOSB() {
    avoidLOSB = !avoidLOSB
}

function countSelection() {
    const val = sel.value()
    if (val) {
        boidCount = val
        initFlock()
    }
}

function draw() {
    if (debugView) {
        background(51)
        flock.drawQuadTree()
    } else {
        image(backgroundimage, 0, 0, width, height)
    }
    food = food.filter(f => f.fresh())
    for (let peace of food) {
        peace.update()
        peace.show()
    }
    const boids = flock.getAllBoids()
    for (let boid of boids) {
        boid.findFood(food)
    }
    flock.run()
    if (debugView) {
        boids[0].drawView(flock.getNeighbours(boids[0]))
    }
}
