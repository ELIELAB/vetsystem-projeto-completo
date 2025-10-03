import { api } from '../services/apiService.js';

document.addEventListener('DOMContentLoaded', () => {
    carregarTabelas();
});

async function carregarTabelas() {
    const funcoesVitaisCorpo = document.getElementById('tabela-funcoes-vitais-corpo');
    const reprodutivosCorpo = document.getElementById('tabela-reprodutivos-corpo');
    const conversaoGeralLista = document.getElementById('lista-conversao-geral');
    const conversaoMedidasLista = document.getElementById('lista-conversao-medidas');
    const vacinacaoCaesCorpo = document.getElementById('tabela-vacinacao-caes-corpo');
    const vacinacaoGatosCorpo = document.getElementById('tabela-vacinacao-gatos-corpo');

    // Feedback de carregamento
    funcoesVitaisCorpo.innerHTML = '<tr><td colspan="4">A carregar...</td></tr>';
    reprodutivosCorpo.innerHTML = '<tr><td colspan="5">A carregar...</td></tr>';
    conversaoGeralLista.innerHTML = '<li class="list-group-item">A carregar...</li>';
    conversaoMedidasLista.innerHTML = '<li class="list-group-item">A carregar...</li>';
    vacinacaoCaesCorpo.innerHTML = '<tr><td colspan="5">A carregar...</td></tr>';
    vacinacaoGatosCorpo.innerHTML = '<tr><td colspan="5">A carregar...</td></tr>';

    try {
        const [funcoesData, reprodutivosData, conversoesData, vacinacaoData] = await Promise.all([
            api.getFuncoesVitais(),
            api.getParametrosReprodutivos(),
            api.getTabelasConversao(),
            api.getVaccinationProtocols()
        ]);

        // Acede às propriedades com os nomes exatos retornados pela API
        renderizarTabelaFuncoesVitais(funcoesData.funcoesVitais); 
        renderizarTabelaReprodutivos(reprodutivosData.parametros);
        renderizarListasConversao(conversoesData.unidades, conversoesData.medidas);
        renderizarTabelasVacinacao(vacinacaoData.caes, vacinacaoData.gatos);

    } catch (error) {
        console.error("Erro ao carregar os parâmetros:", error);
        // Exibe mensagem de erro em todas as tabelas
        funcoesVitaisCorpo.innerHTML = '<tr><td colspan="4" class="text-danger">Erro ao carregar.</td></tr>';
        reprodutivosCorpo.innerHTML = '<tr><td colspan="5" class="text-danger">Erro ao carregar.</td></tr>';
        conversaoGeralLista.innerHTML = '<li class="list-group-item text-danger">Erro ao carregar.</li>';
        conversaoMedidasLista.innerHTML = '<li class="list-group-item text-danger">Erro ao carregar.</td></tr>';
        vacinacaoCaesCorpo.innerHTML = '<tr><td colspan="5" class="text-danger">Erro ao carregar.</td></tr>';
        vacinacaoGatosCorpo.innerHTML = '<tr><td colspan="5" class="text-danger">Erro ao carregar.</td></tr>';
    }
}

// --- FUNÇÕES DE RENDERIZAÇÃO ---

/**
 * Renderiza as tabelas de vacinação com um visual melhorado.
 * @param {Array} caes - Lista de protocolos para cães.
 * @param {Array} gatos - Lista de protocolos para gatos.
 */
function renderizarTabelasVacinacao(caes, gatos) {
    const caesCorpo = document.getElementById('tabela-vacinacao-caes-corpo');
    const gatosCorpo = document.getElementById('tabela-vacinacao-gatos-corpo');
    
    // Função auxiliar para decidir o conteúdo da célula
    const renderCellContent = (text) => {
        if (text && text.toUpperCase().includes('X')) {
            // Se contiver 'X', substitui por um ícone de check e mantém o resto do texto
            const cleanText = text.replace(/x/gi, '').trim();
            return `<i class="bi bi-check-lg text-success fs-4"></i><br><small class="text-muted">${cleanText}</small>`;
        }
        return text || '-'; // Se for nulo ou vazio, retorna um hífen
    };

    const renderRows = (data) => {
        return data.map(item => `
            <tr>
                <td class="fw-bold">${item.nome}</td>
                <td>${renderCellContent(item.idade1)}</td>
                <td>${renderCellContent(item.idade2)}</td>
                <td>${renderCellContent(item.idade3)}</td>
                <td>${renderCellContent(item.reforco)}</td>
            </tr>
        `).join('');
    };

    if (!caes || caes.length === 0) {
        caesCorpo.innerHTML = '<tr><td colspan="5" class="text-danger">Dados não encontrados.</td></tr>';
    } else {
        caesCorpo.innerHTML = renderRows(caes);
    }

    if (!gatos || gatos.length === 0) {
        gatosCorpo.innerHTML = '<tr><td colspan="5" class="text-danger">Dados não encontrados.</td></tr>';
    } else {
        gatosCorpo.innerHTML = renderRows(gatos);
    }
}


function renderizarTabelaFuncoesVitais(listaDeFuncoes) {
    const corpoTabela = document.getElementById('tabela-funcoes-vitais-corpo');
    if (!listaDeFuncoes || listaDeFuncoes.length === 0) { 
        corpoTabela.innerHTML = '<tr><td colspan="4" class="text-danger">Dados não encontrados.</td></tr>';
        return;
    }
    corpoTabela.innerHTML = '';
    listaDeFuncoes.forEach(item => {
        const linha = `<tr><td>${item.parametro}</td><td>${item.caes}</td><td>${item.gatos}</td><td>${item.unidade}</td></tr>`;
        corpoTabela.innerHTML += linha;
    });
}

function renderizarTabelaReprodutivos(listaDeItens) {
    const corpoTabela = document.getElementById('tabela-reprodutivos-corpo');
     if (!listaDeItens || listaDeItens.length === 0) {
        corpoTabela.innerHTML = '<tr><td colspan="5" class="text-danger">Dados não encontrados.</td></tr>';
        return;
    }
    corpoTabela.innerHTML = '';
    listaDeItens.forEach(item => {
        const linha = `<tr><td>${item.especie}</td><td>${item.gestacao}</td><td>${item.cicloEstral}</td><td>${item.cio}</td><td>${item.cioPosParto}</td></tr>`;
        corpoTabela.innerHTML += linha;
    });
}

function renderizarListasConversao(unidades, medidas) {
    const listaUnidades = document.getElementById('lista-conversao-geral');
    const listaMedidas = document.getElementById('lista-conversao-medidas');
    if (!unidades || !medidas || unidades.length === 0 || medidas.length === 0) {
        listaUnidades.innerHTML = '<li class="list-group-item text-danger">Dados não encontrados.</li>';
        listaMedidas.innerHTML = '<li class="list-group-item text-danger">Dados não encontrados.</li>';
        return;
    }
    listaUnidades.innerHTML = '';
    listaMedidas.innerHTML = '';

    const renderListItem = (item) => `<li class="list-group-item d-flex justify-content-between align-items-center">${item.de}<span class="badge bg-primary rounded-pill">${item.para}</span></li>`;

    unidades.forEach(item => listaUnidades.innerHTML += renderListItem(item));
    medidas.forEach(item => listaMedidas.innerHTML += renderListItem(item));
}

