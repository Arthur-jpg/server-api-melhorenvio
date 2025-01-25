const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

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
  const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiYjQ4MTJjYmUzNjNhZWExMjE2Mjc3M2M5ZmJjYzlkYWE1MmZjNjhjMDg0MmQ3OTk1YzUxNzBiZDI2ZTZhMTE0YjE5ZTE4OGFkMjUyYjUxZGQiLCJpYXQiOjE3Mzc2ODkyNjUuNDQ5ODI3LCJuYmYiOjE3Mzc2ODkyNjUuNDQ5ODI4LCJleHAiOjE3NjkyMjUyNjUuNDM3ODc1LCJzdWIiOiI5OWRjMDRkZS04NGY3LTQ1YWItOTcwYi03ZTM4NTUyNjU3NzkiLCJzY29wZXMiOlsic2hpcHBpbmctY2FsY3VsYXRlIl19.obexJl9kjJ9swGAYZ6YiEdas9rUeljq222Apc2A4VlT-gQ0ofyzP_7PHhIXWyTInanTqN4PMxtOrcQgxTIhK2aeUQ6duims8P3rZxkQNspQ_uewBTID-vFvkKSZ6CGBcmhHFpKGDZkWAKGnFcP3zeYSAoNV7S_4K8c5PnhFuficS9VDVJJKGwhfEYACTNPN6DTqCh3jHTTiyMMze9V4eRm5hLNMPwgX5lSjXEdnQuENhxu74LZDcjg1vYWfu12-WgP0gZ-Jcs9Fnk_S4j7rWC6oRbb9lDZ0Z8iEaGTc7hzJ7rdOEhsYWm8pe94sAw3YZ-vAlfbzDbE6uiej6rfNOsqdY8qJEm3iMUHIAeG9ZbZEpR1zvUjg_GG9ulsIMJjUHa-GbfWXohF3ZgX5eTFgf387HaNjkqCIQ0Qged8GfSpjPxDb9J6iH6Ia7QeLM1duy05pU_8qQONOCYYyRYUVQ-ZEmtqfjFNG7Vy3PP5A4vi-EFFhL3PymUUEQoWfyE4i8pt1qlh8YHCJiBWn1e27HoFv26ZBIiy7eytRB66OAVH4-1Q-f4Mdcp_OHweB-Z3arvdR3O1pOvfqSZ3ffPMcyrEBPTYydHrVTGjrLfiSJSKYiF_7V_urWE6t5Yq-awOsG7DKskUy-ZWviHEU_RGx_9cIYmRQ0J_1bmzs-R4f7hy0'

  const requestBody = {
    from: { postal_code: '34006065' }, // CEP da loja
    to: { postal_code: cepDestino },
    products: [
      {
        weight: productWeight,
        height: productHeight,
        width: productWidth,
        length: productLength,
        quantity: 1,
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
