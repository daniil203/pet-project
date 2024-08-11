const express = require('express');
const bodyParser = require('body-parser');
const pdfMake = require('pdfmake/build/pdfmake');
const pdfFonts = require('pdfmake/build/vfs_fonts');
const path = require('path');

const app = express();
app.use(bodyParser.json());

// Добавление middleware для обработки CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

// Установите пути к шрифтам
pdfMake.vfs = pdfFonts.pdfMake.vfs;
pdfMake.fonts = {
  Roboto: {
    normal: path.join(__dirname, 'Roboto-Medium.ttf'),
    bold: path.join(__dirname, 'Roboto-Medium.ttf'),
    italics: path.join(__dirname, 'Roboto-Medium.ttf'),
    bolditalics: path.join(__dirname, 'Roboto-Medium.ttf'),
  }
};

let docDefinition = {}; // Инициализируем docDefinition

app.post('/generate-pdf', (req, res) => {
  const { content } = req.body;
  console.log('Received content:', content);

  docDefinition = { // Обновляем docDefinition
    content: [
      { text: content, style: 'header' },
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        margin: [0, 0, 0, 10]
      }
    }
  };

  try {
    const pdfDoc = pdfMake.createPdf(docDefinition);
    pdfDoc.getBuffer((buffer) => {
      console.log('Generated PDF data:', buffer);

      res.writeHead(200, {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment;filename="document.pdf"'
      });

      res.end(buffer);
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).send('Error generating PDF');
  }
});

app.get('/generate-pdf', (req, res) => {
  try {
    const pdfDoc = pdfMake.createPdf(docDefinition);
    pdfDoc.getBuffer((buffer) => {
      res.writeHead(200, {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment;filename="document.pdf"'
      });
      res.end(buffer);
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).send('Error generating PDF');
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get('/initial-data', (req, res) => {
  res.json({ message: 'Initial data' });
});