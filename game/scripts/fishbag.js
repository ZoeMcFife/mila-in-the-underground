import Globals from "./globals.js";

export default class FishBagInstance extends globalThis.InstanceType.FishBag
{
    constructor()
    {
        super();

        // configurable params (tweak these)
        this._radius = 80;            // orbit radius in px
        this._orbitSpeed = Math.PI;   // radians per second (Math.PI = half rotation / sec)
        this._followSpeed = 8.0;      // how quickly the bag catches up (higher = snappier)
        this._spinOffsetDeg = 0;      // rotate the bag by this many degrees (visual spin)
        this._playerOffset = { x: 0, y: 0 }; // additional offset from player's center (px)

        // internal state
        this._angle = Math.random() * Math.PI * 2; // start at random angle
        this._lastPerf = typeof performance !== "undefined" ? performance.now() : Date.now();
    }

    OnTick(runtime)
    {
        this.FollowMovement(runtime);
        this.SetSprite();
    }

    SetSprite()
    {
        switch (Globals.fishCollected)
        {
            case 0:
                this.setAnimation("0")
                break;
            case 1:
                this.setAnimation("1")
                break;
            case 2:
                this.setAnimation("2")
                break;
            case 3:
                this.setAnimation("3")
                break;
            case 4:
                this.setAnimation("4")
                break;
            case 5:
                this.setAnimation("5")
                break;
            case 6:
                this.setAnimation("6")
                break;
            case 7:
                this.setAnimation("7")
                break;
            case 8:
                this.setAnimation("8")
                break;
            case 9:
                this.setAnimation("9")
                break;
            case 10:
                this.setAnimation("10")
                break;
            default:
                this.setAnimation("10")
                break;
        }
    }

    FollowMovement(runtime)
    {   
        if (Globals.fishCollected == 0)
        {
            this.setPosition(-100, -100);
            return;
        }

        const player = Globals.playerInstance;
        if (!player)
            return;

        // === dt (seconds) - robust fallback if runtime.GetDt isn't present ===
        let dt = 1/60;
        const now = (typeof performance !== "undefined") ? performance.now() : Date.now();
        if (runtime && typeof runtime.GetDt === "function") {
            // Construct's runtime GetDt returns seconds per tick in many SDKs
            dt = runtime.GetDt();
        } else {
            dt = (now - this._lastPerf) / 1000;
        }
        this._lastPerf = now;

        // === player center conversion (player origin 0,64 for 64x64) ===
        // origin is at bottom-left: to get center, add half width to X and subtract half height from Y
        const PLAYER_HALF_W = 32; // 64 / 2
        const PLAYER_HALF_H = 32; // 64 / 2

        const [playerX, playerY] = player.getPosition(); // returns origin position
        const centerX = playerX + PLAYER_HALF_W + this._playerOffset.x;
        const centerY = playerY - PLAYER_HALF_H + this._playerOffset.y;

        // === update angle for orbit ===
        this._angle += this._orbitSpeed * dt;
        // keep angle bounded to avoid float blowup
        if (this._angle > Math.PI * 2) this._angle -= Math.PI * 2;

        // target position on the orbit
        const targetX = centerX + this._radius * Math.cos(this._angle);
        const targetY = centerY + this._radius * Math.sin(this._angle);

        // current position
        const [curX, curY] = this.getPosition();

        // smoothing: exponential lerp based on follow speed and dt (feels smooth at different framerates)
        // t in (0,1), closer to 1 is snappier
        const t = 1 - Math.exp(-this._followSpeed * dt);

        const newX = curX + (targetX - curX) * t;
        const newY = curY + (targetY - curY) * t;

        this.setPosition(newX, newY);
    }

}