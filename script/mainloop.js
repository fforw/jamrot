(function($)
{
this.MainLoop = 
{
start:
    function($canvas, mainloop, fallbackFrameRate)
    {
        fallbackFrameRate = fallbackFrameRate || 50;
        
        var animFrame = window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame    ||
                window.oRequestAnimationFrame      ||
                window.msRequestAnimationFrame     ||
                null ;
    
        if ( animFrame !== null ) {
    
            if ( $.browser.mozilla ) {
                var recursiveAnim = function() {
                    mainloop();
                    animFrame();
                };
    
                // setup for multiple calls
                window.addEventListener("MozBeforePaint", recursiveAnim, false);
    
                // start the mainloop
                animFrame();
            } else {
                var recursiveAnim = function() {
                    mainloop();
                    animFrame( recursiveAnim, $canvas );
                };
    
                // start the mainloop
                animFrame( recursiveAnim, $canvas );
            }
        } else {
            var ONE_FRAME_TIME = 1000.0 / fallbackFrameRate ;
            setInterval( mainloop, ONE_FRAME_TIME );
        }
    }
};
    
})(jQuery);
