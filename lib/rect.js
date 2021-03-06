'use strict';

import 'snapsvg';
/* globals Snap, mina */
import $ from 'jquery';
import _ from 'lodash';
import rect_tmp_la from './rect_tmp_la.html!text';
import rect_tmp_center from './rect_tmp.html!text';
import rect_bar_tmp from './rect_bar_tmp.html!text';
import 'lato-font/css/lato-font.min.css!';
import AbstractGauge from './abstract';

let snapTemplateLa = new Snap($(rect_tmp_la)[0]);
let snapTemplateCenter = new Snap($(rect_tmp_center)[0]);
let snapTemplateBar=new Snap($(rect_bar_tmp)[0]);

let templateToSnap = {
  'center': () => snapTemplateCenter.clone(),
  'left-align': () => snapTemplateLa.clone(),
  'bar':()=>new Snap($(rect_bar_tmp)[0])
};

export class RectGauge extends AbstractGauge {

  constructor(selection, config = null) {
    config = config || {};
    _.defaults(config, {
      template: 'center',
      valueHeight: '200'
    });
    super(selection, config);
  }

  _genSnap() {
    return (templateToSnap[this.config.template])();
  }

  _animateSetter(v) {
    this._valueElem.attr("text", this.config.valueMapper(v));

    let color = null;
    if (this.config.colorMapper) {
      color = this.config.colorMapper(v);
    }
    color = color || this.config.color;
    this._valueGeomElem.attr("fill", color);

    let min = this.config.min,
      max = this.config.max;
    let t = (v - min) / (max - min);
    if (t < 0) {
      t = 0;
    } else if (t > 1) {
      t = 1;
    }

    this._valueGeomElem.attr("y", 200 * (1 - t));
    this._valueGeomElem.attr("height", this.config.valueHeight);
    this._valueElem.attr("text", this.config.valueMapper(v));
    this._adjustUnit();
  }

  _adjustUnit() {
    if (this.config.template !== 'left-align') {
      super._adjustUnit();
      return;
    }
    var vb = this._valueElem.getBBox();
    this._unitElem.transform("t" + vb.w + " 0");
  }

}

export default RectGauge;
