import { api } from '../js/apiService.js';

document.addEventListener('DOMContentLoaded', () => {
    
    let allPathologies = [];

    const listContainer = document.getElementById('pathologies-list');
    const loadingSpinner = document.getElementById('loading');
    const searchInput = document.getElementById('searchInput');
    const classificationFilter = document.getElementById('classificationFilter');
    const speciesFilter = document.getElementById('speciesFilter');

    const normalizeString = (str) => {
        if (!str) return '';
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    };

    async function initialize() {
        try {
            loadingSpinner.style.display = 'block';
            const pathologiesData = await api.getPathologies();
            allPathologies = pathologiesData; 
            
            renderPathologies(allPathologies); 
            populateClassificationFilter(allPathologies); 

        } catch (error) {
            console.error('Falha ao buscar patologias:', error);
            listContainer.innerHTML = `<div class="alert alert-danger">Erro ao carregar os dados. Verifique se a API está rodando.</div>`;
        } finally {
            loadingSpinner.style.display = 'none';
        }
    }

    function renderPathologies(pathologiesToRender) {
        listContainer.innerHTML = '';
        if (pathologiesToRender.length === 0) {
            listContainer.innerHTML = '<p class="text-center text-muted">Nenhuma patologia encontrada com os filtros aplicados.</p>';
            return;
        }
        pathologiesToRender.forEach(pathology => {
            const card = document.createElement('div');
            card.className = 'col-md-6 col-lg-4 mb-4';
            const classificationName = pathology.classification?.name || 'Sem classificação';
            
            // --- TEMPLATE DO CARD ATUALIZADO COM TODOS OS BOTÕES ---
            card.innerHTML = `
                <div class="card h-100 bg-light">
                    <div class="card-body">
                        <h5 class="card-title">${pathology.name}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">${classificationName}</h6>
                        <span class="badge bg-secondary">${pathology.species}</span>
                    </div>
                    <div class="card-footer bg-white d-flex justify-content-end">
                        <a href="patologia-form.html?id=${pathology.id}" class="btn btn-sm btn-outline-secondary me-2">Editar</a>
                        <a href="#" class="btn btn-sm btn-outline-danger delete-btn me-2" data-id="${pathology.id}">Deletar</a>
                        <a href="#" class="btn btn-sm btn-outline-primary details-btn" data-id="${pathology.id}" data-bs-toggle="modal" data-bs-target="#pathologyDetailsModal">Ver Detalhes</a>
                    </div>
                </div>
            `;
            listContainer.appendChild(card);
        });
        setupActionButtons();
    }
    
    // --- FUNÇÃO ATUALIZADA PARA LIDAR COM TODOS OS BOTÕES ---
    function setupActionButtons() {
        // Lógica do Modal (Ver Detalhes)
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');
        document.querySelectorAll('.details-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const pathologyId = event.target.getAttribute('data-id');
                const pathology = allPathologies.find(p => p.id == pathologyId);
                if (pathology) {
                    modalTitle.textContent = pathology.name;
                    modalBody.innerHTML = ` <h5>Sinais Clínicos</h5> <p>${pathology.clinicalSigns.replace(/\n/g, '<br>')}</p><hr> <h5>Exames</h5> <p>${pathology.exams.replace(/\n/g, '<br>')}</p><hr> <h5>Tratamentos</h5> <p>${pathology.treatments.replace(/\n/g, '<br>')}</p><hr> <h5>Observações</h5> <p>${pathology.observations.replace(/\n/g, '<br>')}</p> `;
                }
            });
        });

        // Lógica de Deletar
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', async (event) => {
                event.preventDefault();
                const id = event.target.getAttribute('data-id');

                if (confirm('Tem certeza que deseja deletar esta patologia?')) {
                    try {
                        await api.deletePathology(id);
                        button.closest('.col-md-6').remove();
                        allPathologies = allPathologies.filter(p => p.id != id);
                    } catch (error) {
                        alert(`Falha ao deletar o item: ${error.message}`);
                    }
                }
            });
        });
    }

    function populateClassificationFilter(pathologies) {
        const classifications = new Map();
        pathologies.forEach(p => {
            if (p.classification && p.classification.id && p.classification.name) {
                classifications.set(p.classification.id, p.classification.name);
            }
        });
        const sortedClassifications = [...classifications.entries()].sort((a, b) => a[1].localeCompare(b[1]));
        classificationFilter.innerHTML = '<option selected value="all">Todas as Classificações</option>'; // Limpa e adiciona a opção padrão
        sortedClassifications.forEach(([id, name]) => {
            const option = document.createElement('option');
            option.value = id;
            option.textContent = name;
            classificationFilter.appendChild(option);
        });
    }

    function applyFilters() {
        const normalizedSearchTerm = normalizeString(searchInput.value);
        const selectedClassificationId = classificationFilter.value;
        const selectedSpecies = speciesFilter.value;
        let filteredPathologies = allPathologies;
        if (normalizedSearchTerm) {
            filteredPathologies = filteredPathologies.filter(p => normalizeString(p.name).includes(normalizedSearchTerm));
        }
        if (selectedClassificationId !== 'all') {
            filteredPathologies = filteredPathologies.filter(p => p.classification?.id == selectedClassificationId);
        }
        if (selectedSpecies !== 'all') {
            filteredPathologies = filteredPathologies.filter(p => p.species === selectedSpecies);
        }
        renderPathologies(filteredPathologies);
    }
    
    searchInput.addEventListener('input', applyFilters);
    classificationFilter.addEventListener('change', applyFilters);
    speciesFilter.addEventListener('change', applyFilters);

    initialize();
});