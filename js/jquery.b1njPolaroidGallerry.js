/*! jQuery B1njPolaroidGallery - v1.0
* hhttps://github.com/b1nj/b1njPolaroidGallery
* Includes: jquery.ui.js
* Copyright (c) 2012 b1nj Licensed MIT */
(function ($)
{
    jQuery.fn.b1njPolaroidGallery = function ()
    {
        this.each (function (index, value)
        {
            $(this).addClass('b1njPolaroidGallery');
            var galleryW = $(this).width();
            var galleryH = $(this).height();
            $('li', this).each (function (index, value) 
            {
                var alt = $('img', this).attr('alt');
                if (alt != '') {
                    $(this).append('<p>'+ alt +'</p>')                    
                }
                
                $(this).width($('img', this).width() + (Number($('img', this).css('margin-left').slice(0,-2)) * 2));
                
                $('a', this).click(function (e) 
                {
                    if (!$(this).parent('li').hasClass('b1njPolaroidGallery-linkOk')) {
                        $(this).parent('li').addClass('b1njPolaroidGallery-linkOk');
                        e.preventDefault();
                        e.stopPropagation();
                        //return false;
                    }
                });

                var photoW = $(this).width();
                var photoH = $(this).height();
                
                var tempRotDegrees = randomXToY(0, 20);
                var tempVal = Math.round(Math.random());
                if(tempVal == 1) {
                    var rotDegrees = 360 - tempRotDegrees; // rotate left
                } else {
                    var rotDegrees = tempRotDegrees; // rotate right
                }

                var shiftT = shiftAfeterRotate(photoH, photoW, tempRotDegrees)
                var shiftL = shiftAfeterRotate(photoW, photoH, tempRotDegrees)
                
                if (galleryH - shiftT - photoH > shiftT) {
                    var top = randomXToY(shiftT, galleryH - shiftT - photoH); 
                } else {
                    var top = shiftT;
                }
                if (galleryW - shiftL - photoW > shiftL) {
                    var left = randomXToY(shiftL, galleryW - shiftL - photoW);
                } else {
                    var left = shiftL;
                }

                var cssObj = { 
                    'left' : '+=' + left,
                    'top' : '+=' + top,
                    '-webkit-transform' : 'rotate('+ rotDegrees +'deg)',
                    '-ms-transform' : 'rotate('+ rotDegrees +'deg)',
                    '-moz-transform' : 'rotate('+ rotDegrees +'deg)',
                    '-o-transform' : 'rotate('+ rotDegrees +'deg)',
                    'transform' : 'rotate('+ rotDegrees +'deg)' 
                };
                $(this).css(cssObj).data('rotDegrees', rotDegrees);

                $(this).bind('mousedown', function(e)
                {
                    $(this).parent('ul').find('li').not(this).removeClass('b1njPolaroidGallery-active b1njPolaroidGallery-linkOk');
                    $(this).addClass('b1njPolaroidGallery-active');
                }).
                draggable({
                    containment : 'parent',
                    start: function(event, ui) {
                        if (('a', this).length != 0) {
                            $(this).addClass('b1njPolaroidGallery-LinkOk');
                        }
                    },
                    stop: function(event, ui) {
                        rotDegrees = $(this).data('rotDegrees');
                        var cssObj = { 
                            '-webkit-transform' : 'rotate('+ rotDegrees +'deg)', 
                            '-ms-transform' : 'rotate('+ rotDegrees +'deg)',  
                            '-moz-transform' : 'rotate('+ rotDegrees +'deg)',  
                            '-o-transform' : 'rotate('+ rotDegrees +'deg)', 
                            'tranform' : 'rotate('+ rotDegrees +'deg)'
                        };
                        $(this).css(cssObj);
                    }
                });
            });
        });
        return this;
    }
}) (jQuery);

// Function to get random number upto m
// http://roshanbh.com.np/2008/09/get-random-number-range-two-numbers-javascript.html
function randomXToY(minVal,maxVal,floatVal) 
{
    var randVal = minVal+(Math.random()*(maxVal-minVal));
    return typeof floatVal=='undefined'?Math.round(randVal):randVal.toFixed(floatVal);
}

// Fuction get the shift after rotate the photo
// http://www.maths-forum.com/trigonometrie-rotation-d-un-rectangle-129467.php
// //x = (1/V2).V(CD² + AD²) * V(1-cos(alpha)) * sin[(180° - alpha)/2 - arctg(AD/CD)] 
function shiftAfeterRotate(height, width, rotate) 
{
    var x = (1/Math.sqrt(2)) * 
    Math.sqrt(Math.pow(width,2) + Math.pow(height,2)) * 
    Math.sqrt(1 - Math.cos(rotate * (Math.PI / 180))) * 
    Math.sin(((180 - rotate)/2 - (Math.atan2(height, width)  * (180 / Math.PI))) * (Math.PI / 180));
    return x;
}
