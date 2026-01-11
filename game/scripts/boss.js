import Globals from "./globals.js";

export default class BossInstance extends globalThis.InstanceType.Boss
{
    constructor()
    {
        super();

        this.originalXPosition = this.getPosition()[0];
        this.originalYPosition = this.getPosition()[1];
        this.movementRange = 1000;
        this.movementSpeed = 1;
        this.movementAmplitude = 150;
        this.verticalSpeed = 0.02;
        this.direction = 1;

        this.health = 1;
        this.isDead = false;
    }

    OnTick(runtime)
    {
        this.Movement(runtime);
        this.CollisionCheck();


    }

    TakeDamage()
    {
        if (this.health <= 0)
        {
            return;
        }

        this.health--;

        if (this.health <= 0)
        {
            this.Death();
        }
    }

    Death()
    {
        this.setAnimation("Explode");
        this.setSize(300, 300);
        this.isDead = true;
        Globals.bossDefeated = true;
    }

    Movement(runtime)
    {
        if (this.isDead === true)
        {
            return;
        }

        const xPosition = this.getPosition()[0];

        if (Math.abs(xPosition - this.originalXPosition) >= (this.movementRange / 2))
        {   
            this.direction *= -1;
        }

        this.setPosition(xPosition + this.movementSpeed * this.direction, this.originalYPosition + Math.sin(runtime.tickCount * this.verticalSpeed) * this.movementAmplitude);  
    }

    CollisionCheck()
    {
        if (this.testOverlap(Globals.playerInstance) && !this.isDead)
        {
            Globals.playerInstance.TakeDamage(this, false);
        }
    }
}