"use strict";
const campoMeta = document.getElementById('meta');
const campoDeposito = document.getElementById('deposito');
const campoTaxa = document.getElementById('taxa');
const botao = document.getElementById('calcular');
const saida = document.getElementById('resultado');
const formatarReal = (valor) => `R$ ${valor.toFixed(2)}`;
function formatarMeses(meses) {
    const anos = Math.floor(meses / 12);
    const restoMeses = meses % 12;
    const partes = [];
    if (anos > 0) {
        partes.push(`${anos} ${anos === 1 ? 'ano' : 'anos'}`);
    }
    if (restoMeses > 0) {
        partes.push(`${restoMeses} ${restoMeses === 1 ? 'mês' : 'meses'}`);
    }
    return partes.length > 0 ? partes.join(' e ') : '0 meses';
}
function calcularMeses(meta, deposito, taxa = 0.5) {
    let saldo = 0;
    let depositado = 0;
    let meses = 0;
    while (saldo < meta) {
        if (meses >= 600) {
            break;
        }
        saldo = saldo * (1 + taxa / 100);
        const valorDeposito = meses > 0 && (meses + 1) % 12 === 0
            ? deposito * 2
            : deposito;
        saldo += valorDeposito;
        depositado += valorDeposito;
        meses++;
    }
    return { meses, saldo, depositado };
}
function exibirValor(rotulo, valor, formatar) {
    return `${rotulo}: ${formatar(valor)}`;
}
botao.addEventListener('click', () => {
    const meta = campoMeta.valueAsNumber;
    const deposito = campoDeposito.valueAsNumber;
    const taxaInformada = campoTaxa.value.trim() !== '';
    const taxa = campoTaxa.valueAsNumber;
    if (!Number.isFinite(meta) || !Number.isFinite(deposito) ||
        meta <= 0 || deposito <= 0 ||
        (taxaInformada && (!Number.isFinite(taxa) || taxa < 0))) {
        saida.textContent = 'Informe valores positivos';
        saida.className = 'erro';
        return;
    }
    const resultado = taxaInformada
        ? calcularMeses(meta, deposito, taxa)
        : calcularMeses(meta, deposito);
    const rendimento = resultado.saldo - resultado.depositado;
    if (resultado.saldo >= meta) {
        saida.textContent =
            `Você atinge a meta em ${resultado.meses} meses (${formatarMeses(resultado.meses)}).\n` +
                exibirValor('Saldo final', resultado.saldo, formatarReal) + '\n' +
                exibirValor('Total depositado', resultado.depositado, formatarReal) + '\n' +
                exibirValor('Rendimento', rendimento, formatarReal);
        saida.className = 'sucesso';
    }
    else {
        saida.textContent =
            `Meta inalcançável em 50 anos.\nSaldo após 600 meses: ${formatarReal(resultado.saldo)}`;
        saida.className = 'erro';
    }
});