// A URL base da sua API.
const BASE_URL = 'http://localhost:8080';

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
    
    // Adiciona withCredentials para enviar cookies/sessão se necessário com o CORS
    options.credentials = 'include';

    const response = await fetch(`${BASE_URL}${endpoint}`, options);

    // Se a resposta não for OK (status 2xx), lança um erro
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `Erro ${response.status} na requisição para ${endpoint}` }));
        throw new Error(errorData.message);
    }

    // Respostas 204 No Content não têm corpo, então não tentamos fazer o parse do JSON.
    if (response.status === 204) {
        return; // Retorna com sucesso, sem dados.
    }

    return response.json();
}

// Objeto 'api' que exporta funções fáceis de usar.
export const api = {
    // Patologias
    getPathologies: () => request('/patologias', 'GET'),

    // Casos do Dia a Dia
    getCases: () => request('/tratamentos/dia-a-dia', 'GET'),
    
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
    getDiseaseById: (id) => request(`/doencas-tratadas/${id}`, 'GET'),       // <- NOVA FUNÇÃO
    createDisease: (data) => request('/doencas-tratadas/cadastro', 'POST', data),
    updateDisease: (id, data) => request(`/doencas-tratadas/${id}`, 'PUT', data), // <- NOVA FUNÇÃO
    deleteDisease: (id) => request(`/doencas-tratadas/${id}`, 'DELETE')
};