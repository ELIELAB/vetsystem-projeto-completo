import { api } from '../services/apiService.js';

/**
 * Nova função para formatar a dose dos comprimidos, que encontra a fração mais próxima.
 * @param {number | string} doseNumerica - A dose calculada pela API.
 * @returns {string} - A dose formatada como texto (ex: "1/4 de comp." ou "1.5 comp.").
 */
function formatarDoseComprimido(doseNumerica) {
    const dose = parseFloat(doseNumerica);

    // Se a dose for 1 ou mais, formata com 1 casa decimal.
    if (dose >= 1) {
        // Se for um número inteiro (ex: 2.0), mostra sem casas decimais.
        if (dose % 1 === 0) {
            return `${dose.toFixed(0)} comp.`;
        }
        return `${dose.toFixed(1)} comp.`;
    }

    // --- Lógica de Frações com Tolerância de 10% ---

    // Define as frações comuns e os seus valores
    const fracoes = [
        { valor: 0.25, texto: '1/4 de comp.' },
        { valor: 0.33, texto: '1/3 de comp.' },
        { valor: 0.50, texto: '1/2 de comp.' },
        { valor: 0.66, texto: '2/3 de comp.' },
        { valor: 0.75, texto: '3/4 de comp.' },
    ];

    let melhorFracao = null;
    let menorDiferenca = Infinity;

    // Encontra a fração mais próxima do resultado
    for (const fracao of fracoes) {
        const diferenca = Math.abs(dose - fracao.valor);
        if (diferenca < menorDiferenca) {
            menorDiferenca = diferenca;
            melhorFracao = fracao;
        }
    }

    // Define uma tolerância percentual máxima para o arredondamento (10%).
    const TOLERANCIA_PERCENTUAL = 0.10;

    // Prevenir divisão por zero, embora improvável aqui.
    if (dose === 0) {
        return `${dose.toFixed(0)} comp.`;
    }

    const diferencaPercentual = menorDiferenca / dose;

    // Se a diferença percentual for menor ou igual a 10%, arredonda.
    if (melhorFracao && diferencaPercentual <= TOLERANCIA_PERCENTUAL) {
        return melhorFracao.texto;
    }
    
    // Se não for próximo de nenhuma fração comum, mostra o valor decimal com 3 casas para precisão.
    return `${dose.toFixed(3)} comp.`;
}


document.addEventListener('DOMContentLoaded', () => {

    // --- Calculadora Principal de Doses ---
    const doseForm = document.getElementById('dose-form');
    const resultadoLiquido = document.getElementById('resultado-liquido');
    const resultadoComprimido = document.getElementById('resultado-comprimido');

    async function calcularDosePrincipal() {
        // Coleta os valores dos campos do formulário
        const peso = document.getElementById('peso').value;
        const dose = document.getElementById('dose').value;
        const concentracao = document.getElementById('concentracao').value;

        // Validação básica para evitar chamadas desnecessárias à API
        if (!peso || !dose || !concentracao || parseFloat(concentracao) === 0) {
            resultadoLiquido.textContent = '-- ml';
            resultadoComprimido.textContent = '-- comp.';
            return;
        }

        try {
            // Chama a função da API e passa os dados
            const response = await api.calcularDose({ peso, dose, concentracao });
            
            // Atualiza a interface com os resultados formatados
            resultadoLiquido.textContent = `${parseFloat(response.resultadoLiquido).toFixed(3)} ml`;
            
            // Usa a nova função de formatação melhorada
            resultadoComprimido.textContent = formatarDoseComprimido(response.resultadoComprimido);

        } catch (error) {
            console.error("Erro ao calcular dose:", error);
            resultadoLiquido.textContent = 'Erro';
            resultadoComprimido.textContent = 'Erro';
        }
    }
    // Adiciona o evento para recalcular a cada alteração
    doseForm.addEventListener('input', calcularDosePrincipal);

    // --- Conversor de Percentual ---
    const percentualInput = document.getElementById('percentual-input');
    const percentualResultado = document.getElementById('percentual-resultado');

    async function converterPercentual() {
        const percentual = percentualInput.value;
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

    // --- Calculadora de Superfície Corpórea ---
    const surfaceForm = document.getElementById('surface-form');
    const resultadoSurface = document.getElementById('resultado-surface');

    async function calcularSuperficie() {
        const peso = document.getElementById('peso-surface').value;
        const especie = document.querySelector('input[name="especie"]:checked').value;
        
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
});

