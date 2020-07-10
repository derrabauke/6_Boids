class Boid {

    constructor(x, y) {
        this.pos = createVector(x, y)
        this.velocity = createVector(random(-1, 1), random(-1, 1))
        this.velocity.setMag(random(2, 4))
        this.acceleration = p5.Vector.random2D()
        this.maxspeed = 4
        this.maxForce = 0.05
        this.perception = 50
        this.separation
        this.radius = 2.0
    }

    update() {
        this.pos.add(this.velocity)
        this.velocity.add(this.acceleration)
        this.velocity.limit(this.maxspeed)
        this.acceleration.mult(0)
    }

    show() {
        const theta = this.velocity.heading() + radians(90);
        fill(127);
        stroke(200);
        push();
        translate(this.pos.x, this.pos.y);
        rotate(theta);
        beginShape();
        vertex(0, -this.radius * 2);
        vertex(-this.radius, this.radius * 2);
        vertex(this.radius, this.radius * 2);
        endShape(CLOSE);
        pop();
    }

    edges() {
        if (this.pos.x > width) {
            this.pos.x = 0
        } else if (this.pos.x < 0) {
            this.pos.x = width
        }
        if (this.pos.y > height) {
            this.pos.y = 0
        } else if (this.pos.y < 0) {
            this.pos.y = height
        }
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
            // if (other != this) {
                const d = dist(this.pos.x, this.pos.y, other.pos.x, other.pos.y)
                if (d > 0 && d < this.perception) {
                    steering.add(other.velocity)
                    total++;
                }
            // }
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
        if (steering.mag() > 0){
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
                if (d > 0 && d < this.perception) {
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

    steer(steering) {
        let steer = steering.sub(this.velocity)
        this.applyForce(steer.mag(0.5))
    }

    flee() {

    }
}
