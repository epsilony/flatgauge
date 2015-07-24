'use strict';

import {
  colorMappers as _colorMappers
}
from './color-mappers';
import {
  valueMappers as _valueMappers
}
from './value-mappers';

export var colorMappers = _colorMappers;
export var valueMappers = _valueMappers;

import {
  RoundGauge as _RoundGauge
}

from './round';

export var RoundGauge = _RoundGauge;

import {
  RectGauge as _RectGauge
}

from './rect';

export var RectGauge = _RectGauge;


var _gaugeTypeToClass = {
  round: RoundGauge,
  rect: RectGauge
};

export function flatGauge(selection, type = "round", config = {}) {
  var Creator = _gaugeTypeToClass[type];
  return new Creator(selection, config);
}

export default flatGauge;
