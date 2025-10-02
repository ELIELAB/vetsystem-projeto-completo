// A URL base da sua API.
const BASE_URL = '/api'; //rodar local com ==>> 'http://localhost:8080';

/**
 * Função auxiliar genérica para fazer requisições.
 * @param {string} endpoint - O endpoint da API (ex: '/propriedades').
 * @param {string} method - O método HTTP ('GET', 'POST', 'PUT', 'DELETE').
 * @param {object} [data=null] - O objeto a ser enviado como JSON (opcional).
 * @returns {Promise<any>} - O JSON retornado pela API ou undefined para respostas sem conteúdo.
 */
async function request(endpoint, method, data = null) {
    const options = {
        method: method,
        headers: {}
    };

    if (data) {
        options.headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(data);
    }
    
    options.credentials = 'include';

    const response = await fetch(`${BASE_URL}${endpoint}`, options);

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `Erro ${response.status} na requisição para ${endpoint}` }));
        throw new Error(errorData.message);
    }

    if (response.status === 204) {
        return;
    }

    return response.json();
}

// Objeto 'api' que exporta funções fáceis de usar.
export const api = {
    // Patologias
    getPathologies: () => request('/patologias', 'GET'),
    getPathologyById: (id) => request(`/patologias/${id}`, 'GET'),
    createPathology: (data) => request('/patologias/cadastro', 'POST', data),
    updatePathology: (id, data) => request(`/patologias/${id}`, 'PUT', data),
    deletePathology: (id) => request(`/patologias/${id}`, 'DELETE'),

    // Classificações de Patologias
    getClassifications: () => request('/classificacao-patologias', 'GET'),
    getClassificationById: (id) => request(`/classificacao-patologias/${id}`, 'GET'),
    createClassification: (data) => request('/classificacao-patologias/cadastro', 'POST', data),
    updateClassification: (id, data) => request(`/classificacao-patologias/${id}`, 'PUT', data),
    deleteClassification: (id) => request(`/classificacao-patologias/${id}`, 'DELETE'),

    // Casos do Dia a Dia
    getCases: () => request('/tratamentos/dia-a-dia', 'GET'),
    getCaseById: (id) => request(`/tratamentos/dia-a-dia/${id}`, 'GET'),
    createCase: (data) => request('/tratamentos/dia-a-dia/cadastro', 'POST', data),
    updateCase: (id, data) => request(`/tratamentos/dia-a-dia/${id}`, 'PUT', data),
    deleteCase: (id) => request(`/tratamentos/dia-a-dia/${id}`, 'DELETE'),
    
    // Fitoterapia
    getFitos: () => request('/tratamento-fitoterapico', 'GET'),
    getFitoById: (id) => request(`/tratamento-fitoterapico/${id}`, 'GET'),
    createFito: (data) => request('/tratamento-fitoterapico/cadastro', 'POST', data),
    updateFito: (id, data) => request(`/tratamento-fitoterapico/${id}`, 'PUT', data),
    deleteFito: (id) => request(`/tratamento-fitoterapico/${id}`, 'DELETE'),
    
    // Propriedades
    getProperties: () => request('/propriedades', 'GET'),
    createProperty: (data) => request('/propriedades/cadastro', 'POST', data),
    updateProperty: (id, data) => request(`/propriedades/${id}`, 'PUT', data),
    deleteProperty: (id) => request(`/propriedades/${id}`, 'DELETE'),

    // Doenças
    getDiseases: () => request('/doencas-tratadas', 'GET'),
    getDiseaseById: (id) => request(`/doencas-tratadas/${id}`, 'GET'),
    createDisease: (data) => request('/doencas-tratadas/cadastro', 'POST', data),
    updateDisease: (id, data) => request(`/doencas-tratadas/${id}`, 'PUT', data),
    deleteDisease: (id) => request(`/doencas-tratadas/${id}`, 'DELETE'),

    // Calculadora
    calcularDose: (data) => request('/calculadora/dose-por-peso', 'POST', data),
    converterPercentual: (data) => request('/calculadora/percentual', 'POST', data),
    calcularSuperficie: (data) => request('/calculadora/superficie-corporea', 'POST', data),
    // Fluidoterapia
    calcularFluidoterapia: (data) => request('/calculadora/fluidoterapia', 'POST', data),

    // Parâmetros
    getTabelasConversao: () => request('/conversao/tabelas', 'GET'),
    getFuncoesVitais: () => request('/parametros/funcoes-vitais', 'GET'),
    getParametrosReprodutivos: () => request('/parametros/reprodutivos', 'GET'),
    
};

