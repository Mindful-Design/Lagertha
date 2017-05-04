/*!
    
 =========================================================
 * Light Bootstrap Dashboard - v1.3.1.0
 =========================================================
 
 * Product Page: http://www.creative-tim.com/product/light-bootstrap-dashboard
 * Copyright 2017 Creative Tim (http://www.creative-tim.com)
 * Licensed under MIT (https://github.com/creativetimofficial/light-bootstrap-dashboard/blob/master/LICENSE.md)
 
 =========================================================
 
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 
 */

var searchVisible = 0;
var transparent = true;

var transparentDemo = true;
var fixedTop = false;

var navbar_initialized = false;

$(document).ready(function () {

    /* sidebar... */

    var dailyFollow = 0;
    var dailyViews = 0;
    var timedFollow = 0;
    var timedViews = 0;

    /* checks daily */

    function runOncePerDay() {
        var today = new Date().toLocaleDateString();
        if (localStorage.executedToday == today) return;
        localStorage.executedToday = today;

        $.ajax({
            url: urlTwitch,
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Client-ID", clientID);
            },
            type: 'GET',
            dataType: 'json',
            contentType: 'application/json',
            processData: false,
            success: function (data) {
                var dailyFollow2 = data;
                dailyFollow = dailyFollow2.followers;
                dailyViews = dailyFollow2.views;
                localStorage.setItem('dailyFollow', dailyFollow);
                localStorage.setItem('dailyViews', dailyViews);
            },
            error: function () {
                console.log("Cannot get data");
            }
        });
    }

    runOncePerDay();

    /* checks at 1min intervals */

    setInterval(function () {
        $.ajax({
            url: urlTwitch,
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Client-ID", clientID);
            },
            type: 'GET',
            dataType: 'json',
            contentType: 'application/json',
            processData: false,
            success: function (data) {
                var timedFollow2 = data;
                timedFollow = timedFollow2.followers;
                timedViews = timedFollow2.views;
                dailyFollow = localStorage.getItem('dailyFollow');
                dailyViews = localStorage.getItem('dailyViews');
                document.getElementById("todaysF").innerHTML = parseInt(timedFollow) - parseInt(dailyFollow);
                document.getElementById("todaysV").innerHTML = parseInt(timedViews) - parseInt(dailyViews);
                document.getElementById("followsTotal").innerHTML = parseInt(timedFollow);
            },
            error: function () {
                console.log("Cannot get data");
            }
        });
    }, 60000);

    /* sets followgoal */

    $('#followGoalInput').on("input", function () {
        var numberChosen = this.value;
        $('#followGoalChosen').text(numberChosen);
        localStorage.setItem('numberChosen', numberChosen);
        numberChosenInt = parseInt(numberChosen);
        var parsing1 = parseInt($('#followsTotal').text())
        var parsing2 = numberChosenInt;
        var percentageFG = (parsing1 / parsing2) * 100;
        $('.progress-bar').css('width', percentageFG + '%').attr('aria-valuenow', percentageFG);
    });

    $(window).unload(function () {
        var parsing1 = parseInt($('#followsTotal').text())
        var parsing2 = numberChosenInt;
        var percentageFG = (parsing1 / parsing2) * 100;
        $('.progress-bar').css('width', percentageFG + '%').attr('aria-valuenow', percentageFG);
    })

    window_width = $(window).width();

    // check if there is an image set for the sidebar's background
    lbd.checkSidebarImage();

    // Init navigation toggle for small screens
    if (window_width <= 991) {
        lbd.initRightMenu();
    }

    //  Activate the tooltips
    $('[rel="tooltip"]').tooltip();

    //      Activate the switches with icons
    if ($('.switch').length != 0) {
        $('.switch')['bootstrapSwitch']();
    }
    //      Activate regular switches
    if ($("[data-toggle='switch']").length != 0) {
        $("[data-toggle='switch']").wrap('<div class="switch" />').parent().bootstrapSwitch();
    }

    $('.form-control').on("focus", function () {
        $(this).parent('.input-group').addClass("input-group-focus");
    }).on("blur", function () {
        $(this).parent(".input-group").removeClass("input-group-focus");
    });

    // Fixes sub-nav not working as expected on IOS
    $('body').on('touchstart.dropdown', '.dropdown-menu', function (e) {
        e.stopPropagation();
    });
});

