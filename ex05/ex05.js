"use strict";
const campoItens = document.getElementById('itens');
const campoCupom = document.getElementById('cupom');
const campoFidelidade = document.getElementById('fidelidade');
const botao = document.getElementById('fechar');
const saida = document.getElementById('resultado');
function lerPrecos(texto) {
    const linhas = texto.split('\n');
    const precos = [];
    let ignorados = 0;
    for (const linha of linhas) {
        const limpa = linha.trim();
        if (limpa === '') {
            continue;
        }
        const normalizada = limpa.replace(',', '.');
        const valor = Number(normalizada);
        if (!Number.isFinite(valor) || valor <= 0) {
            ignorados++;
            continue;
        }
        if (precos.length >= 20) {
            break;
        }
        precos.push(valor);
    }
    return { precos, ignorados };
}
function somarItens(...precos) {
    return precos.reduce((soma, preco) => soma + preco, 0);
}
function calcularDesconto(total, desconto) {
    if (typeof desconto === 'number') {
        return total * desconto / 100;
    }
    switch (desconto.toUpperCase()) {
        case 'BEMVINDO':
            return total * 0.10;
        case 'PROMO20':
            return total * 0.20;
        case 'MENOS15':
            return total >= 100 ? 15 : 0;
        default:
            return 0;
    }
}
const formatarReal = (valor) => `R$ ${valor.toFixed(2)}`;
botao.addEventListener('click', () => {
    const leitura = lerPrecos(campoItens.value);
    const precos = leitura.precos;
    const cupom = campoCupom.value.trim();
    const fidelidade = campoFidelidade.checked;
    if (precos.length === 0) {
        saida.textContent = 'Nenhum item válido';
        saida.className = 'erro';
        return;
    }
    const subtotal = somarItens(...precos);
    let descontoCupom = 0;
    let mensagemCupom = '';
    if (cupom !== '') {
        const calculado = calcularDesconto(subtotal, cupom);
        const codigo = cupom.toUpperCase();
        const cupomConhecido = codigo === 'BEMVINDO' || codigo === 'PROMO20' ||
            (codigo === 'MENOS15' && subtotal >= 100);
        if (cupomConhecido) {
            descontoCupom = calculado;
            mensagemCupom = `Cupom ${codigo}: - ${formatarReal(descontoCupom)}`;
        }
        else {
            mensagemCupom = 'Cupom inválido ou não aplicável.';
        }
    }
    const aposCupom = subtotal - descontoCupom;
    const descontoFidelidade = fidelidade ? calcularDesconto(aposCupom, 5) : 0;
    const total = aposCupom - descontoFidelidade;
    const linhasIgnoradas = leitura.ignorados > 0
        ? ` (${leitura.ignorados} ${leitura.ignorados === 1 ? 'linha ignorada' : 'linhas ignoradas'})`
        : '';
    const linhas = [
        `Itens: ${precos.length}${linhasIgnoradas}`,
        `Subtotal: ${formatarReal(subtotal)}`
    ];
    if (cupom !== '') {
        linhas.push(mensagemCupom);
    }
    if (fidelidade) {
        linhas.push(`Fidelidade (5%): - ${formatarReal(descontoFidelidade)}`);
    }
    linhas.push(`Total a pagar: ${formatarReal(total)}`);
    saida.textContent = linhas.join('\n');
    saida.className = 'sucesso';
});

