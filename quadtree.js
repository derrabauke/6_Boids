class qt_Rectangle {
    constructor(x, y, w, h) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h
    }

    contains(boid) {
        return (
            boid.pos.x >= this.x - this.w &&
            boid.pos.x <= this.x + this.w &&
            boid.pos.y >= this.y - this.h &&
            boid.pos.y <= this.y + this.h
        )
    }

    intersects(range) {
        return !(range.x - range.w > this.x + this.w ||
            range.x + range.w < this.x - this.w ||
            range.y - range.h > this.y + this.h ||
            range.y + range.h < this.y - this.h)
    }
}

class Quadtree {
    constructor(x, y, w, h, n) {
        if (x instanceof qt_Rectangle) {
            this.boundary = x
            this.capacity = y
        } else {
            this.boundary = new qt_Rectangle(x, y, w, h)
            this.capacity = n
        }
        this.boids = []
        this.divided = false
    }

    insert(boid) {
        if (!this.boundary.contains(boid)) {
            return false
        }
        if (this.boids.length < this.capacity) {
            this.boids.push(boid)
            return true
        } else {
            if (!this.divided) {
                this.subdivide()
            }
            if (this.northeast.insert(boid)) {
                return true
            } else if (this.northwest.insert(boid)) {
                return true
            } else if (this.southeast.insert(boid)) {
                return true
            } else if (this.southwest.insert(boid)) {
                return true
            }
        }
    }

    subdivide() {
        this.divided = true
        this.nort

        let x = this.boundary.x
        let y = this.boundary.y
        let w = this.boundary.w
        let h = this.boundary.h

        let ne = new qt_Rectangle(x + w / 2, y - h / 2, w / 2, h / 2)
        this.northeast = new Quadtree(ne, this.capacity)
        let nw = new qt_Rectangle(x - w / 2, y - h / 2, w / 2, h / 2)
        this.northwest = new Quadtree(nw, this.capacity)
        let se = new qt_Rectangle(x + w / 2, y + h / 2, w / 2, h / 2)
        this.southeast = new Quadtree(se, this.capacity)
        let sw = new qt_Rectangle(x - w / 2, y + h / 2, w / 2, h / 2)
        this.southwest = new Quadtree(sw, this.capacity)

    }

    query(range, found) {
        if (!this.boundary.intersects(range)) {
            return
        } else {
            for (let b of this.boids) {
                if (range.contains(b)) {
                    found.push(b)
                }
            }
            if (this.divided) {
                this.northwest.query(range, found)
                this.northeast.query(range, found)
                this.southwest.query(range, found)
                this.southeast.query(range, found)
            }
        }
    }

    show() {
        stroke(250)
        noFill()
        rect(this.boundary.x, this.boundary.y, this.boundary.w * 2, this.boundary.h * 2)
        if (this.divided) {
            this.northwest.show()
            this.northeast.show()
            this.southwest.show()
            this.southeast.show()
        }
    }
}
