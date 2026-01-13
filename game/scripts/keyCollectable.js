import Globals from "./globals.js";

export default class KeyCollectableInstance extends globalThis.InstanceType.KeyCollectable
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
            Globals.keyUnlocked = true;
            
            this.destroy();
        }
    }
}