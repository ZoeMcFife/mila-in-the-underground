import Globals from "./globals.js";

export default class CollectableInstance extends globalThis.InstanceType.Fish
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
            Globals.fishCollected++;
            
            this.destroy();
        }
    }
}