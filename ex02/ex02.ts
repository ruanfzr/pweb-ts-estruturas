
type TipoCliente = 'residencial' | 'rural' | 'comercial' | 'industrial';
type Bandeira = 'verde' | 'amarela' | 'vermelha1' | 'vermelha2';

const campoConsumo = document.getElementById('consumo') as HTMLInputElement;
const campoTipo = document.getElementById('tipo') as HTMLSelectElement;
const campoBandeira = document.getElementById('bandeira') as HTMLSelectElement;
const botao = document.getElementById('calcular') as HTMLButtonElement;
const saida = document.getElementById('resultado') as HTMLElement;

function tarifaPorKwh(tipo: TipoCliente): number {
  switch (tipo) {
    case 'residencial':
    case 'rural':
      return 0.80;

    case 'comercial':
    case 'industrial':
      return 0.95;
  }

  return 0;
}

function adicionalBandeira(
  consumo: number,
  bandeira: Bandeira = 'verde'
): number {
  switch (bandeira) {
    case 'verde':
      return 0;

    case 'amarela':
      return consumo * 0.02;

    case 'vermelha1':
      return consumo * 0.04;

    case 'vermelha2':
      return consumo * 0.08;
  }

  return 0;
}

function mensagemBandeira(bandeira: Bandeira): string {
  switch (bandeira) {
    case 'verde':
      return 'Condições favoráveis de geração de energia.';

    case 'amarela':
      return 'Condições de geração menos favoráveis.';

    case 'vermelha1':
    case 'vermelha2':
      return 'Condições mais caras de geração. Economize!';
  }

  return 'Bandeira não reconhecida.';
}

console.log(adicionalBandeira(100));

botao.addEventListener('click', () => {
  const consumo = campoConsumo.valueAsNumber;
  const tipo = campoTipo.value as TipoCliente;
  const bandeira = campoBandeira.value as Bandeira;

  if (!Number.isFinite(consumo) || consumo <= 0) {
    saida.textContent = 'Informe um consumo válido.';
    saida.className = 'erro';
    return;
  }

  const energia = consumo * tarifaPorKwh(tipo);
  const adicional = adicionalBandeira(consumo, bandeira);
  const total = energia + adicional;

  const nomesBandeiras: Record<Bandeira, string> = {
    verde: 'Verde',
    amarela: 'Amarela',
    vermelha1: 'Vermelha (patamar 1)',
    vermelha2: 'Vermelha (patamar 2)'
  };

  saida.textContent =
    `Consumo: ${consumo} kWh\n` +
    `Tipo de cliente: ${tipo}\n` +
    `Tarifa de energia: R$ ${energia.toFixed(2)}\n` +
    `Bandeira ${nomesBandeiras[bandeira]}: R$ ${adicional.toFixed(2)}\n` +
    `Total estimado: R$ ${total.toFixed(2)}\n` +
    mensagemBandeira(bandeira);

  saida.className = bandeira === 'verde' ? 'sucesso' : 'alerta';
});
