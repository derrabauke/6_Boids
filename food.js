class Food {

    MAXSPEED = 0.5

    constructor(x, y) {
        this.pos = createVector(x, y)
        this.size = random(1, 4)
        this.eaten = false
    }

    update() {
        this.pos.add(this.velocity)
        this.velocity.add(this.acceleration)
        this.velocity.limit(this.MAXSPEED)
        this.acceleration.mult(0)
    }

    show() {
        if (!this.eaten) {
            push()
            strokeWeight(10)
            // fill(50, 255, 0)
            stroke(200)
            point(this.pos.x, this.pos.y)
            pop()
        }
    }

    eat() {
        console.log('🐟: "habba habba"')
        this.eaten = true
    }

    fresh() {
        return !this.eaten
    }
}
