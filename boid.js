class Boid {

    MAXSPEED = 3
    MAXFORCE = 0.1
    SEPARATION = 30
    SEPARATION_SQ = sq(this.SEPARATION)
    PERCEPTION = 150
    PERCEPTION_SQ = sq(this.PERCEPTION)
    PERIPHERY = PI / 4
    RADIUS = 3.0
    BITERANGE = sqrt(this.RADIUS * 2)
    NORMALCOLOR = color(50, 50, 50)
    HIGHLIGHTCOLOR = color(0, 255, 0)

    constructor(x, y) {
        this.pos = createVector(x, y)
        this.velocity = createVector(random(-1, 1), random(-1, 1))
        this.velocity.setMag(random(2, 4))
        this.acceleration = p5.Vector.random2D()
        this.col = this.NORMALCOLOR
    }

    run(flock) {
        this.flock(flock)
        this.update()
        this.edges()
        this.show()
    }

    update() {
        this.pos.add(this.velocity)
        this.velocity.limit(this.MAXSPEED)
        this.velocity.add(this.acceleration)
        this.acceleration.mult(0)
    }

    show() {
        const theta = this.velocity.heading() + radians(90)
        fill(this.col)
        stroke(200)
        push()
        translate(this.pos.x, this.pos.y)
        rotate(theta)
        beginShape()
        vertex(0, -this.RADIUS * 2)
        vertex(-this.RADIUS, this.RADIUS * 2)
        vertex(this.RADIUS, this.RADIUS * 2)
        endShape(CLOSE)
        pop()
    }

    edges() {
        if (this.pos.x < -this.RADIUS) this.pos.x = width + this.RADIUS
        if (this.pos.y < -this.RADIUS) this.pos.y = height + this.RADIUS
        if (this.pos.x > width + this.RADIUS) this.pos.x = -this.RADIUS
        if (this.pos.y > height + this.RADIUS) this.pos.y = -this.RADIUS
    }

    applyForce(force) {
        this.acceleration.add(force)
    }

    flock(boids) {
        this.applyForce(this.align(boids).mult(1.0))
        this.applyForce(this.cohesion(boids).mult(1.0))
        this.applyForce(this.separate(boids).mult(1.5))
    }

    align(boids) {
        let total = 0
        let steering = createVector()
        for (let other of boids) {
            if (other != this) {
                const d = this.distsq(this.pos.x, this.pos.y, other.pos.x, other.pos.y)
                if (d < this.PERCEPTION_SQ) {
                    steering.add(other.velocity)
                    total++;
                }
            }
        }
        if (total > 0) {
            steering.div(total)
            steering.normalize()
            steering.mult(this.MAXSPEED)
            steering.sub(this.velocity)
            steering.limit(this.MAXFORCE)
        }
        return steering
    }

    separate(boids) {
        let steering = createVector()
        let total = 0
        for (let other of boids) {
            if (other != this) {
                const d = this.distsq(this.pos.x, this.pos.y, other.pos.x, other.pos.y)
                if (d < this.SEPARATION_SQ) {
                    const diff = p5.Vector.sub(this.pos, other.pos)
                    diff.normalize()
                    diff.div(d)
                    steering.add(diff)
                    total++;
                }
            }
        }
        if (total > 0) {
            steering.div(total)
        }
        if (steering.magSq() > 0) {
            steering.normalize()
            steering.mult(this.MAXSPEED)
            steering.sub(this.velocity)
            steering.limit(this.MAXFORCE)
        }
        return steering
    }

    cohesion(boids) {
        let steering = createVector()
        let total = 0
        for (let other of boids) {
            if (other != this) {
                const d = this.distsq(this.pos.x, this.pos.y, other.pos.x, other.pos.y)
                if (d > 0 && d < this.PERCEPTION_SQ) {
                    steering.add(other.pos)
                    total++;
                }
            }
        }
        if (total > 0) {
            steering.div(total)
            return this.seek(steering)
        }
        return steering
    }

    seek(target) {
        return p5.Vector
            .sub(target, this.pos)
            .normalize()
            .mult(this.MAXSPEED)
            .sub(this.velocity)
            .limit(this.MAXFORCE)
    }

    arrive(target) {
        let desired = p5.Vector.sub(target, this.pos)
        let d = desired.mag()
        if (d < 50) {
            var m = map(d, 0, 100, 0, this.MAXSPEED / 10)
            desired.setMag(m)
        } else {
            desired.setMag(this.MAXSPEED / 10)
        }
        let steer = p5.Vector.sub(desired, this.velocity)
        steer.limit(this.MAXFORCE)
        this.applyForce(steer)
    }

    findFood(food) {
        let distance, target
        for (let peace of food) {
            const d = this.distsq(this.pos.x, this.pos.y, peace.pos.x, peace.pos.y)
            if (d > 0 && d < this.PERCEPTION_SQ) {
                const comparison = p5.Vector.sub(peace.pos, this.pos)
                const diff = this.angleBetween(comparison, this.velocity)
                if (diff < this.PERIPHERY) {
                    distance = d
                    target = peace
                }
            }
        }
        if (target) {
            if (distance <= this.BITERANGE) {
                target.eat()
            } else {
                this.applyForce(this.seek(target.pos).mult(5.0))
            }
        }
    }

    drawView(boids) {
        const PERCEPTION = 100
        const PERIPHERY = PI / 4

        for (let other of boids) {
            let comparison = p5.Vector.sub(other.pos, this.pos)
            let d = this.distsq(this.pos.x, this.pos.y, other.pos.x, other.pos.y)
            if (d > 0 && d < this.PERCEPTION_SQ) {
                let diff = this.angleBetween(comparison, this.velocity)
                if (diff < PERIPHERY) {
                    other.highlight()
                }
            }
        }
        const currentHeading = this.velocity.heading()
        push()
        translate(this.pos.x, this.pos.y)
        rotate(currentHeading)
        fill(0, 100)
        noStroke()
        arc(0, 0, PERCEPTION * 2, PERCEPTION * 2, -PERIPHERY, PERIPHERY)
        pop()
    }

    angleBetween(v1, v2) {
        const dot = v1.dot(v2)
        const theta = Math.acos(dot / (v1.mag() * v2.mag()))
        return theta
    }

    highlight() {
        this.col = this.HIGHLIGHTCOLOR
        this.inView = 250
        setTimeout(() => this.unlight(), 80)
    }

    unlight() {
        if (this.inView < 0) {
            this.col = this.NORMALCOLOR
        } else {
            this.inView -= 50
            setTimeout(() => this.unlight(), 100)
        }
    }

    /* #### Speed optimizations #### */
    distsq(x1, y1, x2, y2) {
        return sq(x1 - x2) + sq(y1 - y2);
    }
}
