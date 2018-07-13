PdfParser = require("pdf2json/pdfparser") # doc: https://github.com/modesty/pdf2json

# parsePdf :: (FilePath | Buffer) -> Promise ParsedPdfData
parsePdf = (pdfDesc) =>
  pdfParser = new PdfParser()
  if typeof pdfDesc is 'string' # is FilePath
    pdfParser.loadPDF(pdfDesc)
  else # is Buffer
    pdfParser.parseBuffer(pdfDesc)
  return new Promise (resolve, reject) =>
    pdfParser.on "pdfParser_dataError", reject
    pdfParser.on "pdfParser_dataReady", resolve

# extractText :: ParsedPdfData -> [ {page :: Int, rows :: [ [ String ] ]} ]
extractText = (pdfData) =>
  #console.log pdfData
  pageNumber = 0
  txtPages = []
  for page in pdfData.formImage.Pages
    #console.log page

    rowMp = {}
    for item in page.Texts
      item.text = decodeURIComponent(item.R[0].T)
      #console.log item
      (rowMp[item.y] ?= []).push(item.text)
    sortedRows = Object.keys(rowMp).sort((y1, y2) => parseFloat(y1) - parseFloat(y2)).map((y) => (rowMp[y] || []))

    txtPages.push {
      page: ++pageNumber
      rows: sortedRows
    }
  return txtPages

# extractPlainText :: ParsedPdfData -> String
extractPlainText = (pdfData) =>
  txtPages = extractText(pdfData)
  txt = ''
  for page in txtPages
    txt += "\n----- page #{page.page} -----\n\n"
    for row in page.rows
      txt += row.join(' ') + '\n'
  return txt

module.exports = {parsePdf, extractText, extractPlainText}

if module.parent is null
  parsePdf('test.pdf').then(extractPlainText).then (data) =>
    console.log data

