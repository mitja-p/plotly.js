/**
* Copyright 2012-2019, Plotly, Inc.
* All rights reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/


'use strict';

var d3 = require('d3');

var Registry = require('../../registry');

var Drawing = require('../../components/drawing');
var Axes = require('../../plots/cartesian/axes');
var appendArrayPointValue = require('../../components/fx/helpers').appendArrayPointValue;

function style(gd) {
    var s = d3.select(gd).selectAll('g.trace.scatter');

    s.style('opacity', function(d) {
        return d[0].trace.opacity;
    });

    s.selectAll('g.points').each(function(d) {
        var sel = d3.select(this);
        var trace = d.trace || d[0].trace;
        stylePoints(sel, trace, gd);
    });

    s.selectAll('g.text').each(function(d) {
        var sel = d3.select(this);
        var trace = d.trace || d[0].trace;
        styleText(sel, trace, gd);
    });

    s.selectAll('g.trace path.js-line')
        .call(Drawing.lineGroupStyle);

    s.selectAll('g.trace path.js-fill')
        .call(Drawing.fillGroupStyle);

    Registry.getComponentMethod('errorbars', 'style')(s);
}

function stylePoints(sel, trace, gd) {
    Drawing.pointStyle(sel.selectAll('path.point'), trace, gd);
}

function styleText(sel, trace, gd) {
    var s = sel.selectAll('text');

    if(trace.texttemplate) {
        var xa = Axes.getFromTrace(gd, trace, 'x');
        var ya = Axes.getFromTrace(gd, trace, 'y');

        s.each(function(d) {
            var pointValues = {};
            appendArrayPointValue(pointValues, trace, d.i);

            var labels = {};
            if('x' in pointValues) labels.xLabel = Axes.tickText(xa, d.x, true).text;
            if('y' in pointValues) labels.yLabel = Axes.tickText(ya, d.y, true).text;

            // TODO
            // - rLabel, thetaLabel for scatterpolar
            // - yLabel for scattercarpet
            // - aLabel, bLabel, cLabel for scatterternary
            // - lonLabel, latLabel for scattergeo
            //
            // maybe we should define _{}Formatter functions on the full trace
            // object so that we can reuse them for texttemplate, hover and
            // hovertemplate formatting ??
            //
            // 2

            d._pointValues = pointValues;
            d._labels = labels;
        });
    }

    Drawing.textPointStyle(s, trace, gd);
}

function styleOnSelect(gd, cd, sel) {
    var trace = cd[0].trace;

    if(trace.selectedpoints) {
        Drawing.selectedPointStyle(sel.selectAll('path.point'), trace);
        Drawing.selectedTextStyle(sel.selectAll('text'), trace);
    } else {
        stylePoints(sel, trace, gd);
        styleText(sel, trace, gd);
    }
}

module.exports = {
    style: style,
    stylePoints: stylePoints,
    styleText: styleText,
    styleOnSelect: styleOnSelect
};
