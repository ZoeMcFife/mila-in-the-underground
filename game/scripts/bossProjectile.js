import Globals from "./globals.js";

export default class BossProjectileInstance extends globalThis.InstanceType.BossProjectile
{
    constructor()
    {
        super();
        this.superCharged = false;
        this.damagedBoss = false;
    }

    OnTick(runtime)
    {
        this.CollisionCheck();
    }

    CollisionCheck()
    {
        if (this.testOverlap(Globals.playerInstance) && !this.damagedBoss)
        {
            Globals.playerInstance.TakeDamage(this, false);
            this.destroy();
        }

        if (Globals.umbrellaShieldInstance && this.testOverlap(Globals.umbrellaShieldInstance))
        {
            this.setAnimation("Supercharged");
            this.superCharged = true;

            const bulletBehavior = this.behaviors.Bullet;
            bulletBehavior.angleOfMotion = -45;

            bulletBehavior.speed *= 1.5;           
        }

        if (this.superCharged && !this.damagedBoss)
        {
            if (Globals.bossInstance && this.testOverlap(Globals.bossInstance))
            {
                this.setAnimation("Explode");
                Globals.bossInstance.TakeDamage();
                const bulletBehavior = this.behaviors.Bullet;
                bulletBehavior.speed = 0;
                this.damagedBoss = true;
            }
        }
    }
}