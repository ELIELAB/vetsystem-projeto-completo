import { api } from '../services/apiService.js';

document.addEventListener('DOMContentLoaded', () => {
    
    let allCases = [];

    const listContainer = document.getElementById('cases-list');
    const loadingSpinner = document.getElementById('loading');
    const searchInput = document.getElementById('caseSearchInput');

    const normalizeString = (str) => {
        if (!str) return '';
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    };

    async function initialize() {
        try {
            loadingSpinner.style.display = 'block';
            const casesData = await api.getCases();
            allCases = casesData; 
            renderCases(allCases);
        } catch (error) {
            console.error('Falha ao buscar casos:', error);
            listContainer.innerHTML = `<div class="alert alert-danger">Erro ao carregar os dados. Verifique se a API está rodando.</div>`;
        } finally {
            loadingSpinner.style.display = 'none';
        }
    }

    function renderCases(casesToRender) { 
        listContainer.innerHTML = ''; 
        if (casesToRender.length === 0) { 
            listContainer.innerHTML = '<p class="text-center text-muted">Nenhum caso encontrado com o termo pesquisado.</p>'; 
            return; 
        } 
        casesToRender.forEach(caseItem => { 
            const card = document.createElement('div'); 
            card.className = 'col-md-6 col-lg-4 mb-4'; 
            
            card.innerHTML = ` 
                <div class="card h-100 bg-light"> 
                    <div class="card-body d-flex flex-column"> 
                        <h5 class="card-title">${caseItem.type}</h5> 
                        <p class="card-text text-muted flex-grow-1">Protocolos de tratamento e informações disponíveis.</p> 
                    </div>
                    <div class="card-footer bg-white d-flex justify-content-end">
                        <a href="casos-form.html?id=${caseItem.id}" class="btn btn-sm btn-outline-secondary me-2">Editar</a>
                        <a href="#" class="btn btn-sm btn-outline-danger delete-btn me-2" data-id="${caseItem.id}">Deletar</a>
                        <a href="#" class="btn btn-sm btn-outline-primary details-btn" data-id="${caseItem.id}" data-bs-toggle="modal" data-bs-target="#caseDetailsModal">Ver Detalhes</a> 
                    </div>
                </div> 
            `; 
            listContainer.appendChild(card); 
        }); 
        setupActionButtons();
    }
    
    function setupActionButtons() {
        const modalTitle = document.getElementById('modalTitle'); 
        const modalBody = document.getElementById('modalBody'); 
        
        document.querySelectorAll('.details-btn').forEach(button => { 
            button.addEventListener('click', (event) => { 
                const caseId = event.target.getAttribute('data-id'); 
                const caseItem = allCases.find(c => c.id == caseId); 
                if (caseItem) { 
                    modalTitle.textContent = caseItem.type; 
                    modalBody.innerHTML = ` 
                        <h5>Prescrição / Protocolo</h5> 
                        <p>${caseItem.prescription.replace(/\n/g, '<br>')}</p> 
                        <hr> 
                        <h5>Informações Adicionais</h5> 
                        <p>${caseItem.information.replace(/\n/g, '<br>')}</p> 
                    `; 
                } 
            }); 
        });

        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', async (event) => {
                event.preventDefault();
                const id = event.target.getAttribute('data-id');

                if (confirm('Tem certeza que deseja deletar este caso?')) {
                    try {
                        await api.deleteCase(id);
                        button.closest('.col-md-6').remove();
                        allCases = allCases.filter(c => c.id != id);
                    } catch (error) {
                        alert(`Falha ao deletar o item: ${error.message}`);
                    }
                }
            });
        });
    }
    
    function applyFilters() { 
        const normalizedSearchTerm = normalizeString(searchInput.value); 
        let filteredCases = allCases; 
        if (normalizedSearchTerm) { 
            filteredCases = filteredCases.filter(c => normalizeString(c.type).includes(normalizedSearchTerm)); 
        } 
        renderCases(filteredCases); 
    }

    searchInput.addEventListener('input', applyFilters);
    initialize();
});