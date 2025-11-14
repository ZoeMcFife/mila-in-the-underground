import Globals from "./globals.js";

export default class CheckPointInstance extends globalThis.InstanceType.CheckPoint
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
        //console.log(this.testOverlap(Globals.playerInstance));
        if (this.testOverlap(Globals.playerInstance))
        {
            Globals.lastCheckpointPosition = this.getPosition();
        }
    }
}