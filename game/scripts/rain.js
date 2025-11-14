import Globals from "./globals.js";

export default class RainInstance extends globalThis.InstanceType.Rain
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
            Globals.playerInstance.TakeDamage(this, true)
        }
    }
}