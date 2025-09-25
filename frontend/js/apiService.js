// A URL base da sua API. Se mudar no futuro, você só altera aqui.
const BASE_URL = 'http://localhost:8080';

/**
 * Função auxiliar para fazer requisições GET.
 * @param {string} endpoint - O endpoint da API (ex: '/propriedades').
 * @returns {Promise<any>} - O JSON retornado pela API.
 */
async function get(endpoint) {
    const response = await fetch(`${BASE_URL}${endpoint}`);
    if (!response.ok) {
        throw new Error(`Erro na requisição para ${endpoint}`);
    }
    return response.json();
}

/**
 * Função auxiliar para enviar dados (POST ou PUT).
 * @param {string} endpoint - O endpoint da API.
 * @param {string} method - O método HTTP ('POST' ou 'PUT').
 * @param {object} data - O objeto JavaScript a ser enviado como JSON.
 * @returns {Promise<any>} - O JSON retornado pela API.
 */
async function send(endpoint, method, data) {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        // Tenta extrair uma mensagem de erro mais detalhada do backend
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Falha ao ${method} em ${endpoint}`);
    }
    return response.json();
}

// Criamos um objeto 'api' que exporta funções fáceis de usar.
export const api = {
    // --- NOVO: Funções de Patologias ---
    getPathologies: () => get('/patologias'),

    // --- NOVO: Funções de Casos do Dia a Dia ---
    getCases: () => get('/tratamentos/dia-a-dia'),
    
    // Funções de Fitoterapia
    getFitos: () => get('/tratamento-fitoterapico'),
    getFitoById: (id) => get(`/tratamento-fitoterapico/${id}`),
    createFito: (data) => send('/tratamento-fitoterapico/cadastro', 'POST', data),
    updateFito: (id, data) => send(`/tratamento-fitoterapico/${id}`, 'PUT', data),
    
    // Funções de Propriedades
    getProperties: () => get('/propriedades'),
    createProperty: (data) => send('/propriedades/cadastro', 'POST', data),

    // Funções de Doenças
    getDiseases: () => get('/doencas-tratadas'),
    createDisease: (data) => send('/doencas-tratadas/cadastro', 'POST', data)
};