// Gera um código de auto de infração único (ex: MS1DV999123)
export function gerarAutoInfracao() {
  const timestamp = Date.now().toString().slice(-3);
  const random = Math.floor(Math.random() * 900 + 100);
  return `CYDEV${timestamp}${random}`;
}

// Gera uma placa aleatória padrão brasileira (ex: ABC1D23)
export function gerarPlaca() {
  const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const digitos = '0123456789';
  const aleatorio = (conjunto, tamanho) =>
    Array.from({ length: tamanho }, () =>
      conjunto.charAt(Math.floor(Math.random() * conjunto.length))
    ).join('');
  return `${aleatorio(letras, 3)}${aleatorio(digitos, 1)}${aleatorio(letras, 1)}${aleatorio(digitos, 2)}`;
}

// Gera uma data atual no formato DD/MM/AAAA
export function dataHoje() {
  const hoje = new Date();
  const dia = String(hoje.getDate()).padStart(2, '0');
  const mes = String(hoje.getMonth() + 1).padStart(2, '0');
  const ano = hoje.getFullYear();
  return `${dia}/${mes}/${ano}`;
}

export function dataOntem() {
  const ontem = new Date();
  ontem.setDate(ontem.getDate() - 1);
  const dia = String(ontem.getDate()).padStart(2, '0');
  const mes = String(ontem.getMonth() + 1).padStart(2, '0');
  const ano = ontem.getFullYear();
  return `${dia}/${mes}/${ano}`;
}
