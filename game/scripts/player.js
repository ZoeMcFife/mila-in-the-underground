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

        this.initialSpeed = this.behaviors.Platform.acceleration
        this.initialJump = this.behaviors.Platform.jumpStrength

        this.Directions = 
        {
            LEFT: 0,
            RIGHT: 1,
            UP: 2,
            DOWN: 3
        }

    }

    OnTick(runtime)
    {
        const keyboard = runtime.keyboard;

        this.PlayerAnimations(keyboard);
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
    }

    TakeDamage(attacker, isFromAbove)
    {   
        if (this.dead)
        {
            return;
        }

        /*if (!this.IsPlayerProtected())
        {
            this.OnDeath();
            return;
        }*/

        if (isFromAbove && !this.protectedUp)
        {
            console.log("Correct death")
            this.OnDeath();
            return;
        }
        
        if (isFromAbove)
        {
            return;
        }

        let direction = this.CheckDamageDirection(attacker);

        const unprotected =
            (direction === this.Directions.LEFT && !this.protectedLeft) ||
            (direction === this.Directions.RIGHT && !this.protectedRight) ||
            (direction === this.Directions.UP && !this.protectedUp);

        if (unprotected)
        {
            console.log(`Death from ${Object.keys(this.Directions).find(k => this.Directions[k] === direction)}`);
            this.OnDeath();
        }

        /*if (damageDirection == this.Directions.LEFT && !this.protectedLeft)
        {   
            console.log("wronf death")
            this.OnDeath();
            return;
        }

        if (damageDirection == this.Directions.RIGHT && !this.protectedRight)
        {
            this.OnDeath();
            return;
        }

        if (damageDirection == this.Directions.UP && !this.protectedUp)
        {
            this.OnDeath();
            return;
        }*/
    }

    IsPlayerProtected()
    {
        if (this.protectedUp || this.protectedLeft || this.protectedRight)
        {
            return true;
        }

        return false;
    }

    /*CheckDamageDirection(attacker)
    {
        let playerX = this.getPosition()[0];
        let attackerX = attacker.getPosition()[0];

        let playerY = this.getPosition()[1];
        let attackerY = attacker.getPosition()[1];

        if (playerY < attackerY + 64)
        {
            return this.Directions.UP;
        }

        if (playerX > attackerX)
        {
            return this.Directions.RIGHT;
        }
        else
        {
            return this.Directions.LEFT
        }
    }*/

    CheckDamageDirection(attacker)
    {
        const [playerX, playerY] = this.getPosition();
        const [attackerX, attackerY] = attacker.getPosition();

        // Adjust for origin offset if needed
        const playerCenterY = playerY - 64; // adjust if origin at (0,64)
        
        const dx = attackerX - playerX;
        const dy = attackerY - playerCenterY;

        // atan2 gives angle in radians; convert to degrees
        let angle = Math.atan2(dy, dx) * 180 / Math.PI;

        // Remap so 0° = UP, clockwise
        //angle += 90;
        if (angle > 180) angle -= 360;  // keep in [-180,180]

        console.log(angle)

        let up_angle = 25;
        let right_angle = 180 - up_angle;

        // Map angle to direction
        if (angle > -up_angle && angle <= up_angle)       // UP
            return this.Directions.UP;
        else if (angle > up_angle && angle <= right_angle)  // RIGHT
            return this.Directions.RIGHT;
        else if (angle <= -up_angle && angle > -right_angle) // LEFT
            return this.Directions.LEFT;
        else                                  // DOWN
            return this.Directions.DOWN;
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