(function(global){
    "use strict";
/**
 * Very simple animation helper with multiple tween methods.
 *
 * Animates the properties of a list of objects. Makes sure every property in every object has a numeric value. If a value is not give, the last value will be used or 0.
 *
 */

// All equations are copied from here: http://www.gizma.com/easing/
// Originally written by Robert Penner, copied under BSD License
// (http://www.robertpenner.com/)
//

// Params are as follows
// t = current time
// b = start value
// c = change in value
// d = duration
var tween = {
    // no easing, no acceleration 
    "linear" : function(t, b, c, d) { return c * t / d + b; }, 
    // acceleration until halfway, then deceleration 
    "easeInQuad" : function(t, b, c, d) { t /= d; return c * t * t + b; }, 
    // decelerating to zero velocity 
    "easeOutQuad" : function(t, b, c, d) { t /= d; return -c * t * (t - 2) + b; }, 
    // acceleration until halfway, then deceleration 
    "easeInOutQuad" : function(t, b, c, d) { t /= d / 2; if (t < 1) { return c / 2 * t * t + b; } t--; return -c / 2 * (t * (t - 2) - 1) + b; }, 
    // accelerating from zero velocity 
    "easeInCubic" : function(t, b, c, d) { t /= d; return c * t * t * t + b; }, 
    // decelerating to zero velocity 
    "easeOutCubic" : function(t, b, c, d) { t /= d; t--; return c * (t * t * t + 1) + b; }, 
    // acceleration until halfway, then deceleration 
    "easeInOutCubic" : function(t, b, c, d) { t /= d / 2; if (t < 1) { return c / 2 * t * t * t + b; } t -= 2; return c / 2 * (t * t * t + 2) + b; }, 
    // accelerating from zero velocity 
    "easeInQuart" : function(t, b, c, d) { t /= d; return c * t * t * t * t + b; }, 
    // decelerating to zero velocity 
    "easeOutQuart" : function(t, b, c, d) { t /= d; t--; return -c * (t * t * t * t - 1) + b; }, 
    // acceleration until halfway, then deceleration 
    "easeInOutQuart" : function(t, b, c, d) { t /= d / 2; if (t < 1) { return c / 2 * t * t * t * t + b; } t -= 2; return -c / 2 * (t * t * t * t - 2) + b; }, 
    // accelerating from zero velocity 
    "easeInQuint" : function(t, b, c, d) { t /= d; return c * t * t * t * t * t + b; }, 
    // decelerating to zero velocity 
    "easeOutQuint" : function(t, b, c, d) { t /= d; t--; return c * (t * t * t * t * t + 1) + b; }, 
    // acceleration until halfway, then deceleration 
    "easeInOutQuint" : function(t, b, c, d) { t /= d / 2; if (t < 1) { return c / 2 * t * t * t * t * t + b; } t -= 2; return c / 2 * (t * t * t * t * t + 2) + b; }, 
    // accelerating from zero velocity 
    "easeInSine" : function(t, b, c, d) { return -c * Math.cos(t / d * (Math.PI / 2)) + c + b; }, 
    // decelerating to zero velocity 
    "easeOutSine" : function(t, b, c, d) { return c * Math.sin(t / d * (Math.PI / 2)) + b; }, 
    // accelerating until halfway, then decelerating 
    "easeInOutSine" : function(t, b, c, d) { return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b; }, 
    // accelerating from zero velocity 
    "easeInExpo" : function(t, b, c, d) { return c * Math.pow(2, 10 * (t / d - 1)) + b; }, 
    // decelerating to zero velocity 
    "easeOutExpo" : function(t, b, c, d) { return c * (-Math.pow(2, -10 * t / d) + 1) + b; }, 
    // accelerating until halfway, then decelerating 
    "easeInOutExpo" : function(t, b, c, d) { t /= d / 2; if (t < 1) { return c / 2 * Math.pow(2, 10 * (t - 1)) + b; } t--; return c / 2 * (-Math.pow(2, -10 * t) + 2) + b; }, 
    // accelerating from zero velocity 
    "easeInCirc" : function(t, b, c, d) { t /= d; return -c * (Math.sqrt(1 - t * t) - 1) + b; }, 
    // decelerating to zero velocity 
    "easeOutCirc" : function(t, b, c, d) { t /= d; t--; return c * Math.sqrt(1 - t * t) + b; }, 
    // acceleration until halfway, then deceleration 
    "easeInOutCirc" : function(t, b, c, d) { t /= d / 2; if (t < 1) { return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b; } t -= 2; return c / 2 * (Math.sqrt(1 - t * t) + 1) + b; } 
};

function getTween(easing)
{
    var fn = tween[easing];

    if (!fn)
    {
        throw new Error("No tween named '" + easing + "'.");
    }

    return  fn;
}

global.Interpolator = Class.extend({
    init: function (easing, objects) {

        if (objects === undefined)
        {
            objects = easing;
            easing = "linear";
        }

        this.tweenFn = getTween(easing);
        this.keyFrames = [];

        this.dirty = true;

        if (typeof objects !== "undefined") {
            this.keyFrames = this.keyFrames.concat(objects);
        }
    },
    add: function (obj) {
        this.dirty = true;
        this.keyFrames.push(obj);
        return this.keyFrames.length - 1;
    },
    key: function (index, value) {
        if (typeof value === "undefined") {
            this.keyFrames[index] = value;
        }
        else {
            return this.keyFrames[index];
        }
    },
    /**
     * Returns an object with interpolated values for the Time t where the integer value of t
     * determines the keyframe used and fractional positon of t the position within the key frames.
     */
    interpolate: function (t) {

        var obj1, obj0, obj, fract, idx0, localTween, fn;

        this.dirty && this.cleanup();

        idx0 = Math.floor(t);
        fract = t - idx0;

        obj = {};
        obj0 = this.keyFrames[idx0];

        obj1 = this.keyFrames[idx0 + 1] || this.keyFrames[0];

        for (var k in obj0) {

            localTween = obj0._tween;
            fn = typeof localTween == "function" ? getTween(localTween) : this.tweenFn;
            obj[k] = fn(fract, obj0[k], obj1[k] - obj0[k], 1);
        }

        return obj;
    },
    cleanup: function () {

        var i,
            len = this.keyFrames.length,
            key = {};

        for (i = 0; i < len; i++) {
            var frame = this.keyFrames[i];
            for (var k in frame) {
                if (k[0] != "_")
                {
                    key[k] = true;
                }
            }
        }

        for (i = 0; i < len; i++) {
            var frame = this.keyFrames[i];
            for (var k in key) {
                var v = frame[k];

                if (typeof v === "undefined") {
                    frame[k] = i == 0 ? 0 : this.keyFrames[i - 1][k];
                }
            }
        }
        this.dirty = false;
    },
    /**
     * Makes sure the give time value is within the bounds of this Interpolator.
     */
    clampTime: function (t) {
        var len = this.keyFrames.length - 1;
        var i = Math.floor(t);
        var fract = t - i;

        i = i % len;
        if (i < 0) {
            i += len;
        }
        return i + fract;
    }
});
})(this);
