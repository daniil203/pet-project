import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Div, Textarea, Button } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

const PDFGenerator = () => {
  const [content, setContent] = useState('');

  axios.defaults.baseURL = 'http://localhost:3001'; // или URL вашего развернутого сервера

  useEffect(() => {
    const callBackendAPI = async () => {
      try {
        // Эта функция не используется, поэтому ее можно убрать
        // const response = await axios.get('/initial-data');
        // setPdfData(response.data);
        // console.log('Initial data received:', response.data);
      } catch (error) {
        console.error('Error fetching initial data:', error);
        alert('Error fetching initial data. Please try again later.');
      }
    };

    callBackendAPI();
  }, []);

  const generatePDF = async () => {
    try {
      const response = await axios.post('/generate-pdf', { content });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      window.open(url);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again later.');
    }
  };

  return (
    <div>
      <Div>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter the content for your PDF"
        />
      </Div>
      <Div>
        <Button size="l" onClick={generatePDF}>
          Generate PDF
        </Button>
      </Div>
    </div>
  );
};

export default PDFGenerator;