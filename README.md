# ruleset

parse CSS style strings

## Example

```js
import {Schema, string, bool, number, listOf, optional, cssUnit4} from './ruleset.js';

const parseNumberList = listOf(number);

parseNumberList('1, 2, 3');
// > [1, 2, 3]

const parseSchema = Schema({
  title: string,
  isHidden: optional(bool, false),
  numbers: listOf(number)
});

parseSchema("title: 8 Beautiful Notes; numbers: 1, 2, 3, 4, 5, 6, 7, 8");
// > {title: "8 Beautiful Notes", numbers: [1, 2, 3...], isHidden: false}

cssUnit4('10px 10%');
// > [{value: 10, unit: 'px'}, {value: 10, unit: 'px'}, {value: 10, unit: '%'}, {value: 10, unit: '%'}]
```
