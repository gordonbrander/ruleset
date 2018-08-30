// Tools for parsing style-attribute-like strings.
//
// The MIT License
//
// Copyright (c) 2018 Gordon Brander
//
// Permission is hereby granted, free of charge, 
// to any person obtaining a copy of this software and 
// associated documentation files (the "Software"), to 
// deal in the Software without restriction, including 
// without limitation the rights to use, copy, modify, 
// merge, publish, distribute, sublicense, and/or sell 
// copies of the Software, and to permit persons to whom 
// the Software is furnished to do so, 
// subject to the following conditions:
//
// The above copyright notice and this permission notice 
// shall be included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, 
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES 
// OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. 
// IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR 
// ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, 
// TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE 
// SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

const notEmpty = x => x !== '';
const trim = s => s.trim();

const fromEntries = entries => {
  const object = {}
  for (let [key, value] of entries) {
    object[key] = value;
  }
  return object
}

export const parseRule = rule => {
  const [key, value] = rule.split(':').map(trim);
  return [key, value];
}

export const parseRuleset= ruleset => fromEntries(
  ruleset
    .split(';')
    .filter(notEmpty)
    .map(parseRule)
);

export const throughSchema = (schema, raw) => {
  const parsed = {};
  for (let [key, parser] of Object.entries(schema)) {
    parsed[key] = parser(raw[key]);
  }
  return parsed;
}

export const Schema = schema => ruleset =>
  throughSchema(schema, parseRuleset(ruleset));

export const number = x => parseFloat(x, 10);

export const deg = x => parseFloat(x.replace('deg', ''), 10) % 360;

export const percent = x => parseFloat(x.replace('%', ''), 10);

export const string = (x='') => x + '';

export const selector = (x='*') => x + '';

export const bool = x => !!x;

const find = (s, regexp, flags) => {
  const match = s.match(regexp, flags);
  return match != null ? match[0] : null;
}

export const optional = (coerce, fallback) => (value=fallback) => coerce(value);

export const listOf = (coerce, sep=',') => x => {
  const s = x + '';
  return s.split(sep).map(trim).filter(notEmpty).map(coerce);
}

export const cssUnit = x => {
  const s = x + '';
  const raw = find(s, /^[0-9\.]+/);
  const unit = find(s, /[a-zA-Z%]+$/, 'm');
  if (raw == null) {
    return {
      value: null,
      unit: 'undefined'
    };
  } else if (unit == null) {
    return {
      value: parseFloat(raw, 10),
      unit: 'none'
    };
  } else {
    return {
      value: parseFloat(raw, 10),
      unit
    };
  }
}

export const cssUnitList = listOf(cssUnit, ' ');

// Extrapolate a space-separated list of 1 to 3 CSS units.
// Returns an array of 3 cssValues.
export const cssUnit3 = x => {
  const units = cssUnitList(x);
  if (units.length == 1) {
    const [a] = units;
    return [a, a, a];
  } else if (units.length == 2) {
    const [a, b] = units;
    return [a, b, b];
  } else if (units.length == 3) {
    const [a, b, c] = units;
    return [a, b, c];
  }
}

// Extrapolate a space-separated list of up to 4 CSS units.
// Uses typical CSS unit extrapolation rules
// (e.g. same behavior as `padding: 1px;`).
// Returns an array of 4 cssValues.
export const cssUnit4 = x => {
  const units = cssUnitList(x);
  if (units.length == 1) {
    const [a] = units;
    return [a, a, a, a];
  } else if (units.length == 2) {
    const [a, b] = units;
    return [a, a, b, b];
  } else if (units.length == 3) {
    const [a, b, c] = units;
    return [a, b, b, c];
  } else if (units.length > 3) {
    const [a, b, c, d] = units;
    return [a, b, c, d];
  }
}
