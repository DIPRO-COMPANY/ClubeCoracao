/*
 * Tiny Carousel 1.9 - Modified
 * http://www.baijs.nl/tinycarousel
 *
 * Copyright 2010, Maarten Baijs
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.opensource.org/licenses/gpl-2.0.php
 *
 * Date: 01 / 06 / 2011
 * Depends on library: jQuery
 *
 * Modified in 09/2013
 * - New options and method implemented.
 * - Object's size calculation logic modified
 */
(function($)
{
    $.tiny = $.tiny || { };

    $.tiny.carousel =
    {
        options:
        {
            start: 1, // where should the carousel start?
            startPosition: 0, // First item in focus when carousel starts.
            display: 1, // how many blocks do you want to move at 1 time?
            axis: "x", // vertical or horizontal scroller? ( x || y ).
            controls: true, // show left and right navigation buttons.
            pager: false, // is there a page number navigation present?
            interval: false, // move to another block on intervals.
            intervaltime: 3000, // interval time in milliseconds.
            rewind: false, // If interval is true and rewind is true it will play in reverse if the last slide is reached.
            animation: true, // false is instant, true is animate.
            duration: 1000, // how fast must the animation move in ms?
            beforeMove: null, // function that executes before every move.
            afterMove: null, // function that executes after every move.
            fixedPageWidth: 0, // Fixed value to solve a bug, with page outerWidth.
            fixedViewWidth: 0, // Fixed value to solve a bug, with viewport outerWidth.
            UseViewSize: false // Use viewport size insted page size to calculate move distance.
        }
    };

    $.fn.tinycarousel_start = function () { $(this).data("tcl").start(); };
    $.fn.tinycarousel_stop = function () { $(this).data("tcl").stop(); };
    $.fn.tinycarousel_move = function (iNum) { $(this).data("tcl").move(iNum - 1,true); };

    function Carousel(root, options)
    {
        var oSelf     = this
        ,   oViewport = $(".viewport:first", root)
        ,   oContent  = $(".overview:first", root)
        ,   oPages    = oContent.children()
        ,   oBtnNext  = $(".next:first", root)
        ,   oBtnPrev  = $(".prev:first", root)
        ,   oPager    = $(".pager:first", root)
        ,   iPageSize = 0
        ,   iViewSize = 0
        ,   iSteps    = 0
        ,   iCurrent  = 0
        ,   oTimer    = undefined
        ,   bPause    = false
        ,   bForward  = true
        ,   bAxis     = options.axis === "x";

        function setButtons()
        {
            if(options.controls)
            {
                oBtnPrev.toggleClass("disabled", iCurrent <= 0 );
                oBtnNext.toggleClass("disabled", !(iCurrent + 1 < iSteps));
            }

            if(options.pager)
            {
                var oNumbers = $(".pager-link", oPager);
                oNumbers.removeClass("active");
                $(oNumbers[iCurrent]).addClass("active");
            }
        }

        function setPager(oEvent)
        {
            if($(this).hasClass("pager-link"))
            {
                oSelf.move(parseInt(this.rel, 10), true);
            }
            return false;
        }

        function setTimer()
        {
            if(options.interval && !bPause)
            {
                clearTimeout(oTimer);

                oTimer = setTimeout(function()
                {
                    iCurrent = iCurrent + 1 === iSteps ? -1 : iCurrent;
                    bForward = iCurrent + 1 === iSteps ? false : iCurrent === 0 ? true : bForward;
                    oSelf.move(bForward ? 1 : -1);
                }, options.intervaltime);
            }
        }

        function setEvents()
        {
            if(options.controls && oBtnPrev.length > 0 && oBtnNext.length > 0)
            {
                oBtnPrev.click(function()
                {
                    if(!$(this).hasClass("disabled"))
                        oSelf.move(-1);

                    return false;
                });

                oBtnNext.click(function()
                {
                    if(!$(this).hasClass("disabled"))
                        oSelf.move(1);

                    return false;
                });
            }

            if(options.interval)
            {
                root.hover(oSelf.stop, oSelf.start);
            }

            if(options.pager && oPager.length > 0)
            {
                $("a", oPager).click(setPager);
            }
        }

        this.stop  = function()
        {
            clearTimeout(oTimer);
            bPause = true;
        };

        this.start = function()
        {
            bPause = false;
            setTimer();
        };

        this.move  = function(iDirection, bPublic)
        {
            iCurrent = bPublic ? iDirection : iCurrent += iDirection;

            if(iCurrent > -1 && iCurrent < iSteps)
            {
                var oPosition = {};

                if(typeof options.beforeMove === "function")
                {
                    options.beforeMove.call(this, oPages[iCurrent], iCurrent);
                }

                setButtons();

                oPosition[bAxis ? "left" : "top"] = -(iCurrent * ((options.UseViewSize ? iViewSize : iPageSize) * options.display));

                oContent.animate(oPosition,
                {
                    queue: false,
                    duration: options.animation ? options.duration : 0,
                    complete: function()
                    {
                        if(typeof options.afterMove === "function")
                        {
                            options.afterMove.call(this, oPages[iCurrent], iCurrent);
                        }
                    }
                });

                setTimer();
            }
        };

       function initialize()
       {
            iPageSize = bAxis ? $(oPages[0]).outerWidth(true) : $(oPages[0]).outerHeight(true);
            iPageSize = (options.fixedPageWidth > 0 ? options.fixedPageWidth : iPageSize);

            iViewSize = (options.fixedViewWidth > 0 ? options.fixedViewWidth : (bAxis ? oViewport.outerWidth() : oViewport.outerHeight()));

            var iLeftover = Math.ceil((iViewSize / (iPageSize * options.display)) -1);

            iSteps = Math.max(1, Math.ceil(oPages.length / options.display) - iLeftover);

            iCurrent = Math.min(iSteps, Math.max(1, options.start)) - 2;

            iCurrent += options.startPosition;

            oContent.css(bAxis ? "width" : "height", ((options.UseViewSize ? iViewSize : iPageSize) * oPages.length));

            oSelf.move(1);

            setEvents();

            return oSelf;
        }

        return initialize();
    }

    $.fn.tinycarousel = function(params)
    {
        var options = $.extend({}, $.tiny.carousel.options, params);
        this.each(function(){ $(this).data("tcl", new Carousel($(this), options)); });
        return this;
    };
}(jQuery));