class Food {
    constructor(x, y) {
        this.pos = createVector(x, y)
        this.size = random(1, 4)
        this.eaten = false
    }

    show() {
        if (!this.eaten) {
            push()
            strokeWeight(10)
            fill(50, 255, 0)
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
