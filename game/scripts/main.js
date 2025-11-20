
// Import any other script files here, e.g.:
// import * as myModule from "./mymodule.js";

import Globals from "./globals.js";
import Player from "./player.js";
import CheckPointInstance from "./checkpoint.js";
import DeathScreenInstance from "./deathScreen.js";
import UmbrellaInstance from "./umbrella.js";
import RainInstance from "./rain.js";
import BulletInstance from "./bullet.js";
import DangerInstance from "./danger.js";
import CollectableInstance from "./collectable.js";
import UiInstance from "./ui.js"

runOnStartup(async runtime =>
{
	// Code to run on the loading screen.
	// Note layouts, objects etc. are not yet available.
	runtime.objects.Cat.setInstanceClass(Player);
	runtime.objects.CheckPoint.setInstanceClass(CheckPointInstance);
	runtime.objects.DeathScreen.setInstanceClass(DeathScreenInstance);
	runtime.objects.Umbrella.setInstanceClass(UmbrellaInstance);
	runtime.objects.Rain.setInstanceClass(RainInstance);
	runtime.objects.Bullet.setInstanceClass(BulletInstance);
	runtime.objects.Lava_danger.setInstanceClass(DangerInstance);
	runtime.objects.Fish.setInstanceClass(CollectableInstance);
	runtime.objects.Text.setInstanceClass(UiInstance);

	runtime.addEventListener("beforeprojectstart", () => OnBeforeProjectStart(runtime));
});

async function OnBeforeProjectStart(runtime)
{
	runtime.addEventListener("tick", () => Tick(runtime));
}

let mainStarted = false;

function Tick(runtime)
{	
	/* CURSED */
	if (runtime.layout.name === "Main" && mainStarted === false)
	{
		Globals.playerInstance = runtime.objects.Cat.getFirstInstance();
		Globals.deathScreenInstance = runtime.objects.DeathScreen.getFirstInstance();
		Globals.lastCheckpointPosition = runtime.objects.Cat.getFirstInstance().getPosition();

		mainStarted = true;
	}

	if (runtime.layout.name !== "Main")
	{
		return;
	}

	Globals.playerInstance.OnTick(runtime);
	
	runtime.objects.CheckPoint.instances().forEach((checkPoint) => checkPoint.OnTick(runtime));
	runtime.objects.Umbrella.instances().forEach((umbrella) => umbrella.OnTick(runtime));
	runtime.objects.Rain.instances().forEach((rain) => rain.OnTick(runtime));
	runtime.objects.Bullet.instances().forEach((bullet) => bullet.OnTick(runtime));
	runtime.objects.Lava_danger.instances().forEach((lava) => lava.OnTick(runtime));
	runtime.objects.Fish.instances().forEach((fish) => fish.OnTick(runtime));
	runtime.objects.Text.instances().forEach((text) => text.OnTick(runtime));
}
