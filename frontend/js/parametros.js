import { api } from './apiService.js';

document.addEventListener('DOMContentLoaded', () => {
    carregarTabelas();
});

async function carregarTabelas() {
    // Adiciona um feedback de carregamento
    const funcoesVitaisCorpo = document.getElementById('tabela-funcoes-vitais-corpo');
    const reprodutivosCorpo = document.getElementById('tabela-reprodutivos-corpo');
    const conversaoGeralCorpo = document.getElementById('tabela-conversao-geral-corpo');
    const conversaoMedidasCorpo = document.getElementById('tabela-conversao-medidas-corpo');

    funcoesVitaisCorpo.innerHTML = '<tr><td colspan="4">Carregando...</td></tr>';
    reprodutivosCorpo.innerHTML = '<tr><td colspan="5">Carregando...</td></tr>';
    conversaoGeralCorpo.innerHTML = '<tr><td colspan="2">Carregando...</td></tr>';
    conversaoMedidasCorpo.innerHTML = '<tr><td colspan="2">Carregando...</td></tr>';

    try {
        // Busca todos os dados em paralelo para mais performance
        const [funcoesData, reprodutivosData, conversoesData] = await Promise.all([
            api.getFuncoesVitais(),
            api.getParametrosReprodutivos(),
            api.getTabelasConversao()
        ]);

        // Renderiza cada tabela com os dados recebidos
        // CORREÇÃO: Acessa as propriedades com os nomes corretos vindos da API
        renderizarTabelaFuncoesVitais(funcoesData.funcoesVitais); 
        renderizarTabelaReprodutivos(reprodutivosData.parametros);
        renderizarTabelasConversao(conversoesData.unidades, conversoesData.medidas);

    } catch (error) {
        console.error("Erro ao carregar os parâmetros:", error);
        funcoesVitaisCorpo.innerHTML = '<tr><td colspan="4" class="text-danger">Erro ao carregar dados.</td></tr>';
        reprodutivosCorpo.innerHTML = '<tr><td colspan="5" class="text-danger">Erro ao carregar dados.</td></tr>';
        conversaoGeralCorpo.innerHTML = '<tr><td colspan="2" class="text-danger">Erro ao carregar dados.</td></tr>';
        conversaoMedidasCorpo.innerHTML = '<tr><td colspan="2" class="text-danger">Erro ao carregar dados.</td></tr>';
    }
}

function renderizarTabelaFuncoesVitais(listaDeFuncoes) {
    const corpoTabela = document.getElementById('tabela-funcoes-vitais-corpo');
    if (!listaDeFuncoes) { // Medida de segurança
        corpoTabela.innerHTML = '<tr><td colspan="4" class="text-danger">Dados de funções vitais não encontrados.</td></tr>';
        return;
    }
    corpoTabela.innerHTML = ''; // Limpa o "Carregando..."
    listaDeFuncoes.forEach(item => {
        const linha = `
            <tr>
                <td>${item.parametro}</td>
                <td>${item.caes}</td>
                <td>${item.gatos}</td>
                <td>${item.unidade}</td>
            </tr>
        `;
        corpoTabela.innerHTML += linha;
    });
}

function renderizarTabelaReprodutivos(listaDeItens) {
    const corpoTabela = document.getElementById('tabela-reprodutivos-corpo');
     if (!listaDeItens) { // Medida de segurança
        corpoTabela.innerHTML = '<tr><td colspan="5" class="text-danger">Dados reprodutivos não encontrados.</td></tr>';
        return;
    }
    corpoTabela.innerHTML = '';
    listaDeItens.forEach(item => {
        const linha = `
            <tr>
                <td>${item.especie}</td>
                <td>${item.gestacao}</td>
                <td>${item.cicloEstral}</td>
                <td>${item.cio}</td>
                <td>${item.cioPosParto}</td>
            </tr>
        `;
        corpoTabela.innerHTML += linha;
    });
}

function renderizarTabelasConversao(unidades, medidas) {
    const corpoGeral = document.getElementById('tabela-conversao-geral-corpo');
    const corpoMedidas = document.getElementById('tabela-conversao-medidas-corpo');
     if (!unidades || !medidas) { // Medida de segurança
        corpoGeral.innerHTML = '<tr><td colspan="2" class="text-danger">Dados de conversão não encontrados.</td></tr>';
        corpoMedidas.innerHTML = '<tr><td colspan="2" class="text-danger">Dados de medidas não encontrados.</td></tr>';
        return;
    }
    corpoGeral.innerHTML = '';
    corpoMedidas.innerHTML = '';

    unidades.forEach(item => {
        const linha = `<tr><td>${item.de}</td><td>${item.para}</td></tr>`;
        corpoGeral.innerHTML += linha;
    });

    medidas.forEach(item => {
        const linha = `<tr><td>${item.de}</td><td>${item.para}</td></tr>`;
        corpoMedidas.innerHTML += linha;
    });
}

