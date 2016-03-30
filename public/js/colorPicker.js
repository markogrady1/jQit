var activateColor, buildWidget, cancelColor, colors;

colors = null;



cancelColor = function() {
    var $blackout, $shades, $widget;
    $widget = $('.color-widget');
    $blackout = $widget.find('.blackout');
    $widget.find('.color.active').removeClass('active');
    $shades = $widget.find('.shades');
    $shades.removeClass('visible');
    $blackout.removeClass('visible');
    return setTimeout(function() {
        return $shades.remove();
    }, 1000);
};

activateColor = function($active) {
    var $blackout, $color, $row, $shades, $widget, hex, name, _i, _len, _ref;
    cancelColor();
    $widget = $('.color-widget');
    $blackout = $widget.find('.blackout');
    name = $active.data('name');
    $row = $active.parents('.row');
//        $shades = $('<div class="shades"></div>');
    _ref = colors[name];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        hex = _ref[_i];
        $color = $('<button class="color"></button>');
        $color.attr('data-hex', hex);
        $color.css('background-color', hex);
//            $shades.append($color);


    }
    var getcolor = function myFunction(e)
    {

        alert(e.target);
    }
    $row.before($shades);
    $active.addClass('active');
    $blackout.addClass('visible');
    return setTimeout(function() {
//            return $shades.addClass('visible');
    }, 0);


};


buildWidget = function() {
    var $back, $blackout, $color, $row, $widget, columnNumber, hex, i, index, name, names, nextRow, rowNumber, rows, _i, _j, _len;
    $widget = $('.color-widget');
    names = Object.keys(colors);
    rows = [];
    for (i = _i = 0; _i <= 3; i = ++_i) {
        $row = $('<div class="row visible"></div>');
        $widget.append($row);
        rows[i] = $row;
    }
    columnNumber = -1;
    rowNumber = 0;
    nextRow = function() {
        columnNumber += 1;
        if (columnNumber === 5) {
            rowNumber += 1;
            columnNumber = 0;
        }
        return rowNumber;
    };
    for (index = _j = 0, _len = names.length; _j < _len; index = ++_j) {
        name = names[index];
//            if (index === 4) {
//                $back = $('<button class="back" title="back"><div class="icon"></div></button>');
//                rows[nextRow()].append($back);
//            }
        $color = $('<button class="color"></button>');
        hex = colors[name][5];
        $color.attr('data-name', name);
        $color.attr('data-hex', hex);
        $color.css('background-color', hex);
        rows[nextRow()].append($color);
    }
//        $blackout = $('<div class="blackout"></div>');
//        $widget.append($blackout);
//        $widget.find('.blackout').click(function(e) {
//            e.stopPropagation();
//            return cancelColor();
//        });
    $widget.find('.back').click(function(e) {
        return e.stopPropagation();
    });
    return $widget.find('.color').click(function(e) {
        var $active;
        e.stopPropagation();
        $active = $(e.currentTarget);

        var value = $active.css("backgroundColor");
        var g = value.split(",")[1];
        var r = value.split(",")[0];
        r = r.split("(")[1];
        var b = value.split(",")[2];
        b = b.split(")")[0];
        console.log(r,g,b)
        var hexColor =  componentToHex(r, b, g);
        console.log(hexColor)
        var txtArea =  document.getElementById('coloredvalue');
        txtArea.value =  hexColor;
        localStorage.setItem("chartColor",  hexColor);
        if ($active.hasClass('active')) {
            return cancelColor();
        } else {
            return activateColor($active);
        }
    });
};
function componentToHex(red, blue, green) {
    var rgb = blue | (green << 8) | (red << 16);
    return '#' + (0x1000000 + rgb).toString(16).slice(1)
}

