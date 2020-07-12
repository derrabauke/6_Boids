let food = []
let flock
let boidCount = 50
let debugView = false
let avoidLOSB = false
let showQuad = false

function setup() {
    checkbox = createCheckbox("Debug View", debugView)
    checkbox.changed(toggleDebug)

    // checkbox_LOSB = createCheckbox("Avoid Line-Of-Sight blocking", avoidLOSB)
    // checkbox_LOSB.changed(toggleLOSB)

    checkbox_QUAD = createCheckbox("Show Quadtree", showQuad)
    checkbox_QUAD.changed(toggleQUAD)

    selLabel = createSpan("Boid count: ")
    sel = createSelect();
    sel.option("50", 50)
    sel.option("100", 100)
    sel.option("250", 250)
    sel.option("500", 500)
    sel.option("1000", 1000)
    sel.changed(countSelection);

    createCanvas(innerWidth, innerHeight)
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

function toggleQUAD() {
    showQuad = !showQuad
}

function countSelection() {
    const val = sel.value()
    if (val) {
        boidCount = val
        initFlock()
    }
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
    if (debugView) {
        boids[0].drawView(flock.getNeighbours(boids[0]))
    }
    if (showQuad) {
        flock.drawQuadTree()
    }
}
