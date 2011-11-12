(function($)
{

var factor = 0.001;
var factor_max = 0.002;

var speed = 1/ 250;
var speed_max = 1 / 125;

window.onload = function()
{
    var $canvas = $("#teh-canvas");
    var canvas = $canvas[0];
    
    var width = canvas.width;
    var height = canvas.height;

    var ctx = canvas.getContext('2d');  
    
    var offset = $canvas.offset();
    $canvas.mousemove(function(ev)
    {   
        factor = (ev.pageX - offset.left) / width * factor_max * 2 - factor_max;
        speed = (ev.pageY - offset.top) / height * speed_max * 2 - speed_max;
    });
    
    
    var $img = $("#jamrot");
    
    ctx.drawImage($img[0], 0,0, width, height);
    
    var screen = ctx.createImageData(width,height); 
    var image = ctx.getImageData(0,0,width,height); 

    var ip = new Interpolator("easeInOutQuad");
    ip.add({
        x: width / 5,
        y: height / 5,
        r: 0,
        zoom: 0.2
    });
    ip.add({
        x: width / 2,
        y: height / 2,
        r: Math.PI * 2,
        zoom: 1
    });
    ip.add({
        x: width / 5,
        y: height / 5,
        r: Math.PI * 4,
        zoom: 0.2
    });

    var time = 0.0;
    
    var scanWidth = width * 4;

    MainLoop.start($canvas, function() {
        
        var line =0;
        var imageData = image.data;
        for (var y = 0 ; y < height * scanWidth; y+=scanWidth)
        {
            var lineTime = ip.clampTime( time + line * factor );
            var obj = ip.interpolate(lineTime);
            var zoom = obj.zoom;
            var dx = Math.cos(obj.r) * zoom;
            var dy = Math.sin(obj.r) * zoom;
            var posX = - obj.x * dx;
            var posY = - obj.y * dy;

            posX -= dy * line; 
            posY += dx * line; 
            
            for (var x = 0 ; x < scanWidth; )
            {
                var off = (Math.floor(posY) * scanWidth + posX * 4) & 0xffffc;
                screen.data[y + x++] = imageData[off++];
                screen.data[y + x++] = imageData[off++];
                screen.data[y + x++] = imageData[off++];
                screen.data[y + x++] = imageData[off];
                
                posX += dx;
                posY += dy;
            }

            line++;
        }
        
        ctx.putImageData(screen,0,0);

        time = ip.clampTime( time +  speed);
        
    });
};
    
})(jQuery);