(function($)
{

var factor = 0.001;
var factor_max = 0.002;

var speed = 1/ 250;
var speed_max = 1 / 125;

function setAlpha(imageData,v)
{
    for ( var i = 3, len = imageData.data.length; i < len; i+=4)
    {
        imageData.data[i] = 255;
    }
}

window.onload = function()
{
    var $canvas = $("#teh-canvas");
    var canvas = $canvas[0];
    
    var width = canvas.width;
    var height = canvas.height;

    var ctx = canvas.getContext('2d');  
    
    var offset = $canvas.offset();
    
    // turn mouse position into plus / minus the maximum values.
    $canvas.mousemove(function(ev)
    {   
        factor = (ev.pageX - offset.left) / width * factor_max * 2 - factor_max;
        speed = (ev.pageY - offset.top) / height * speed_max * 2 - speed_max;
    });
    
    
    var $img = $("#jamrot");
    
    ctx.drawImage($img[0], 0,0, width, height);
    
    var screen = ctx.createImageData(width,height); 
    var image = ctx.getImageData(0,0,width,height);

    setAlpha(screen,255);

    // create interpolator with 3 zoomrotator state keyframes using easeInOutQuad tween.
    var ip = new Interpolator("easeInOutQuad", 
    [
        {
            x: width / 5,
            y: height / 5,
            r: 0,
            zoom: 0.2
        },
        {
            x: width / 2,
            y: height / 2,
            r: Math.PI * 2,
            zoom: 1
        },
        {
            x: width / 5,
            y: height / 5,
            r: Math.PI * 4,
            zoom: 0.2
        }
    ]);

    var time = 0.0;
    
    var scanWidth = width * 4;
    var scanHeight = height * scanWidth;

    MainLoop.start($canvas, function() {
        
        var line = 0;
        var imageData = image.data;
        var screenData = screen.data;
        for (var y = 0 ; y < scanHeight; y += scanWidth)
        {
            var lineTime = ip.clampTime( time + line * factor );
            var obj = ip.interpolate(lineTime);
            var zoom = obj.zoom;
            var du = Math.cos(obj.r) * zoom;
            var dv = Math.sin(obj.r) * zoom;

            // image start coordinates for interpolated values and current line 
            var u = 256 - obj.x * du - dv * line;
            var v = 256 - obj.y * dv + du * line;
            
            for (var x = 0 ; x < scanWidth; x += 4)
            {
                var off = (Math.floor(v) * scanWidth + u * 4) & 0xffffc; // mask value for a 512x512 graphic only
                var soff = x + y;
                screenData[soff++] = imageData[off++];
                screenData[soff++] = imageData[off++];
                screenData[soff] = imageData[off];
                u += du;
                v += dv;
            }
            line++;
        }
        
        ctx.putImageData(screen,0,0);

        time = ip.clampTime( time +  speed);
    });
};
    
})(jQuery);