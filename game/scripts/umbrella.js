import Globals from "./globals.js";

export default class UmbrellaInstance extends globalThis.InstanceType.Umbrella
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
            Globals.umbrellaUnlocked = true;
            
            this.destroy();
        }
    }
}