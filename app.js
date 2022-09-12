function normalize(text) {
  var separators = new Set([' ', '\n', '\t']);

  const start_text = '<p class=\"hyphenate \"';
  const end_text = '<!-- sonda -->';

  const start = text.search(start_text) < 0 ? text.length : text.search(start_text);
  const end = text.search(end_text) < 0 ? text.length : text.search(end_text);

  var result = ''
  var status = 0

  for (let i = start; i < end; i++) {
    switch(text[i]) {
      case '<':
        status = 1;
        break;
      case '>':
        status = 0;
        break;
      default:
        if (status == 0 && !(result.length > 0 && separators.has(result.slice(-1)) && separators.has(text[i]))) {
	  result += text[i];
        }
    }
  }
  return result.trim();
}

function readUrl(url, cb) {
  const https = require('node:https');
  const options = new URL(url);
  
  https.get(options, function(response) {
    var buffer = '';
    response.on('data', (chunk) => {
      buffer += chunk;
    }).on('end', () => {
      cb(null, buffer);
    }).setEncoding('utf8');
  });
}


const url = "https://wiadomosci.onet.pl/pogoda/pochmurny-weekend-imgw-ostrzega-przed-burzami/k2ktrxc";

readUrl(url, (err, result) => {
  if (err)
    return console.log(err);

  const app = require("express")();
  const PORT = process.env.PORT || 3000;

  app.get("", (req, res) => {
    res.send(normalize(result));
  });

  app.listen(PORT, () => {
    console.log(`App up at port ${PORT}`);
  });
});
