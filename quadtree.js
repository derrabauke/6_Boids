class qt_Rectangle {
    constructor(x, y, w, h) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h
    }

    contains(point) {
        return (
            point.x >= this.x - this.w &&
            point.x <= this.x + this.w &&
            point.y >= this.y - this.h &&
            point.y <= this.y + this.h
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
    constructor(x, y, w, h, n)
    constructor(rect, n) {
        if (!rect instanceof qt_Rectangle) {
            this.boundary = new qt_Rectangle(x, y, w, h)
        } else {
            this.boundary = rect
        }
        this.capacity = n
        this.points = []
        this.divided = false
    }

    insert(point) {
        if (!this.boundary.contains(point)) {
            return false
        }
        if (this.points.length < this.capacity) {
            this.points.push(point)
            return true
        } else {
            if (!this.divided) {
                this.subdivide()
            }
            if (this.northeast.insert(point)) {
                return true
            } else if (this.northwest.insert(point)) {
                return true
            } else if (this.southeast.insert(point)) {
                return true
            } else if (this.southwest.insert(point)) {
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
            for (let p of this.points) {
                if (range.contains(p)) {
                    found.push(p)
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
}
