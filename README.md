Time-shifting Zoom-Rotator
==========================

[This canvas effect](http://fforw.de/static/demo/jamrot/) is based on the end credits effect in ["Jammin'", a Haujobb demo](http://www.youtube.com/watch?v=ZmuzXse-ftM#t=2m57s).

It was basically a zoom-rotator with per-line time-shift and blur. This version actually rendered multiple screens and then recombined
them line-wise, something which was really quick and easy to do on teh Amiga.

This code here is the result of my attempts to recreate the effect for browser canvas. Since the memory requirements for doing
it the way I did it back then are pretty high for today's resolution ( width * height * height basically), I tried to do
it all in one screen this time.

Let's start the explanation with looking at a normal zoom rotator.

Normal Zoom-Rotator
------------------- 

The normal zoom rotator is one of the classic demo effects. In shows a endlessly tiled image, zooming and rotating the image.

Let's go to some theory for the basic zoom-rotator:

We have an image which is usually square, with the size often being a power of 2. Each pixel in the image has a position x,y within the image's coordinate system / space where
0,0 is usually the top/left corner and e.g. 511,511 the bottom/right corner. 

Then we have our screen we draw in with its own, independently oriented coordinate system / space. 

![Diagram for a simple zoom-rotator](https://github.com/fforw/jamrot/blob/master/image/zoomrot.png?raw=true)

The rendering of a zoom rotator is determined by a point p determining where the point 0/0 in the coordinate system of the image is going to end up on the screen.

Then we have a zoom-factor and an angle which is represented in the diagram as vector v, of which we are only interested in the length ( = zoom factor)
and in the angle between v and the horizontal axis in the image coordinate system.

The diagram greatly exaggerates the length of the vector. It's normal size is so that it fits one pixel in screen coordinate system.

    // Pseudo code for rendering a zoom rotator
    // px = x coordinate of p
    // py = y coordinate of p
    // zoom = zoom factor (e.g. 1 / image_width )
    // angle = angle in radians
    procedure render_zoomrotator(px,py,zoom,angle)
        
        // delta coordinates in image space for one step in screen space
        du = cos(angle) * zoom
        dv = sin(angle) * zoom
        
        // calculate starting coordinates u/v in image space 
        // if we take steps of dx/dy each, where do we need to 
        // start so that we reach 0/0 in image space at the point px/py 
        // in screen space
        u = - px * du 
        v = - py * dv
        
        for y = 0 to screen_height - 1
        
            // we remember the line starting position
            start_u = u
            start_v = v
            for x = 0 to screen_width - 1
                draw image pixel u/v truncated to image limits at screen pos x/y
                u = u + du
                v = v + dv
            end
            
            // if du/dv is the step in horizontal screen direction, 
            // -dv/du is the step rotated by 90 degrees 
            
            // we add that rotated step to the remembered starting position 
            u = start_u - dv
            v = start_v + du
        end
    end


Easing
------
        
In the old days, I would just add constant values to the px,py and angle and then precalculate a sine-wave for the zoom value or something.
Since modern computers have so much more power than in the old days, I thought I might try a more fancy way and use key-frame based animation.

I wrote a simple Interpolator class that can interpolate between numeric properties on objects.

    var ip = new Interpolator("easeInOutCubic", [ { x: 0, y: 0 }, { x: 255, y: 255 } ]);
    // obj containing the values for the point two thirds along the way
    var obj = ip.interpolate(0.6667);
    
Now using only linear interpolation would be pretty boring and look ugly, so I borrowed the easing functions from the KAPI animation
project (which wasn't exactly doing what I needed).          

The easing functions all control how exactly a value gets from the starting to the end point. Here are a few examples of y-coordinate
easing with fixed stepping on the x-axis.

![Easing examples](https://github.com/fforw/jamrot/blob/master/image/easings.png?raw=true)

I set up an animation path out of three keyframes which you can still see in its original form when you center the mouse horizontally and give it some speed vertically.

Time-shift
----------

Now the only thing I needed to do was to interpolate the keyframe values per line with a time / animation-step offset.

    // Pseudo code for rendering a time-shift zoom rotator
    procedure render_time_shift_zoomrotator()
        
        for y = 0 to screen_height - 1
    
            line_time = current_time + y * time_shift_factor
            interpolate px,py,zoom,angle for line_time
            
            // delta coordinates in image space for one step in screen space
            du = cos(angle) * zoom
            dv = sin(angle) * zoom
            
            // calculate line starting coordinates u/v in image space 
            // if we take steps of dx/dy each, where do we need to 
            // start so that we reach 0/0 in image space at the point px/py 
            // in screen space
              
            u = - px * du - dy * line
            v = - py * dv + dx * line
        
            // we remember the line starting position
            start_u = u
            start_v = v
            for x = 0 to screen_width - 1
                draw image pixel u/v truncated to image limits at screen pos x/y
                u = u + du
                v = v + dv
            end
            
            // if du/dv is the step in horizontal screen direction, 
            // -dv/du is the step rotated by 90 degrees 
            
            // we add that rotated step to the remembered starting position 
            u = start_u - dv
            v = start_v + du
        end
        
        // advance global time for next rendering
        current_time = current_time + speed
    end