// activate collapse right menu when the windows is resized
$(window).resize(function () {
    if ($(window).width() <= 991) {
        lbd.initRightMenu();
    }
});

lbd = {
    misc: {
        navbar_menu_visible: 0
    },

    checkSidebarImage: function () {
        $sidebar = $('.sidebar');
        image_src = $sidebar.data('image');

        if (image_src !== undefined) {
            sidebar_container = '<div class="sidebar-background" style="background-image: url(' + image_src + ') "/>'
            $sidebar.append(sidebar_container);
        }
    },
    initRightMenu: function () {
        if (!navbar_initialized) {
            $navbar = $('nav').find('.navbar-collapse').first().clone(true);

            $sidebar = $('.sidebar');
            sidebar_color = $sidebar.data('color');

            $logo = $sidebar.find('.logo').first();
            logo_content = $logo[0].outerHTML;

            ul_content = '';

            $navbar.attr('data-color', sidebar_color);

            //add the content from the regular header to the right menu
            $navbar.children('ul').each(function () {
                content_buff = $(this).html();
                ul_content = ul_content + content_buff;
            });

            // add the content from the sidebar to the right menu
            content_buff = $sidebar.find('.nav').html();
            ul_content = ul_content + content_buff;


            ul_content = '<div class="sidebar-wrapper">' +
                '<ul class="nav ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all" role="tablist">' +
                '<ul class="statusGrid">' +
                '<li><span id="streamOnline2"></span></li>' +
                '<li><div id="streamUptime2"></div>uptime</li>' +
                '<li><div id="timePlayed2"></div>played</li>' +
                '<li><div id="viewerCount2"></div>viewers</li>' +
                '<li><span id="whisperModeStatus2"></span></li>' +
                '<li><span id="meModeStatus2"></span></li>' +
                '<li><span id="muteModeStatus2"></span></li>' +
                '<li><span id="commandPauseStatus2"></span></li></ul>' +
                '<div class="switch"><input type="checkbox" onclick="$.switchTheme()" checked=""><label for="switch3-input"><span class="fa fa-sun-o"></span><span class="fa fa-moon-o"></span><div></div></label></div>' +
                "<li> <a class=\"open-tab sidebarButtons\" data-tab-index=\"0\"href=\"#dashboard\"><i class=\"pe-7s-graph\"><\/i><p>Dashboard<\/p><\/a> <\/li><li> <a class=\"open-tab sidebarButtons\" data-tab-index=\"1\"href=\"#commands\"><i class=\"pe-7s-plugin\"><\/i><p>Commands<\/p><\/a> <\/li><li> <a class=\"open-tab sidebarButtons\" data-tab-index=\"2\"href=\"#donations\"><i class=\"pe-7s-piggy\"><\/i><p>Donations<\/p><\/a> <\/li><li class=\"master\"><a class=\"groupHeader sidebarButtons\" id=\"loyalty2Show\"><i class=\"pe-7s-star\"><\/i><p>Loyalty<b class=\"caret\"><\/b><\/p><\/a> <\/li><li id=\"loyalty2Group1\" class=\"subli\" style=\"display:none;\">    <a class=\"open-tab sidebarButtons\" data-tab-index=\"3\"href=\"#points\">        <p>Points<\/p>    <\/a><\/li><li id=\"loyalty2Group2\" class=\"subli\" style=\"display:none;\">    <a class=\"open-tab sidebarButtons\" data-tab-index=\"4\"href=\"#ranks\">        <p>Ranks<\/p>    <\/a><\/li><li id=\"loyalty2Group3\" class=\"subli\" style=\"display:none;\">    <a class=\"open-tab sidebarButtons\" data-tab-index=\"5\"href=\"#time\">        <p>Time<\/p>    <\/a><\/li><li class=\"master\">    <a class=\"groupHeader sidebarButtons\" id=\"admin2Show\"><i class=\"pe-7s-config\"><\/i><p>Administration<b class=\"caret\"><\/b><\/p><\/a><\/li><li id=\"admin2Group1\" class=\"subli\" style=\"display:none;\">    <a class=\"open-tab sidebarButtons\" data-tab-index=\"6\"href=\"#moderation\">        <p>Moderation<\/p>    <\/a><\/li><li id=\"admin2Group2\" class=\"subli\" style=\"display:none;\">    <a class=\"open-tab sidebarButtons\" data-tab-index=\"7\"href=\"#viewers\">        <p>Permissions<\/p>    <\/a><\/li><li class=\"master\">    <a class=\"groupHeader sidebarButtons\" id=\"inter2Show\"><i class=\"pe-7s-science\"><\/i><p>Interactions<b class=\"caret\"><\/b><\/p><\/a><\/li><li id=\"inter2Group1\" class=\"subli\" style=\"display:none;\">    <a class=\"open-tab sidebarButtons\" data-tab-index=\"8\"href=\"#greetings\">        <p>Alerts<\/p>    <\/a><\/li><li id=\"inter2Group2\" class=\"subli\" style=\"display:none;\">    <a class=\"open-tab sidebarButtons\" data-tab-index=\"9\"href=\"#audio\">        <p>Audio<\/p>    <\/a><\/li><li id=\"inter2Group3\" class=\"subli\" style=\"display:none;\">    <a class=\"open-tab sidebarButtons\" data-tab-index=\"10\"href=\"#keywords\">        <p>Keywords<\/p>    <\/a><\/li><li id=\"inter2Group4\" class=\"subli\" style=\"display:none;\">    <a class=\"open-tab sidebarButtons\" data-tab-index=\"11\"href=\"#notices\">        <p>Notices<\/p>    <\/a><\/li><li id=\"inter2Group5\" class=\"subli\" style=\"display:none;\">    <a class=\"open-tab sidebarButtons\" data-tab-index=\"12\"href=\"#quotes\">        <p>Quotes<\/p>    <\/a><\/li><li class=\"master\">    <a class=\"groupHeader sidebarButtons\" id=\"util2Show\"><i class=\"pe-7s-tools\"><\/i><p>Utilities<b class=\"caret\"><\/b><\/p><\/a> <\/li><li id=\"util2Group1\" class=\"subli\" style=\"display:none;\">    <a class=\"open-tab sidebarButtons\" data-tab-index=\"13\"href=\"#games\">        <p>Games<\/p>    <\/a><\/li><li id=\"util2Group2\" class=\"subli\" style=\"display:none;\">    <a class=\"open-tab sidebarButtons\" data-tab-index=\"14\"href=\"#gambling\">        <p>Giveaways<\/p>    <\/a><\/li><li id=\"util2Group3\" class=\"subli\" style=\"display:none;\">    <a class=\"open-tab sidebarButtons\" data-tab-index=\"15\"href=\"#hostraid\">        <p>Hosts\/Raids<\/p>    <\/a><\/li><li id=\"util2Group4\" class=\"subli\" style=\"display:none;\">    <a class=\"open-tab sidebarButtons\" data-tab-index=\"16\"href=\"#poll\">        <p>Polls<\/p>    <\/a><\/li><li id=\"util2Group5\" class=\"subli\" style=\"display:none;\">    <a class=\"open-tab sidebarButtons\" data-tab-index=\"17\"href=\"#queue\">        <p>Queue<\/p>    <\/a><\/li><li class=\"master\">    <a class=\"groupHeader sidebarButtons\" id=\"third2Show\"><i class=\"pe-7s-share\"><\/i><p>Connections<b class=\"caret\"><\/b><\/p><\/a><\/li><li id=\"third2Group1\" class=\"subli\" style=\"display:none;\">    <a class=\"open-tab sidebarButtons\" data-tab-index=\"18\"href=\"#discord\">        <p>Discord<\/p>    <\/a><\/li><li id=\"third2Group2\" class=\"subli\" style=\"display:none;\">    <a class=\"open-tab sidebarButtons\" data-tab-index=\"19\"href=\"#twitter\">        <p>Twitter<\/p>    <\/a><\/li><li class=\"master\"> <a class=\"open-tab sidebarButtons\" data-tab-index=\"20\"href=\"#help\"><i class=\"pe-7s-info\"><\/i><p>Information<\/p><\/a> <\/li>" +
                '</ul>' +
                '</div>' +
                "<script>" +
                "$('#loyalty2Show').click(function () {$('#loyalty2Group1').toggle('slow', function () {});$('#loyalty2Group2').toggle('slow', function () {});$('#loyalty2Group3').toggle('slow', function () {});});$('#admin2Show').click(function () {$('#admin2Group1').toggle('slow', function () {});$('#admin2Group2').toggle('slow', function () {});});$('#third2Show').click(function () {$('#third2Group1').toggle('slow', function () {});$('#third2Group2').toggle('slow', function () {});});$('#inter2Show').click(function () {$('#inter2Group1').toggle('slow', function () {});$('#inter2Group2').toggle('slow', function () {});$('#inter2Group3').toggle('slow', function () {});$('#inter2Group4').toggle('slow', function () {});$('#inter2Group5').toggle('slow', function () {});});$('#util2Show').click(function () {$('#util2Group1').toggle('slow', function () {});$('#util2Group2').toggle('slow', function () {});$('#util2Group3').toggle('slow', function () {});$('#util2Group4').toggle('slow', function () {});$('#util2Group5').toggle('slow', function () {});});" +
                "$('.open-tab').click(function(event){$('#tabs').tabs(\"option\", \"active\", $(this).data(\"tab-index\"));});" +
                "</script>";

            navbar_content = logo_content + ul_content;

            $navbar.html(navbar_content);

            $('body').append($navbar);

            background_image = $sidebar.data('image');
            if (background_image != undefined) {
                $navbar.css('background', "url('" + background_image + "')")
                    .removeAttr('data-nav-image')
                    .addClass('has-image');
            }


            $toggle = $('.navbar-toggle');

            $navbar.find('a').removeClass('btn btn-round btn-info btn-fill');
            $navbar.find('button').removeClass('btn-round btn-fill btn-info btn-info btn-fill btn-success btn-danger btn-warning btn-neutral');
            $navbar.find('button').addClass('btn-simple btn-block');

            $toggle.click(function () {
                if (lbd.misc.navbar_menu_visible == 1) {
                    $('html').removeClass('nav-open');
                    lbd.misc.navbar_menu_visible = 0;
                    $('#bodyClick').remove();
                    setTimeout(function () {
                        $toggle.removeClass('toggled');
                    }, 400);

                } else {
                    setTimeout(function () {
                        $toggle.addClass('toggled');
                    }, 430);

                    div = '<div id="bodyClick"></div>';
                    $(div).appendTo("body").click(function () {
                        $('html').removeClass('nav-open');
                        lbd.misc.navbar_menu_visible = 0;
                        $('#bodyClick').remove();
                        setTimeout(function () {
                            $toggle.removeClass('toggled');
                        }, 400);
                    });

                    $('html').addClass('nav-open');
                    lbd.misc.navbar_menu_visible = 1;

                }
            });
            navbar_initialized = true;
        }

    }
}


// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.

function debounce(func, wait, immediate) {
    var timeout;
    return function () {
        var context = this,
            args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        }, wait);
        if (immediate && !timeout) func.apply(context, args);
    };
};