colors = {
    Red: ['#fde0dc', '#f9bdbb', '#f69988', '#f36c60', '#e84e40', '#e51c23', '#dd191d', '#d01716', '#c41411', '#b0120a', '#ff7997', '#ff5177', '#ff2d6f', '#e00032'],
    Pink: ['#fce4ec', '#f8bbd0', '#f48fb1', '#f06292', '#ec407a', '#e91e63', '#d81b60', '#c2185b', '#ad1457', '#880e4f', '#ff80ab', '#ff4081', '#f50057', '#c51162'],
    Purple: ['#f3e5f5', '#e1bee7', '#ce93d8', '#ba68c8', '#ab47bc', '#9c27b0', '#8e24aa', '#7b1fa2', '#6a1b9a', '#4a148c', '#ea80fc', '#e040fb', '#d500f9', '#aa00ff'],
    'Deep Purple': ['#ede7f6', '#d1c4e9', '#b39ddb', '#9575cd', '#7e57c2', '#673ab7', '#5e35b1', '#512da8', '#4527a0', '#311b92', '#b388ff', '#7c4dff', '#651fff', '#6200ea'],
    Indigo: ['#e8eaf6', '#c5cae9', '#9fa8da', '#7986cb', '#5c6bc0', '#3f51b5', '#3949ab', '#303f9f', '#283593', '#1a237e', '#8c9eff', '#536dfe', '#3d5afe', '#304ffe'],
    Blue: ['#e7e9fd', '#d0d9ff', '#afbfff', '#91a7ff', '#738ffe', '#5677fc', '#4e6cef', '#455ede', '#3b50ce', '#2a36b1', '#a6baff', '#6889ff', '#4d73ff', '#4d69ff'],
    'Light Blue': ['#e1f5fe', '#b3e5fc', '#81d4fa', '#4fc3f7', '#29b6f6', '#03a9f4', '#039be5', '#0288d1', '#0277bd', '#01579b', '#80d8ff', '#40c4ff', '#00b0ff', '#0091ea'],
    Cyan: ['#e0f7fa', '#b2ebf2', '#80deea', '#4dd0e1', '#26c6da', '#00bcd4', '#00acc1', '#0097a7', '#00838f', '#006064', '#84ffff', '#18ffff', '#00e5ff', '#00b8d4'],
    Teal: ['#e0f2f1', '#b2dfdb', '#80cbc4', '#4db6ac', '#26a69a', '#009688', '#00897b', '#00796b', '#00695c', '#004d40', '#a7ffeb', '#64ffda', '#1de9b6', '#00bfa5'],
    Green: ['#d0f8ce', '#a3e9a4', '#72d572', '#42bd41', '#2baf2b', '#259b24', '#0a8f08', '#0a7e07', '#056f00', '#0d5302', '#a2f78d', '#5af158', '#14e715', '#12c700'],
    'Light Green': ['#f1f8e9', '#dcedc8', '#c5e1a5', '#aed581', '#9ccc65', '#8bc34a', '#7cb342', '#689f38', '#558b2f', '#33691e', '#ccff90', '#b2ff59', '#76ff03', '#64dd17'],
    Lime: ['#f9fbe7', '#f0f4c3', '#e6ee9c', '#dce775', '#d4e157', '#cddc39', '#c0ca33', '#afb42b', '#9e9d24', '#827717', '#f4ff81', '#eeff41', '#c6ff00', '#aeea00'],
    Yellow: ['#fffde7', '#fff9c4', '#fff59d', '#fff176', '#ffee58', '#ffeb3b', '#fdd835', '#fbc02d', '#f9a825', '#f57f17', '#ffff8d', '#ffff00', '#ffea00', '#ffd600'],
    Amber: ['#fff8e1', '#ffecb3', '#ffe082', '#ffd54f', '#ffca28', '#ffc107', '#ffb300', '#ffa000', '#ff8f00', '#ff6f00', '#ffe57f', '#ffd740', '#ffc400', '#ffab00'],
    Orange: ['#fff3e0', '#ffe0b2', '#ffcc80', '#ffb74d', '#ffa726', '#ff9800', '#fb8c00', '#f57c00', '#ef6c00', '#e65100', '#ffd180', '#ffab40', '#ff9100', '#ff6d00'],
    'Deep Orange': ['#fbe9e7', '#ffccbc', '#ffab91', '#ff8a65', '#ff7043', '#ff5722', '#f4511e', '#e64a19', '#d84315', '#bf360c', '#ff9e80', '#ff6e40', '#ff3d00', '#dd2c00'],
    Brown: ['#efebe9', '#d7ccc8', '#bcaaa4', '#a1887f', '#8d6e63', '#795548', '#6d4c41', '#5d4037', '#4e342e', '#3e2723'],
    'Blue Grey': ['#eceff1', '#cfd8dc', '#b0bec5', '#90a4ae', '#78909c', '#607d8b', '#546e7a', '#455a64', '#37474f', '#263238'],
    Grey: ['#fafafa', '#f5f5f5', '#eeeeee', '#e0e0e0', '#bdbdbd', '#9e9e9e', '#757575', '#616161', '#424242', '#212121', '#000000', '#ffffff']
};

function colorPick(e)
{
    var pickedColor = e.target.getAttribute('data-hex');
//alert(pickedColor);

    document.getElementById('coloredvalue').value = pickedColor;
    localStorage.setItem("chartColor", pickedColor);

    return cancelColor();
}

$(function() {
    return buildWidget();
});
