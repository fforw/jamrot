Time-shifting Zoom-Rotator
==========================

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
    render(px,py,zoom,angle)
        
        // delta coordinates in image space for one step in screen space
        dx = cos(angle) * zoom
        dy = sin(angle) * zoom
        
        // calculate starting coordinates u/v in image space 
        // if we take steps of dx/dy each, where do we need to 
        // start so that we reach 0/0 in image space at the point px/py 
        // in screen space
        u = - px * dx 
        v = - py * dy
        
        for y = 0 to screen_height - 1
            for x = 0 to screen_width - 1
        