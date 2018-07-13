Easy PDF Parser
===============

a lightweight, promise style, functional wrapper of [pdf2json](https://github.com/modesty/pdf2json).

Command Line Tool
-----------------

```
npm install -g easy-pdf-parser
pdf2text test.pdf > test.txt
```

Usage Demo
----------

install:

```
npm install easy-pdf-parser
```

extract plain text from pdf easily:

```
{parsePdf, extractPlainText} = require('easy-pdf-parser')

parsePdf('./test.pdf').then(extractPlainText).then(data => {
  console.log(data);
});
```

extract simply structured text from pdf:

```
{parsePdf, extractText} = require('easy-pdf-parser')

parsePdf('./test.pdf').then(extractText).then(data => {
  console.log(JSON.stringify(data, '', 2));
});
```

get a full structured parsing result:

```
{parsePdf} = require('easy-pdf-parser')

parsePdf('./test.pdf').then(data => {
  console.log(JSON.stringify(data, '', 2));
});
```

More doc about the structure of the parsed result can be found [here](https://github.com/modesty/pdf2json#output-format-reference)

