let flock = []
let food = []

function setup() {
    createCanvas(800,600)
    for(let i=0; i<50; i++){
        flock.push(new Boid(random(width), random(height)))
    }
}

function mousePressed() {
    food.push(new Food(mouseX,mouseY))
}

function draw() {
    background(51)
    food = food.filter(f => f.fresh())
    for(let peace of food) {
        peace.show()
    }

    const previousFlock = flock.slice()
    for (let boid of flock) {
        boid.flock(previousFlock)
        boid.findFood(food)
        boid.update()
        boid.edges()
        boid.show()
    }
    flock[0].drawView(flock)
}
