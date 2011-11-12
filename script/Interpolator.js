(function(){
    
var tween = {
    "linear" : function(t, b, c, d)
    {
        // no easing, no acceleration
        return c * t / d + b;
    },

    // All equations are copied from here: http://www.gizma.com/easing/
    // Originally written by Robert Penner, copied under BSD License
    // (http://www.robertpenner.com/)
    //
    // Params are as follows
    // t = current time
    // b = start value
    // c = change in value
    // d = duration
    "easeInQuad" : function(t, b, c, d)
    {
        t /= d;
        return c * t * t + b;
    },

    // decelerating to zero velocity
    "easeOutQuad" : function(t, b, c, d)
    {
        t /= d;
        return -c * t * (t - 2) + b;
    },

    // acceleration until halfway, then deceleration
    "easeInOutQuad" : function(t, b, c, d)
    {
        t /= d / 2;
        if (t < 1)
        {
            return c / 2 * t * t + b;
        }
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    },

    // accelerating from zero velocity
    "easeInCubic" : function(t, b, c, d)
    {
        t /= d;
        return c * t * t * t + b;
    },

    // decelerating to zero velocity
    "easeOutCubic" : function(t, b, c, d)
    {
        t /= d;
        t--;
        return c * (t * t * t + 1) + b;
    },

    // acceleration until halfway, then deceleration
    "easeInOutCubic" : function(t, b, c, d)
    {
        t /= d / 2;
        if (t < 1)
        {
            return c / 2 * t * t * t + b;
        }
        t -= 2;
        return c / 2 * (t * t * t + 2) + b;
    },

    // accelerating from zero velocity
    "easeInQuart" : function(t, b, c, d)
    {
        t /= d;
        return c * t * t * t * t + b;
    },

    // decelerating to zero velocity
    "easeOutQuart" : function(t, b, c, d)
    {
        t /= d;
        t--;
        return -c * (t * t * t * t - 1) + b;
    },

    // acceleration until halfway, then deceleration
    "easeInOutQuart" : function(t, b, c, d)
    {
        t /= d / 2;
        if (t < 1)
        {
            return c / 2 * t * t * t * t + b;
        }
        t -= 2;
        return -c / 2 * (t * t * t * t - 2) + b;
    },

    // accelerating from zero velocity
    "easeInQuint" : function(t, b, c, d)
    {
        t /= d;
        return c * t * t * t * t * t + b;
    },

    // decelerating to zero velocity
    "easeOutQuint" : function(t, b, c, d)
    {
        t /= d;
        t--;
        return c * (t * t * t * t * t + 1) + b;
    },

    // acceleration until halfway, then deceleration
    "easeInOutQuint" : function(t, b, c, d)
    {
        t /= d / 2;
        if (t < 1)
        {
            return c / 2 * t * t * t * t * t + b;
        }
        t -= 2;
        return c / 2 * (t * t * t * t * t + 2) + b;
    },

    // accelerating from zero velocity
    "easeInSine" : function(t, b, c, d)
    {
        return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
    },

    // decelerating to zero velocity
    "easeOutSine" : function(t, b, c, d)
    {
        return c * Math.sin(t / d * (Math.PI / 2)) + b;
    },

    // accelerating until halfway, then decelerating
    "easeInOutSine" : function(t, b, c, d)
    {
        return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
    },

    // accelerating from zero velocity
    "easeInExpo" : function(t, b, c, d)
    {
        return c * Math.pow(2, 10 * (t / d - 1)) + b;
    },

    // decelerating to zero velocity
    "easeOutExpo" : function(t, b, c, d)
    {
        return c * (-Math.pow(2, -10 * t / d) + 1) + b;
    },

    // accelerating until halfway, then decelerating
    "easeInOutExpo" : function(t, b, c, d)
    {
        t /= d / 2;
        if (t < 1)
        {
            return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
        }
        t--;
        return c / 2 * (-Math.pow(2, -10 * t) + 2) + b;
    },

    // accelerating from zero velocity
    "easeInCirc" : function(t, b, c, d)
    {
        t /= d;
        return -c * (Math.sqrt(1 - t * t) - 1) + b;
    },

    // decelerating to zero velocity
    "easeOutCirc" : function(t, b, c, d)
    {
        t /= d;
        t--;
        return c * Math.sqrt(1 - t * t) + b;
    },

    // acceleration until halfway, then deceleration
    "easeInOutCirc" : function(t, b, c, d)
    {
        t /= d / 2;
        if (t < 1)
        {
            return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
        }
        t -= 2;
        return c / 2 * (Math.sqrt(1 - t * t) + 1) + b;
    }
};
 
this.Interpolator = Class.extend({
init:
    function(easing)
    {
        easing = easing || "linear";
    
        this.keyFrames = [];
        this.tweenFn = typeof easing == "function" ? easing: tween[easing];
    },
add:
    function(obj)
    {
        this.dirty = true;
        this.keyFrames.push(obj);
        return this.keyFrames.length - 1;
    },
key:
    function(index, value)
    {
        if (value === undefined)
        {
            this.keyFrames[index] = value;
        }
        else
        {
            return this.keyFrames[index];
        }
    },
interpolate:
    function(t)
    {
        this.cleanup();
        
        var idx0 = Math.floor(t);
        var fract = t - idx0;
        
        var obj = {};
        var obj0 = this.keyFrames[idx0];
        
        var obj1 = this.keyFrames[idx0 + 1] || this.keyFrames[0];
        
        for (var k in obj0)
        {
            obj[k] = this.tweenFn(fract, obj0[k], obj1[k] - obj0[k], 1);
        }
        
        return obj;
    },
cleanup:
    function()
    {
        if (this.dirty)
        {
            var key = {};
            for ( var i = 0, len = this.keyFrames.length; i < len; i++)
            {
                var frame = this.keyFrames[i];
                for (var k in frame)
                {
                    key[k] = true;
                }
            }
            
            for ( var i = 0, len = this.keyFrames.length; i < len; i++)
            {
                var frame = this.keyFrames[i];
                for (var k in key)
                {
                    var v = frame[k];
                    
                    if (v === undefined)
                    {
                        frame[j] = i == 0 ? 0 : this.keyFrames[i-1][k];
                    }
                }
            }
            dirty = false;
        }
    },
clampTime:
    function(t)
    {
        var len = this.keyFrames.length - 1;
        var i = Math.floor(t);
        var fract = t - i;
        
        i = i % len;
        if (i < 0)
        {
            i += len;
        }
        return i + fract;
    }
});

})();