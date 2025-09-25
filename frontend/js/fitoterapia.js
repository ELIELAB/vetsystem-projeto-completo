import { api } from '../js/apiService.js';

document.addEventListener('DOMContentLoaded', () => {
    
    let allFitos = [];

    const listContainer = document.getElementById('fito-list');
    const loadingSpinner = document.getElementById('loading');
    const searchInput = document.getElementById('fitoSearchInput');
    const propertyFilter = document.getElementById('propertyFilter');
    const diseaseFilter = document.getElementById('diseaseFilter');
    
    const normalizeString = (str) => {
        if (!str) return '';
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    };

    async function initialize() {
        try {
            loadingSpinner.style.display = 'block';
            const fitosData = await api.getFitos();
            allFitos = fitosData; 
            
            populateFilters(allFitos); 
            renderFitos(allFitos); 

        } catch (error) {
            console.error('Falha ao buscar fitoterápicos:', error);
            listContainer.innerHTML = `<div class="alert alert-danger">Erro ao carregar os dados. Verifique se a API está rodando.</div>`;
        } finally {
            loadingSpinner.style.display = 'none';
        }
    }
    
    function renderFitos(fitosToRender) {
        listContainer.innerHTML = '';
        if (fitosToRender.length === 0) {
            listContainer.innerHTML = '<p class="text-center text-muted">Nenhum fitoterápico encontrado com os filtros aplicados.</p>';
            return;
        }
        fitosToRender.forEach(fitoItem => {
            const card = document.createElement('div');
            card.className = 'col-md-6 col-lg-4 mb-4';
            card.innerHTML = `
                <div class="card h-100">
                    <div class="card-body">
                        <h5 class="card-title">${fitoItem.propertyName}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">${fitoItem.diseaseTreatedName}</h6>
                        <span class="badge bg-secondary">${fitoItem.popularName}</span>
                    </div>
                    <div class="card-footer bg-white d-flex justify-content-end">
                        <a href="fitoterapia-form.html?id=${fitoItem.id}" class="btn btn-sm btn-outline-secondary me-2">Editar</a>
                        
                        <a href="#" class="btn btn-sm btn-outline-danger delete-btn me-2" data-id="${fitoItem.id}">Deletar</a>
                        
                        <a href="#" class="btn btn-sm btn-outline-primary details-btn" data-id="${fitoItem.id}" data-bs-toggle="modal" data-bs-target="#fitoDetailsModal">Ver Detalhes</a>
                    </div>
                </div>
            `;
            listContainer.appendChild(card);
        });
        setupActionButtons(); // <-- ATENÇÃO: Mudamos o nome da função
    }

    function setupActionButtons() {
        // Lógica do Modal (Ver Detalhes)
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');
        document.querySelectorAll('.details-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const fitoId = event.target.getAttribute('data-id');
                const fitoItem = allFitos.find(f => f.id == fitoId);
                if (fitoItem) {
                    modalTitle.textContent = fitoItem.popularName;
                    let imageHtml = '';
                    if (fitoItem.imageUrl && fitoItem.imageUrl.toLowerCase() !== 'n/h') {
                        imageHtml = `<img src="${fitoItem.imageUrl}" alt="Imagem de ${fitoItem.popularName}" class="img-fluid rounded mb-3">`;
                    }
                    modalBody.innerHTML = ` ${imageHtml} <p><strong>Nome Científico:</strong> <em>${fitoItem.scientificName}</em></p> <hr> <h5>Método de Preparo</h5> <p>${fitoItem.preparationMethod.replace(/\n/g, '<br>')}</p> <h5>Contraindicação</h5> <p>${fitoItem.contraindication.replace(/\n/g, '<br>')}</p> `;
                }
            });
        });

        // NOVA LÓGICA DE DELETAR
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', async (event) => {
                event.preventDefault();
                const id = event.target.getAttribute('data-id');

                if (confirm('Tem certeza que deseja deletar este item? Esta ação não pode ser desfeita.')) {
                    try {
                        await api.deleteFito(id);
                        button.closest('.col-md-6').remove();
                        allFitos = allFitos.filter(fito => fito.id != id);
                    } catch (error) {
                        alert(`Falha ao deletar o item: ${error.message}`);
                    }
                }
            });
        });
    }

    // Funções de filtro e outras lógicas que não mudam
    function populateFilters(fitos) { const properties = new Set(); const diseases = new Set(); fitos.forEach(f => { if (f.propertyName) properties.add(f.propertyName); if (f.diseaseTreatedName) diseases.add(f.diseaseTreatedName); }); const sortedProperties = [...properties].sort((a, b) => a.localeCompare(b)); sortedProperties.forEach(prop => { const option = document.createElement('option'); option.value = prop; option.textContent = prop; propertyFilter.appendChild(option); }); const sortedDiseases = [...diseases].sort((a, b) => a.localeCompare(b)); sortedDiseases.forEach(disease => { const option = document.createElement('option'); option.value = disease; option.textContent = disease; diseaseFilter.appendChild(option); }); }
    function applyFilters() { const normalizedSearchTerm = normalizeString(searchInput.value); const selectedProperty = propertyFilter.value; const selectedDisease = diseaseFilter.value; let filteredFitos = allFitos; if (normalizedSearchTerm) { filteredFitos = filteredFitos.filter(f => normalizeString(f.popularName).includes(normalizedSearchTerm)); } if (selectedProperty !== 'all') { filteredFitos = filteredFitos.filter(f => f.propertyName === selectedProperty); } if (selectedDisease !== 'all') { filteredFitos = filteredFitos.filter(f => f.diseaseTreatedName === selectedDisease); } renderFitos(filteredFitos); }
    
    searchInput.addEventListener('input', applyFilters);
    propertyFilter.addEventListener('change', applyFilters);
    diseaseFilter.addEventListener('change', applyFilters);
    
    initialize();
});