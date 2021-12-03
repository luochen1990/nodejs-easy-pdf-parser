const PdfParser = require("pdf2json/pdfparser"); // doc: https://github.com/modesty/pdf2json

// parsePdf :: (FilePath | Buffer) -> Promise ParsedPdfData
const parsePdf = pdfDesc => {
  const pdfParser = new PdfParser();
  if (typeof pdfDesc === 'string') { // is FilePath
    pdfParser.loadPDF(pdfDesc);
  } else { // is Buffer
    pdfParser.parseBuffer(pdfDesc);
  }
  return new Promise((resolve, reject) => {
    pdfParser.on("pdfParser_dataError", reject);
    return pdfParser.on("pdfParser_dataReady", resolve);
  });
};

// extractText :: ParsedPdfData -> [ {page :: Int, rows :: [ [ String ] ]} ]
const extractText = pdfData => {
  //console.log pdfData
  let pageNumber = 0;
  const txtPages = [];
  for (let page of pdfData.formImage.Pages) {
    //console.log page

    var rowMp = {};
    for (let item of page.Texts) {
      item.text = decodeURIComponent(item.R[0].T);
      //console.log item
      (rowMp[item.y] != null ? rowMp[item.y] : (rowMp[item.y] = [])).push(item.text);
    }
    const sortedRows = Object.keys(rowMp).sort((y1, y2) => parseFloat(y1) - parseFloat(y2)).map(y => (rowMp[y] || []));

    txtPages.push({
      page: ++pageNumber,
      rows: sortedRows
    });
  }
  return txtPages;
};

// extractPlainText :: ParsedPdfData -> String
const extractPlainText = pdfData => {
  const txtPages = extractText(pdfData);
  let txt = '';
  for (let page of txtPages) {
    txt += `\n----- page ${page.page} -----\n\n`;
    for (let row of page.rows) {
      txt += row.join(' ') + '\n';
    }
  }
  return txt;
};

module.exports = {parsePdf, extractText, extractPlainText};

if (module.parent === null) {
  parsePdf('test.pdf').then(extractPlainText).then(data => {
    return console.log(data);
  });
}

