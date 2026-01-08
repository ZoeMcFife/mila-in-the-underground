import Globals from "./globals.js";

export default class UmbrellaShieldInstance extends globalThis.InstanceType.UmbrellaShield
{
    constructor()
    {
        super();
    }

    OnTick(runtime)
    {
        
    }

    FollowCat()
    {
        const cat = Globals.playerInstance;
        
        this.setPosition(cat.getPosition()[0] + 32, cat.getPosition()[1] - 32);
    }

    StopFollowingCat()
    {
        this.setPosition(-100, -100);
    }

    RotateUp()
    {
        this.angle = 0;
    }

    RotateLeft()
    {
        this.angle = 80;
    }

    RotateRight()
    {
        this.angle = -80;
    }
}