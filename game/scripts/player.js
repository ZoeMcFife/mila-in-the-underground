import Globals from "./globals.js";

export default class PlayerInstance extends globalThis.InstanceType.Cat
{
    constructor()
    {
        super();

        this.currentState = "idle";
        this.facing = "right";
        this.dead = false;

        this.protectedUp = false;
        this.protectedLeft = false;
        this.protectedRight = false;

        this.initialSpeed = this.behaviors.Platform.acceleration;
        this.initialJump = this.behaviors.Platform.jumpStrength;

        this.noLivesLeft = false;

        this.fullyDead = false;

        this.Directions = 
        {
            LEFT: 0,
            RIGHT: 1,
            UP: 2,
            DOWN: 3
        }

    }

    async OnTick(runtime)
    {
        const keyboard = runtime.keyboard;

        this.PlayerAnimations(keyboard);

        if (this.noLivesLeft && this.fullyDead === false)
        {   
            console.log("this should only run once");
            Globals.umbrellaUnlocked = false;
            this.fullyDead = true;
            runtime.objects.Transistion.getFirstInstance().setAnimation("Start");
            await new Promise(resolve => setTimeout(resolve, 5000));
            runtime.goToLayout("GameOver");
        }
    }

    PlayerAnimations(keyboard)
    {   
        if (this.dead)
        {
            this.setAnimation("dead");
            return
        }

        this.protectedLeft = false;
        this.protectedRight = false;
        this.protectedUp = false;

        const left = keyboard.isKeyDown("ArrowLeft");
        const right = keyboard.isKeyDown("ArrowRight");

        let protect = keyboard.isKeyDown("KeyS");
        let protect_up = keyboard.isKeyDown("KeyW"); 

        if (keyboard.isKeyDown("KeyL"))
        {
            this.OnDeath();
            return
        }

        if (left) 
        {
            this.facing = "left";
        }
        else if (right) 
        {
            this.facing = "right";
        }

        let newState = "stand"; // default state is standing

        if (protect && Globals.umbrellaUnlocked) 
        {
            newState = "protect";
            
            if (left || right) 
            {
                newState += "_walk";
            }

            if (left)
            {
                this.protectedLeft = true;
            }
            else
            {
                this.protectedRight = true;
            }
        }	
        else if (protect_up && Globals.umbrellaUnlocked)
        {
            newState = "protect_up";
            
            this.protectedUp = true;

            if (left || right) 
            {
                newState += "_walk";
            }
        }
        else if (left || right) 
        {
            newState = "walk";
        }


        let animName = `${newState}_${this.facing}`;

        if (animName !== this.currentState) 
        {
            this.currentState = animName;
            this.setAnimation(animName);
        }
        
        if (this.IsPlayerProtected())
        {
            Globals.umbrellaShieldInstance.FollowCat();
        }
        else
        {
            Globals.umbrellaShieldInstance.StopFollowingCat();
        }


        console.log(animName);

        if (newState === "protect_up" || newState === "protect_up_walk")
        {
            Globals.umbrellaShieldInstance.RotateUp();
        }
        else if (animName === "protect_left" || animName === "protect_walk_left")
        {
            Globals.umbrellaShieldInstance.RotateLeft();
        }
        else if (animName === "protect_right" || animName === "protect_walk_right")
        {
            Globals.umbrellaShieldInstance.RotateRight();
        }
    }

    IsPlayerProtected()
    {
        if (this.protectedUp || this.protectedLeft || this.protectedRight)
        {
            return true;
        }

        return false;
    }

    TakeDamage(attacker, isFromAbove)
    {   
        if (this.dead)
        {
            return;
        }


        if (isFromAbove && !this.protectedUp)
        {
            console.log("Correct death")
            this.OnDeath();
            return;
        }

        if (isFromAbove && this.protectedUp)
        {
            return;
        }

        this.OnDeath();
    }

    async OnDeath()
    {
        if (this.dead)
        {
            return;
        }

        this.dead = true;

        // remove movement
        this.behaviors.Platform.acceleration = 0;
        this.behaviors.Platform.jumpStrength = 0;
        
        if (Globals.fishCollected === 0)
        {
            this.noLivesLeft = true;
            return;
        }

        if (Globals.fishCollected > 0)
        {
            Globals.fishCollected--;
        }

        Globals.deathScreenInstance.PlayDeathAnimation();
        
        await new Promise(resolve => setTimeout(resolve, Globals.deathDuration));

        Globals.deathScreenInstance.PlayRespawnAnimation();

        this.Respawn()

        this.dead = false; 
    }


    Respawn()
    {
        const coords = Globals.lastCheckpointPosition;
        this.setPosition(coords[0], coords[1]);
        this.currentState = "idle";

        // add movement
        this.behaviors.Platform.acceleration = this.initialSpeed
        this.behaviors.Platform.jumpStrength = this.initialJump
    }

}