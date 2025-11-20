import Globals from "./globals.js";

export default class TentaclesInstance extends globalThis.InstanceType.Tentacles
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