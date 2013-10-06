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
            var $gallery = $(this);
            var galleryW = $gallery.width();
            var galleryH = $gallery.height();
            var nbPhotos = $('li', this).length;
            var zIndex = new Array();
            for(var i = 0; i < nbPhotos; i++) {
                zIndex[i] = i + 1;
            }
            if (settings.randomStacking) {
                var zIndex = zIndex.sort(function() { return 0.5 - Math.random() });
            }

            $gallery.addClass('b1njPolaroidGallery');

            $('li', this).each (function (index, value)
            {
                var $photo = $(this);

                var alt = $('img', this).attr('alt');
                if (alt != '') {
                    $(this).append('<p>'+ alt +'</p>')
                }

                $photo.width($('img', this).width() + (Number($('img', this).css('margin-left').slice(0,-2)) * 2));

                $('a', this).click(function (e)
                {
                    var $lien = $(this);
                    if (!$lien.parent('li').hasClass('b1njPolaroidGallery-linkOk')) {
                        $lien.parent('li').addClass('b1njPolaroidGallery-linkOk');
                        e.preventDefault();
                        e.stopPropagation();
                    }
                });

                var photoW = $photo.outerWidth();
                var photoH = $photo.outerHeight();

                var rotDegrees = randomXToY(0, settings.maxRotation);
                var tempVal = Math.round(Math.random());
                if(tempVal == 1) {
                    var rotDegrees = 360 - rotDegrees; // rotate left
                }

                var shiftT = shiftAfterRotate(photoH, photoW, rotDegrees);
                var shiftL = shiftAfterRotate(photoW, photoH, rotDegrees);

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

                var datas = {
                    'shiftT' : shiftT,
                    'shiftL' : shiftL,
                    'rotDegrees' : rotDegrees,
                    'photoH' : photoH,
                    'photoW' : photoW
                };

                $photo.css(cssObj).
                b1njPolaroidGalleryRotate(rotDegrees).
                data(datas).
                bind('mousedown', function(e)
                {
                    var thisOldZIndex = zIndex[index];
                    for(var i = 0; i < zIndex.length; i++) {
                        var $this = $('li:eq(' + i + ')', gallery);
                        if (zIndex[i] == nbPhotos && i != index) {
                            var thisDatas = $this.data();
                            var top = $this.position().top;
                            var left = $this.position().left;
                            if (top < thisDatas.shiftT) {
                                $this.css('top', '+=' + (top + thisDatas.shiftT));
                            } else if (thisDatas.photoH + top + thisDatas.shiftT > galleryH) {
                                $this.css('top', '-=' + (thisDatas.photoH + top + thisDatas.shiftT - galleryH));
                            }
                            if (left < thisDatas.shiftL) {
                                $this.css('left', '+=' + (left + thisDatas.shiftL));
                            } else if (thisDatas.photoW + left + thisDatas.shiftL > galleryW) {
                                $this.css('left', '-=' + (thisDatas.photoW + left + thisDatas.shiftL - galleryW));
                            }
                        }
                        if (zIndex[i] > thisOldZIndex) {
                            zIndex[i]--;
                        } else if (i == index) {
                            zIndex[i] = nbPhotos;
                        }
                        $this.css('z-index', zIndex[i]);
                    }
                    $gallery.find('li').not(this).removeClass('b1njPolaroidGallery-active b1njPolaroidGallery-linkOk');
                    $photo.addClass('b1njPolaroidGallery-active');
                }).
                draggable({
                    containment : 'parent',
                    start: function(event, ui) {
                        if (('a', this).length != 0) {
                            $photo.addClass('b1njPolaroidGallery-LinkOk');
                        }
                    },
                    stop: function(event, ui) {
                        rotDegrees = $(this).data('rotDegrees');
                        $photo.b1njPolaroidGalleryRotate(rotDegrees);
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

        return this;
    };
    $.fn.b1njPolaroidGalleryRotate = function (rotation)
    {
        if ($.browser.msie  && parseInt($.browser.version, 10) === 8) {
            var photoW = this.outerWidth();
            var photoH = this.outerHeight();
            var shiftT = shiftAfterRotate(photoH, photoW, rotation);
            var shiftL = shiftAfterRotate(photoW, photoH, rotation);
            if (rotation >= 0) {
                rotation = Math.PI * rotation / 180;
            } else {
                rotation = Math.PI * (360 + rotation) / 180;
            }
            var cssObj = {
                'filter' : 'progid:DXImageTransform.Microsoft.Matrix(M11=' + Math.cos(rotation) + ",M12=" + (-Math.sin(rotation)) + ",M21=" + Math.sin(rotation) + ",M22=" + Math.cos(rotation) + ",SizingMethod='auto expand')",
                'margin-top' : -shiftT,
                'margin-left' : -shiftL
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
        this.css(cssObj);
        return this;
    }

    // Fuction get the shift after rotate the photo
    // http://www.maths-forum.com/trigonometrie-rotation-d-un-rectangle-129467.php
    // //x = (1/V2).V(CD² + AD²) * V(1-cos(alpha)) * sin[(180° - alpha)/2 - arctg(AD/CD)]
    function shiftAfterRotate(height, width, rotate)
    {
        if (rotate > 180) {
            rotate = 360 - rotate;
        } else if (rotate < 0) {
            rotate = -rotate;
        }
        var x = (1/Math.sqrt(2)) *
        Math.sqrt(Math.pow(width,2) + Math.pow(height,2)) *
        Math.sqrt(1 - Math.cos(rotate * (Math.PI / 180))) *
        Math.sin(((180 - rotate)/2 - (Math.atan2(height, width)  * (180 / Math.PI))) * (Math.PI / 180));
        return x;
    }
}) (jQuery);