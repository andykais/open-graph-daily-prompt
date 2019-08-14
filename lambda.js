const fetch = require('node-fetch')
const csv = require('csv-parse')
// const GoogleSpreadsheet = require('google-spreadsheet')

// const url =
//   'https://docs.google.com/spreadsheets/d/e/2PACX-1vRw0udarKlnFbEp_TjB2a-n1M-u0s6yBdUiDWc3X5HJJ8HYyx0wB7zcS2O9d5dUaniuGE7kKV4GuUQL/pub?gid=0&single=true&output=csv'
// const spreadsheetKey = '2PACX-1vRw0udarKlnFbEp_TjB2a-n1M-u0s6yBdUiDWc3X5HJJ8HYyx0wB7zcS2O9d5dUaniuGE7kKV4GuUQL'
// const spreadsheetKey = '1oFWCQfk7hCbS6orP9WKx5N9sTjQOIaytBrIUFUIda8A'
// const doc = new GoogleSpreadsheet(spreadsheetKey)

// doc.getInfo((err, data) => {
//   console.log('got info')
//   // console.log(data)
// })

// doc.getRows(1, {}, (err, data) => {
//   if (err) console.log({ err })
//   console.log('got rows')
//   console.log(data)
// })

const url =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vRw0udarKlnFbEp_TjB2a-n1M-u0s6yBdUiDWc3X5HJJ8HYyx0wB7zcS2O9d5dUaniuGE7kKV4GuUQL/pub?gid=0&single=true&output=csv'

const data = {
  adjectives: [],
  subjectNouns: [],
  conjunctions: [],
  wildcardNouns: []
}

const run = async () => {
  const response = await fetch(url)
  const result = await new Promise((resolve, reject) => {
    let firstRow = true
    const result = []
    response.body
      .pipe(csv())
      .on('data', ([adjective, subjectNoun, conjunction, wildcardNoun]) => {
        if (firstRow) {
          firstRow = false
          return
        }
        if (adjective) data.adjectives.push(adjective)
        if (subjectNoun) data.subjectNouns.push(subjectNoun)
        if (conjunction) data.conjunctions.push(conjunction)
        if (wildcardNoun) data.wildcardNouns.push(wildcardNoun)
      })
      // .on('data', ([]) => {
      // })
      .on('error', reject)
      .on('end', () => resolve(result))
  })
  console.log(data)
  return result
}
run()

const makeHtml = (sentence, result) => `
<html>
  <head>
    <meta property="og:title" content="Promptly">
    <meta property="og:url" content="https://nodejs.andykais.now.sh/" />
    <meta property="og:description" content="I DECREE YOU SHOULD DRAW: ${sentence}">
  </head>
  <body>${JSON.stringify(result)}</body>
</html>
`

module.exports = async (req, res) => {
  const result = await run()
  const html = makeHtml('butts', result)
  res.send(html)
}
