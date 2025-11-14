import Globals from "./globals.js";

export default class UiInstance extends globalThis.InstanceType.Text
{
    constructor()
    {
        super();
    }

    OnTick(runtime)
    {
        console.log(Globals.fishCollected);
        this.text = "Collected Fish: " + Globals.fishCollected;
    }

}