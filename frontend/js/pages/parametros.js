import { api } from '../services/apiService.js';

document.addEventListener('DOMContentLoaded', () => {
    carregarTabelas();
});

async function carregarTabelas() {
    // Adiciona um feedback de carregamento
    const funcoesVitaisCorpo = document.getElementById('tabela-funcoes-vitais-corpo');
    const reprodutivosCorpo = document.getElementById('tabela-reprodutivos-corpo');
    const listaConversaoGeral = document.getElementById('lista-conversao-geral');
    const listaConversaoMedidas = document.getElementById('lista-conversao-medidas');

    funcoesVitaisCorpo.innerHTML = '<tr><td colspan="4">Carregando...</td></tr>';
    reprodutivosCorpo.innerHTML = '<tr><td colspan="5">Carregando...</td></tr>';
    listaConversaoGeral.innerHTML = '<li class="list-group-item">Carregando...</li>';
    listaConversaoMedidas.innerHTML = '<li class="list-group-item">Carregando...</li>';

    try {
        // Busca todos os dados em paralelo para mais performance
        const [funcoesData, reprodutivosData, conversoesData] = await Promise.all([
            api.getFuncoesVitais(),
            api.getParametrosReprodutivos(),
            api.getTabelasConversao()
        ]);

        // Renderiza cada tabela com os dados recebidos
        renderizarTabelaFuncoesVitais(funcoesData.funcoesVitais); 
        renderizarTabelaReprodutivos(reprodutivosData.parametros);
        renderizarListasConversao(conversoesData.unidades, conversoesData.medidas);

    } catch (error) {
        console.error("Erro ao carregar os parâmetros:", error);
        funcoesVitaisCorpo.innerHTML = '<tr><td colspan="4" class="text-danger">Erro ao carregar dados.</td></tr>';
        reprodutivosCorpo.innerHTML = '<tr><td colspan="5" class="text-danger">Erro ao carregar dados.</td></tr>';
        listaConversaoGeral.innerHTML = '<li class="list-group-item text-danger">Erro ao carregar dados.</li>';
        listaConversaoMedidas.innerHTML = '<li class="list-group-item text-danger">Erro ao carregar dados.</li>';
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

function renderizarListasConversao(unidades, medidas) {
    const listaGeral = document.getElementById('lista-conversao-geral');
    const listaMedidas = document.getElementById('lista-conversao-medidas');
     if (!unidades || !medidas) { // Medida de segurança
        listaGeral.innerHTML = '<li class="list-group-item text-danger">Dados de conversão não encontrados.</li>';
        listaMedidas.innerHTML = '<li class="list-group-item text-danger">Dados de medidas não encontrados.</li>';
        return;
    }
    listaGeral.innerHTML = '';
    listaMedidas.innerHTML = '';

    unidades.forEach(item => {
        const listItem = `
            <li class="list-group-item d-flex justify-content-between align-items-center">
                ${item.de}
                <span class="badge bg-primary rounded-pill">${item.para}</span>
            </li>
        `;
        listaGeral.innerHTML += listItem;
    });

    medidas.forEach(item => {
        const listItem = `
            <li class="list-group-item d-flex justify-content-between align-items-center">
                ${item.de}
                <span class="badge bg-success rounded-pill">${item.para}</span>
            </li>
        `;
        listaMedidas.innerHTML += listItem;
    });
}

