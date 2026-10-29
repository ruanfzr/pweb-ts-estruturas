"use strict";
const campoPreco = document.getElementById('preco');
const campoEntrada = document.getElementById('entrada');
const botao = document.getElementById('simular');
const saida = document.getElementById('resultado');
const corpoTabela = document.getElementById('parcelas');
function calcularTotal(valor, parcelas) {
    return parcelas <= 3 ? valor : valor * (1.02 ** parcelas);
}
function simularParcelamento(preco, entrada) {
    const valorEntrada = typeof entrada !== 'undefined' ? entrada : 0;
    const financiado = preco - valorEntrada;
    let linhas = '';
    for (let parcelas = 1; parcelas <= 12; parcelas++) {
        if (parcelas === 7 || parcelas === 8 || parcelas === 9 || parcelas === 11) {
            continue;
        }
        const total = calcularTotal(financiado, parcelas);
        const valorParcela = total / parcelas;
        if (valorParcela < 50) {
            break;
        }
        const juros = parcelas <= 3 ? 'sem juros' : '2% a.m.';
        linhas += `<tr><td>${parcelas}x</td><td>R$ ${valorParcela.toFixed(2)}</td>` +
            `<td>R$ ${total.toFixed(2)}</td><td>${juros}</td></tr>`;
    }
    return linhas;
}
botao.addEventListener('click', () => {
    const preco = campoPreco.valueAsNumber;
    const entradaInformada = campoEntrada.value.trim() !== '';
    const entrada = campoEntrada.valueAsNumber;
    corpoTabela.innerHTML = '';
    if (!Number.isFinite(preco) || preco <= 0 ||
        (entradaInformada && (!Number.isFinite(entrada) || entrada < 0))) {
        saida.textContent = 'Informe um preço e uma entrada válidos.';
        saida.className = 'erro';
        return;
    }
    if (entradaInformada && entrada >= preco) {
        saida.textContent = 'A entrada cobre o valor total. Não há parcelas.';
        saida.className = 'alerta';
        return;
    }
    const financiado = preco - (entradaInformada ? entrada : 0);
    saida.textContent = `Valor financiado: R$ ${financiado.toFixed(2)}`;
    saida.className = 'sucesso';
    corpoTabela.innerHTML = entradaInformada
        ? simularParcelamento(preco, entrada)
        : simularParcelamento(preco);
});

