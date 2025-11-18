import Globals from "./globals.js";

export default class BulletInstance extends globalThis.InstanceType.Bullet
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
    }
}