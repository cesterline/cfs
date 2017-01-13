$(document).ready(function () {

    // part 1 - screen width test - remove off canvas nav if greater than 991px
    updateContainer();
    $(window).resize(function () {
        updateContainer();
    });

    // prevent loading link's which are labeled crnt
    $(".crnt").on('click', function (e) {
        e.preventDefault();
    });

    // select all checkboxes when checkbox in datagrid is selected
    $('thead input:checkbox').click(function (e) {
        var table = $(e.target).closest('table');
        $('td input:checkbox', table).prop('checked', this.checked);
    });

    // defines margin for panel ftr select descr
    $(".pnl-ftr select").parent("div").css("margin-left", "8px");

    // remvoes inline text(label) and replaces with html(title) attr
    $('.k-pager-sizes').contents().filter(function () {
        $(this).closest(".k-dropdown").attr("title", "Items Per Page");
        return this.nodeType === 3;
    }).remove();

    // kendo grid pangination fix
    $('.pnl-body .k-pager-wrap').children().slice(0, 5).wrapAll('<span class="k-pager-block" />');

    // enable link to tab
    $(function () {
        if (location.hash !== '') {
            var activeTab = $('[href=' + window.location.hash.replace(/\//g, '') + ']');
            activeTab && activeTab.tab('show');
        }
    });

});

// part 2 - screen width test - remove off canvas nav if greater than 991px
function updateContainer() {
    var container = document.getElementById('oc-container')
    var $containerWidth = $(window).width();
    if ($containerWidth > 991) {
        classie.remove(container, 'oc-nav-open');
    }
}

// add and remove datagrid column for desktop
function addRemoveCol(id, column) {
    $(window).on('load resize', function () {
        var grid = $(id).data('kendoGrid');
        var width = $(window).width();
        if (width < 1183 ) {
            grid.hideColumn(column);
        } else {
            grid.showColumn(column);
        }
    })
}

// set column heights equal based on tallest column
$.fn.equalize = function (e) {
    var maxHeight = 0;
    this.find(e).each(function () {
        if ($(this).height() > maxHeight) {
            maxHeight = $(this).height();
        }
    });
    this.find(e).height(maxHeight);
};

// detects document height changes -- use sparingly as this function polls every 200ms
function onElementHeightChange(elm, callback) {
    var lastHeight = elm.clientHeight, newHeight;
    (function run() {
        newHeight = elm.clientHeight;
        if (lastHeight != newHeight)
            callback();
        lastHeight = newHeight;

        if (elm.onElementHeightChangeTimer)
            clearTimeout(elm.onElementHeightChangeTimer);

        elm.onElementHeightChangeTimer = setTimeout(run, 200);
    })();
}

// if parent container's height is greater than window height re-center, vertically, spinner on the screen.
function mSpinnerPos() {
    $(".pnl").each(function () {
        var win = $(window).height();
        var activePanel = $(this).has(".content-overlay");
        var activePanelHeight = activePanel.height();
        if (activePanelHeight > win) {
            $('.material-spinner').css("height", win);
            $('html,body').animate({
                scrollTop: $(activePanel).offset().top
            }, 1000);
        } else {
            $('.material-spinner').css("height", "100%");
        }
    });
};

// material spinner
// fadeIn
function mSpinnerInit(event) {
    var element = $(event.target.activeElement);
    var overlay = element.closest(".pnl").find(".content-overlay");
    var overlayFix = function (overlay) {
        if (overlay.length) {
            $('.k-loading-mask').remove();
        }
        else {
            $('.k-loading-mask').replaceWith(MSpinner);
        }
    };
    if (element.attr("data-toggle")) {
        overlayFix(overlay);
    } else if (element.hasClass("btn") || element.is('a')) {
        if (overlay.length) {
            overlayFix(overlay);
            overlay.fadeIn(500);
            mSpinnerPos();
        } else {
            var pnl = $("#" + element.data("pnl"));
            if ($(pnl).length) {
                overlayFix(pnl);
                pnl.find(".content-overlay").fadeIn(500);
                mSpinnerPos();
            }
            else return;
        }
    } else {
        overlayFix(overlay);
        mSpinnerPos();
    }
}
// if NOT kendo -- fadeOut
function mSpinnerDefault() {
    if ($.isFunction($.fn.mSpinnerKendo)) {
        return;
    } else {
        $(".content-overlay").fadeOut(500);
    }
}
// if Kendo -- fadeOut
function mSpinnerKendo(e) {
    var conID = "#" + e.sender.element[0].id;
    $(conID).data("kendoGrid").one("dataBound", function () {
        $(conID).closest(".pnl").find(".content-overlay").fadeOut(500);
    });
}