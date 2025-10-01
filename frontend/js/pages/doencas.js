import { api } from '../services/apiService.js';

document.addEventListener('DOMContentLoaded', () => {

    const listContainer = document.getElementById('diseases-list');
    const loadingSpinner = document.getElementById('loading');
    const searchInput = document.getElementById('search-input');
    
    // --- Elementos do Modal ---
    const diseaseModalEl = document.getElementById('disease-modal');
    const diseaseModal = new bootstrap.Modal(diseaseModalEl);
    const modalTitle = document.getElementById('modal-title');
    const diseaseForm = document.getElementById('disease-form');
    const diseaseIdInput = document.getElementById('disease-id');
    const diseaseNameInput = document.getElementById('disease-name');
    const addDiseaseBtn = document.getElementById('add-disease-btn');
    const saveDiseaseBtn = document.getElementById('save-disease-btn');

    let allDiseases = []; // Nossa lista "mestra" de doenças

    const normalizeString = (str) => {
        if (!str) return '';
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    };

    async function initialize() {
        try {
            loadingSpinner.style.display = 'block';
            const diseasesFromApi = await api.getDiseases();
            allDiseases = diseasesFromApi.sort((a, b) => a.name.localeCompare(b.name));
            applyFiltersAndRender();
        } catch (error) {
            console.error('Falha ao buscar doenças:', error);
            listContainer.innerHTML = `<li class="list-group-item list-group-item-danger">Erro ao carregar os dados.</li>`;
        } finally {
            loadingSpinner.style.display = 'none';
        }
    }

    function applyFiltersAndRender() {
        const searchTerm = normalizeString(searchInput.value);
        let filteredDiseases = allDiseases;

        if (searchTerm) {
            filteredDiseases = allDiseases.filter(disease => 
                normalizeString(disease.name).includes(searchTerm)
            );
        }

        renderDiseases(filteredDiseases);
    }
    
    function renderDiseases(diseases) {
        listContainer.innerHTML = '';
        if (diseases.length === 0) {
            listContainer.innerHTML = '<li class="list-group-item">Nenhuma doença encontrada.</li>';
            return;
        }

        diseases.forEach(disease => {
            const listItem = createDiseaseListItem(disease);
            listContainer.appendChild(listItem);
        });
    }

    function createDiseaseListItem(disease) {
        const listItem = document.createElement('li');
        listItem.className = 'list-group-item list-group-item-light d-flex justify-content-between align-items-center';
        
        listItem.setAttribute('data-disease-id', disease.id);
        listItem.innerHTML = `
            <span class="disease-name-text">${disease.name}</span>
            <div>
                <button class="btn btn-sm btn-outline-secondary edit-btn" data-id="${disease.id}" data-name="${disease.name}">Editar</button>
                <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${disease.id}">Deletar</button>
            </div>
        `;
        return listItem;
    }
    
    function setupActionButtons() {
        addDiseaseBtn.addEventListener('click', () => {
            diseaseForm.reset();
            diseaseIdInput.value = '';
            modalTitle.textContent = 'Adicionar Nova Doença';
            diseaseModal.show();
        });

        saveDiseaseBtn.addEventListener('click', async () => {
            if (!diseaseForm.checkValidity()) {
                diseaseForm.reportValidity();
                return;
            }

            const id = diseaseIdInput.value;
            const name = diseaseNameInput.value;
            const data = { name };

            try {
                if (id) { // Editando
                    const updatedDisease = await api.updateDisease(id, data);
                    const index = allDiseases.findIndex(d => d.id == id);
                    if (index !== -1) allDiseases[index] = updatedDisease;
                } else { // Criando
                    const newDisease = await api.createDisease(data);
                    allDiseases.push(newDisease);
                }

                allDiseases.sort((a, b) => a.name.localeCompare(b.name));
                applyFiltersAndRender();
                diseaseModal.hide();
            } catch (error) {
                alert(`Erro ao salvar doença: ${error.message}`);
            }
        });

        listContainer.addEventListener('click', async (event) => {
            const target = event.target;
            const id = target.getAttribute('data-id');

            if (target.classList.contains('edit-btn')) {
                const name = target.getAttribute('data-name');
                diseaseForm.reset();
                diseaseIdInput.value = id;
                diseaseNameInput.value = name;
                modalTitle.textContent = 'Editar Doença';
                diseaseModal.show();
            }

            if (target.classList.contains('delete-btn')) {
                if (confirm('Tem certeza que deseja deletar esta doença?')) {
                    try {
                        await api.deleteDisease(id);
allDiseases = allDiseases.filter(d => d.id != id);
                        applyFiltersAndRender();
                    } catch (error) {
                        alert(`Falha ao deletar a doença: ${error.message}`);
                    }
                }
            }
        });
    }

    searchInput.addEventListener('input', applyFiltersAndRender);

    initialize();
    setupActionButtons();
});