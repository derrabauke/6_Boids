class Flock {
    QUADTREE = undefined

    constructor(x, y, w, h) {
        this.boundary = new qt_Rectangle(x, y, w, h, 4)
        this.boids = []
    }

    addBoid(boid) {
        this.boids.push(boid)
    }

    getNeighbours(boid) {
        let result = []
        this.QUADTREE.query(
            new qt_Rectangle(boid.pos.x, boid.pos.y, boid.PERCEPTION, boid.PERCEPTION), result)
        return result
    }

    getAllBoids() {
        return this.boids
    }

    buildTree() {
        this.QUADTREE = new Quadtree(this.boundary, 4)
        for (let boid of this.boids) {
            this.QUADTREE.insert(boid)
        }
    }

    run() {
        this.buildTree()
        for (let boid of this.boids) {
            boid.run(this.getNeighbours(boid))
        }
    }
}
