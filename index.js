const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();


const app = express();
const PORT = process.env.PORT || 3000; // Porta do servidor

// Permitir requisições de qualquer origem
app.use(cors());
app.use(bodyParser.json());

// Endpoint para calcular o frete
app.post('/calculate-shipping', async (req, res) => {
  const { cepDestino, productWeight, productHeight, productWidth, productLength } = req.body;

  if (!cepDestino || cepDestino.length !== 8) {
    return res.status(400).json({ error: 'CEP inválido' });
  }

  const apiUrl = 'https://www.melhorenvio.com.br/api/v2/me/shipment/calculate';
  const token = process.env.API_KEY;


  const requestBody = {
    from: { postal_code: '30130060' }, // CEP da loja
    to: { postal_code: cepDestino },
    package: [
      {
        weight: productWeight,
        height: productHeight,
        width: productWidth,
        length: productLength,
      },
    ],
  };

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      return res.status(500).json({ error: 'Erro ao calcular frete' });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro no servidor' });
  }
});

// Inicializa o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
