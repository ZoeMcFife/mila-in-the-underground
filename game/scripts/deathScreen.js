import Globals from "./globals.js";

export default class DeathScreenInstance extends globalThis.InstanceType.DeathScreen
{
    constructor()
    {
        super();
    }

    OnTick(runtime)
    {
        
    }

    PlayDeathAnimation()
    {
        this.setAnimation("death");
    }

    PlayRespawnAnimation()
    {
        this.setAnimation("respawn");
    }
}