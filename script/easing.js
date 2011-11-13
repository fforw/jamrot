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
    $(".easing").each(function()
    {
        this.width = 256;
        this.height = 256;
        var ctx = this.getContext('2d');
        
        var name = this.getAttribute("data-easing");
        
        ctx.fillStyle = "#f0f0f0";
        ctx.fillRect(0,0,255,255);
        ctx.fillStyle = "#003";
        ctx.fillText(name,4,12);
        
        var ip = new Interpolator(name);
        ip.add({y:255});
        ip.add({y:0});
        
        ctx.strokeStyle = "#000";
        var frame = ip.interpolate(0);
        ctx.beginPath();
        ctx.moveTo(0,frame.y);
        
        var step = 1/64;
        for (var i=step; i <= 1; i+= step)
        {
            frame = ip.interpolate(i);
            ctx.lineTo(i * 256,frame.y);
        }
        ctx.stroke();
        
    });
};
    
})(jQuery);
