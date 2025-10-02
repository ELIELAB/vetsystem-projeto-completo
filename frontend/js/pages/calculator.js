import { api } from '../services/apiService.js';

/**
 * Formata a dose dos comprimidos, encontrando a fração mais próxima.
 * @param {number | string} doseNumerica - A dose calculada.
 * @returns {string} - A dose formatada como texto.
 */
function formatarDoseComprimido(doseNumerica) {
    const dose = parseFloat(doseNumerica);
    if (dose >= 1) {
        return dose % 1 === 0 ? `${dose.toFixed(0)} comp.` : `${dose.toFixed(1)} comp.`;
    }
    const fracoes = [
        { valor: 0.25, texto: '1/4 de comp.' }, { valor: 0.33, texto: '1/3 de comp.' },
        { valor: 0.50, texto: '1/2 de comp.' }, { valor: 0.66, texto: '2/3 de comp.' },
        { valor: 0.75, texto: '3/4 de comp.' },
    ];
    let melhorFracao = null;
    let menorDiferenca = Infinity;
    for (const fracao of fracoes) {
        const diferenca = Math.abs(dose - fracao.valor);
        if (diferenca < menorDiferenca) {
            menorDiferenca = diferenca;
            melhorFracao = fracao;
        }
    }
    const TOLERANCIA_PERCENTUAL = 0.10;
    if (dose > 0 && melhorFracao && (menorDiferenca / dose) <= TOLERANCIA_PERCENTUAL) {
        return melhorFracao.texto;
    }
    return `${dose.toFixed(3)} comp.`;
}

document.addEventListener('DOMContentLoaded', () => {

    // --- LÓGICA DA ABA 1: CÁLCULO DE DOSES ---
    const doseForm = document.getElementById('dose-form');
    if (doseForm) {
        async function calcularDosePrincipal() {
            const peso = document.getElementById('peso').value;
            const dose = document.getElementById('dose').value;
            const concentracao = document.getElementById('concentracao').value;
            const resultadoLiquido = document.getElementById('resultado-liquido');
            const resultadoComprimido = document.getElementById('resultado-comprimido');
            if (!peso || !dose || !concentracao || parseFloat(concentracao) === 0) {
                resultadoLiquido.textContent = '-- ml';
                resultadoComprimido.textContent = '-- comp.';
                return;
            }
            try {
                const response = await api.calcularDose({ peso, dose, concentracao });
                resultadoLiquido.textContent = `${parseFloat(response.resultadoLiquido).toFixed(3)} ml`;
                resultadoComprimido.textContent = formatarDoseComprimido(response.resultadoComprimido);
            } catch (error) {
                console.error("Erro ao calcular dose:", error);
                resultadoLiquido.textContent = 'Erro';
                resultadoComprimido.textContent = 'Erro';
            }
        }
        doseForm.addEventListener('input', calcularDosePrincipal);
    }
    
    const percentualInput = document.getElementById('percentual-input');
    if(percentualInput) {
        async function converterPercentual() {
            const percentual = percentualInput.value;
            const percentualResultado = document.getElementById('percentual-resultado');
            if (!percentual) {
                percentualResultado.value = '-- mg/ml';
                return;
            }
            try {
                const response = await api.converterPercentual({ percentual });
                percentualResultado.value = `${parseFloat(response.mgPorMl).toFixed(2)} mg/ml`;
            } catch (error) {
                console.error("Erro ao converter percentual:", error);
                percentualResultado.value = 'Erro';
            }
        }
        percentualInput.addEventListener('input', converterPercentual);
    }

    const surfaceForm = document.getElementById('surface-form');
    if(surfaceForm) {
        async function calcularSuperficie() {
            const peso = document.getElementById('peso-surface').value;
            const especie = document.querySelector('input[name="especie"]:checked').value;
            const resultadoSurface = document.getElementById('resultado-surface');
            if (!peso || parseFloat(peso) <= 0) {
                resultadoSurface.textContent = '-- m²';
                return;
            }
            try {
                const response = await api.calcularSuperficie({ peso, especie });
                resultadoSurface.textContent = `${parseFloat(response.m2).toFixed(2)} m²`;
            } catch (error) {
                console.error("Erro ao calcular superfície:", error);
                resultadoSurface.textContent = 'Erro';
            }
        }
        surfaceForm.addEventListener('input', calcularSuperficie);
    }


    // --- LÓGICA DA ABA 2: FLUIDOTERAPIA ---
    const fluidoForm = document.getElementById('fluido-form');
    if (fluidoForm) {
        async function calcularFluidoterapia() {
            const peso = document.getElementById('fluido-peso').value;
            const percentualDesidratacao = document.getElementById('fluido-desidratacao').value;
            const taxaManutencao = document.getElementById('fluido-manutencao').value;
            const taxaPerdaAdicional = document.getElementById('fluido-perda').value;

            if (!peso || parseFloat(peso) <= 0) {
                resetarResultadosFluido();
                return;
            }

            try {
                const response = await api.calcularFluidoterapia({ 
                    peso, 
                    percentualDesidratacao, 
                    taxaManutencao, 
                    taxaPerdaAdicional 
                });
                atualizarUIFluido(response);
            } catch (error) {
                console.error("Erro ao calcular fluidoterapia:", error);
                resetarResultadosFluido('Erro');
            }
        }
        fluidoForm.addEventListener('input', calcularFluidoterapia);

        // Dispara o cálculo inicial com os valores padrão assim que a página carrega
        calcularFluidoterapia(); 
    }
});

function atualizarUIFluido(data) {
    document.getElementById('res-reposicao').textContent = `${parseFloat(data.volumeReposicao).toFixed(2)} ml`;
    document.getElementById('res-manutencao').textContent = `${parseFloat(data.volumeManutencao).toFixed(2)} ml`;
    document.getElementById('res-perda').textContent = `${parseFloat(data.volumePerdaAdicional).toFixed(2)} ml`;
    document.getElementById('res-total').textContent = `${parseFloat(data.volumeTotal24h).toFixed(2)} ml`;
    document.getElementById('res-ml-hora').textContent = `${parseFloat(data.mlPorHora).toFixed(2)} ml/hora`;
    document.getElementById('res-micro-min').textContent = `${parseFloat(data.gotasPorMinutoMicro).toFixed(2)} gotas/min`;
    document.getElementById('res-micro-seg').textContent = `1 gota a cada ${parseFloat(data.segundosPorGotaMicro).toFixed(2)} seg`;
    document.getElementById('res-macro-min').textContent = `${parseFloat(data.gotasPorMinutoMacro).toFixed(2)} gotas/min`;
    document.getElementById('res-macro-seg').textContent = `1 gota a cada ${parseFloat(data.segundosPorGotaMacro).toFixed(2)} seg`;
}

function resetarResultadosFluido(mensagem = '--') {
    const textoPadrao = mensagem === '--' ? '--' : 'Erro';
    document.getElementById('res-reposicao').textContent = `${textoPadrao} ml`;
    document.getElementById('res-manutencao').textContent = `${textoPadrao} ml`;
    document.getElementById('res-perda').textContent = `${textoPadrao} ml`;
    document.getElementById('res-total').textContent = `${textoPadrao} ml`;
    document.getElementById('res-ml-hora').textContent = `${textoPadrao} ml/hora`;
    document.getElementById('res-micro-min').textContent = '-- gotas/min';
    document.getElementById('res-micro-seg').textContent = '1 gota a cada -- seg';
    document.getElementById('res-macro-min').textContent = '-- gotas/min';
    document.getElementById('res-macro-seg').textContent = '1 gota a cada -- seg';
}

