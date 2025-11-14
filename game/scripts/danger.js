import Globals from "./globals.js";

export default class DangerInstance extends globalThis.InstanceType.Lava_danger
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
            Globals.playerInstance.OnDeath();
        }
    }
}