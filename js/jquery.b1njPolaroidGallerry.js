/*! jQuery B1njPolaroidGallery - v1.0
* https://github.com/b1nj/b1njPolaroidGallery
* Includes: jquery.ui.js
* Copyright (c) 2012 b1nj Licensed MIT */
(function ($)
{
    $.fn.b1njPolaroidGallery = function (options)
    {
        var settings = $.extend( {
            'maxRotation' : 20,
            'randomStacking' : true
        }, options);
        
        this.each (function (index, value)
        {
            $(this).addClass('b1njPolaroidGallery');
            var galleryW = $(this).width();
            var galleryH = $(this).height();
            var nbPhotos = $('li', this).length;
            var zIndex = new Array();
            for(var i=0; i<nbPhotos; i++) {
                zIndex[i] = i + 1;
            }
            if (settings.randomStacking) {
                var zIndex = zIndex.sort(function() { return 0.5 - Math.random() });
            }
            
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
                
                var tempRotDegrees = randomXToY(0, settings.maxRotation);
                var tempVal = Math.round(Math.random());
                if(tempVal == 1) {
                    var rotDegrees = 360 - tempRotDegrees; // rotate left
                } else {
                    var rotDegrees = tempRotDegrees; // rotate right
                }

                var shiftT = shiftAfeterRotate(photoH, photoW, tempRotDegrees);
                var shiftL = shiftAfeterRotate(photoW, photoH, tempRotDegrees);
                
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
                    'top' : '+=' + top
                };
                cssObj['z-index'] = zIndex[index];
                $(this).css(cssObj).b1njPolaroidGalleryRotate(rotDegrees).data('rotDegrees', rotDegrees);

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
                        $(this).b1njPolaroidGalleryRotate(rotDegrees);
                    }
                });
            });
        });
        
        // Private functions
        
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
            if ($.browser.msie  && parseInt($.browser.version, 10) === 8) {
                return 0;
            }
            var x = (1/Math.sqrt(2)) * 
            Math.sqrt(Math.pow(width,2) + Math.pow(height,2)) * 
            Math.sqrt(1 - Math.cos(rotate * (Math.PI / 180))) * 
            Math.sin(((180 - rotate)/2 - (Math.atan2(height, width)  * (180 / Math.PI))) * (Math.PI / 180));
            return x;
        }
        return this;
    };
    $.fn.b1njPolaroidGalleryRotate = function (rotation)
    {
        if ($.browser.msie  && parseInt($.browser.version, 10) === 8) {
            if (rotation >= 0) {
                var rotation = Math.PI * rotation / 180;
            } else {
                var rotation = Math.PI * (360 + rotation) / 180;
            }
            var cssObj = {
                'filter' : 'progid:DXImageTransform.Microsoft.Matrix(M11=' + Math.cos(rotation) + ",M12=" + (-Math.sin(rotation)) + ",M21=" + Math.sin(rotation) + ",M22=" + Math.cos(rotation) + ",SizingMethod='auto expand')"
            }
        } else {
            var cssObj = { 
                '-webkit-transform' : 'rotate('+ rotation +'deg)', 
                '-ms-transform' : 'rotate('+ rotation +'deg)',  
                '-moz-transform' : 'rotate('+ rotation +'deg)',  
                '-o-transform' : 'rotate('+ rotation +'deg)', 
                'tranform' : 'rotate('+ rotation +'deg)'
            };
        }            
        $(this).css(cssObj);
        return this;
    }
}) (jQuery);