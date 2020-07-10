class Boid {

    maxspeed = 4
    maxForce = 0.05
    separation = 25
    sightDistance = 150
    periphery = PI / 4
    radius = 3.0
    normalColor = color(50,50,50)
    highlightColor = color(0,255,0)

    constructor(x, y) {
        this.pos = createVector(x, y)
        this.velocity = createVector(random(-1, 1), random(-1, 1))
        this.velocity.setMag(random(2, 4))
        this.acceleration = p5.Vector.random2D()
        this.col = this.normalColor
    }

    update() {
        this.pos.add(this.velocity)
        this.velocity.limit(this.maxspeed)
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
        vertex(0, -this.radius * 2)
        vertex(-this.radius, this.radius * 2)
        vertex(this.radius, this.radius * 2)
        endShape(CLOSE)
        pop()
    }

    edges() {
        if (this.pos.x < -this.radius) this.pos.x = width + this.radius
        if (this.pos.y < -this.radius) this.pos.y = height + this.radius
        if (this.pos.x > width + this.radius) this.pos.x = -this.radius
        if (this.pos.y > height + this.radius) this.pos.y = -this.radius
    }

    applyForce(force) {
        this.acceleration.add(force)
    }

    flock(boids) {
        // this.applyForce(this.align(boids).mult(alignSlider.value()))
        // this.applyForce(this.cohesion(boids).mult(cohSlider.value()))
        // this.applyForce(this.separate(boids).mult(sepSlider.value()))
        this.applyForce(this.align(boids).mult(1.0))
        this.applyForce(this.cohesion(boids).mult(1.0))
        this.applyForce(this.separate(boids).mult(1.5))
    }

    align(boids) {
        let total = 0
        let steering = createVector()
        for (let other of boids) {
            if (other != this) {
                const d = dist(this.pos.x, this.pos.y, other.pos.x, other.pos.y)
                if (d < this.sightDistance) {
                    steering.add(other.velocity)
                    total++;
                }
            }
        }
        if (total > 0) {
            steering.div(total)
            steering.normalize()
            steering.mult(this.maxspeed)
            steering.sub(this.velocity)
            steering.limit(this.maxForce)
        }
        return steering
    }

    separate(boids) {
        let steering = createVector()
        let total = 0
        for (let other of boids) {
            if (other != this) {
                const d = dist(this.pos.x, this.pos.y, other.pos.x, other.pos.y)
                if (d < this.separation) {
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
        if (steering.mag() > 0) {
            steering.normalize()
            steering.mult(this.maxspeed)
            steering.sub(this.velocity)
            steering.limit(this.maxForce)
        }
        return steering
    }

    cohesion(boids) {
        let steering = createVector()
        let total = 0
        for (let other of boids) {
            if (other != this) {
                const d = dist(this.pos.x, this.pos.y, other.pos.x, other.pos.y)
                if (d > 0 && d < this.sightDistance) {
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
            .mult(this.maxspeed)
            .sub(this.velocity)
            .limit(this.maxForce)
    }

    arrive(target) {
        let desired = p5.Vector.sub(target, this.pos)
        let d = desired.mag()
        if (d < 50) {
            var m = map(d, 0, 100, 0, this.maxspeed / 10)
            desired.setMag(m)
        } else {
            desired.setMag(this.maxspeed / 10)
        }
        let steer = p5.Vector.sub(desired, this.velocity)
        steer.limit(this.maxforce)
        this.applyForce(steer)
    }

    findFood(food) {
        let distance, target
        for (let peace of food) {
            const d = p5.Vector.dist(this.pos, peace.pos)
            if(d > 0 && d < this.sightDistance) {
                const comparison = p5.Vector.sub(peace.pos, this.pos)
                const diff = this.angleBetween(comparison, this.velocity)
                if (diff < this.periphery) {
                    distance = d
                    target = peace    
                }
            }
        }
        if (target) {
            if(distance <= this.radius * 3) {
                target.eat()
            } else {
            this.applyForce(this.seek(target.pos).mult(5.0))
            }
        }
    }

    drawView(boids) {
        const sightDistance = 100
        const periphery = PI / 4

        for (let other of boids) {
            let comparison = p5.Vector.sub(other.pos, this.pos)
            let d = p5.Vector.dist(this.pos, other.pos)
            let diff = this.angleBetween(comparison, this.velocity)

            if (diff < periphery && d > 0 && d < sightDistance) {
                other.highlight()
            }
        }
        // View Drawing
        const currentHeading = this.velocity.heading()
        push()
        translate(this.pos.x, this.pos.y)
        rotate(currentHeading)
        fill(0, 100)
        noStroke()
        arc(0, 0, sightDistance * 2, sightDistance * 2, -periphery, periphery)
        pop()
    }

    angleBetween(v1, v2) {
        const dot = v1.dot(v2)
        const theta = Math.acos(dot / (v1.mag() * v2.mag()))
        return theta
    }

    highlight() {
        this.col = this.highlightColor
        this.inView = 250
        setTimeout(() => this.unlight(), 50)
    }
    
    unlight() {
        if ( this.inView < 0 ){
            this.col = this.normalColor
        } else {
            this.inView -= 10
            setTimeout(() => this.unlight(), 50)
        }
    }
}
