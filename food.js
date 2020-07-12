class Food {
    constructor(x, y) {
        this.pos = createVector(x, y)
        this.size = random(3, 5)
        this.eaten = false
        this.col = color(random(100, 255), 150, random(0, 100))
    }

    update() {
        this.pos.add(0, this.size * 0.15)
        if (this.pos.y == height) {
            this.eaten = true
        }
    }

    show() {
        if (!this.eaten) {
            push()
            strokeWeight(this.size * 2)
            stroke(this.col)
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
