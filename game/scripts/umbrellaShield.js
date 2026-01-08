import Globals from "./globals.js";

export default class UmbrellaShieldInstance extends globalThis.InstanceType.UmbrellaShield
{
    constructor()
    {
        super();
    }

    OnTick(runtime)
    {
        console.log(this.getPosition());
    }

    FollowCat()
    {
        const cat = Globals.playerInstance;

        this.setPosition(cat.getPosition[0], cat.getPosition[1]);
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
        this.angle = -90;
    }

    RotateRight()
    {
        this.angle = 90;
    }
}