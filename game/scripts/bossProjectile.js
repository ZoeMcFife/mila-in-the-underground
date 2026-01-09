import Globals from "./globals.js";

export default class BossProjectileInstance extends globalThis.InstanceType.BossProjectile
{
    constructor()
    {
        super();
    }

    OnTick(runtime)
    {
        this.CollisionCheck();
    }

    CollisionCheck()
    {
        if (this.testOverlap(Globals.playerInstance))
        {
            Globals.playerInstance.TakeDamage(this, false);
            this.destroy();
        }

        if (Globals.umbrellaShieldInstance && this.testOverlap(Globals.umbrellaShieldInstance))
        {
            this.setAnimation("Supercharged");

            const bulletBehavior = this.behaviors.Bullet;
            bulletBehavior.angleOfMotion = -90;

            // Optional: speed boost for extra punch
            bulletBehavior.speed *= 1.5;           }
    }
}