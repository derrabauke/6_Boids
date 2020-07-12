class Predator {

    MAXSPEED = 2
    MAXFORCE = 0.015

    constructor(x, y) {
        this.chooseTarget()
        this.rTargetCircle = 50
        this.pos = createVector(x, y)
        this.vel = createVector(random(-this.MAXSPEED, this.MAXSPEED), random(-this.MAXSPEED, this.MAXSPEED))
        this.acc = createVector()
        this.seek()
    }

    update() {
        this.seek()
        this.updatepos()
    }

    seek() {
        let desiredpos = this.target.copy()
        let desiredHeading = desiredpos.sub(this.pos)
        let dist = desiredHeading.mag()

        desiredHeading.setMag(100)

        this.centerTargetCircle = this.pos.copy().add(desiredHeading)
        let circleSpeed = 0.02
        desiredHeading.add(createVector(cos(frameCount * circleSpeed) * this.rTargetCircle, sin(frameCount * circleSpeed) * this.rTargetCircle))

        this.tempTarget = this.pos.copy().add(desiredHeading)

        desiredHeading.setMag(this.MAXSPEED)
        let steering = desiredHeading.sub(this.vel)
        steering.limit(this.MAXFORCE)
        this.applyForce(steering)


        if (dist < this.rTargetCircle) {
            this.chooseTarget()
        }
    }

    chooseTarget() {
        let buffer = 80
        this.target = createVector(random(buffer, width - buffer), random(buffer, height - buffer))
    }

    applyForce(force) {
        this.acc.add(force)
    }

    updatepos() {
        this.vel.add(this.acc)
        this.vel.limit(this.MAXSPEED)
        this.pos.add(this.vel)
        this.acc.mult(0)
    }

    show() {
        push()
        noStroke()
        fill(255, 0, 0)
        translate(this.pos.x, this.pos.y)
        // translate(this.pos.x + 68 / 2, this.pos.y + 30 / 2)
        // imageMode(CENTER)
        rotate(this.vel.heading())
        // image(predatorFish, this.pos.x, this.pos.y, 68, 30)
        triangle(4, 0, -4, 3, -4, -3)
        pop()
    }
}
