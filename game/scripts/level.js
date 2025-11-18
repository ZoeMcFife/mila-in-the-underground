import Globals from "./globals.js";

export default class Level
{
    constructor()
    {
        this.runtime = null;
    }

    ClearAllProjectiles()
    {
        runtime.objects.Bullet.instances().forEach((b) => b.destroy());
    }
}