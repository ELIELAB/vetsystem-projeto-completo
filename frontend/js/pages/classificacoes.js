import { api } from '../services/apiService.js';

document.addEventListener('DOMContentLoaded', () => {
    const listContainer = document.getElementById('classifications-list');
    const loadingSpinner = document.getElementById('loading');
    const searchInput = document.getElementById('search-input');
    
    // --- Modal Elements ---
    const classificationModalEl = document.getElementById('classification-modal');
    const classificationModal = new bootstrap.Modal(classificationModalEl);
    const modalTitle = document.getElementById('modal-title');
    const classificationForm = document.getElementById('classification-form');
    const classificationIdInput = document.getElementById('classification-id');
    const classificationNameInput = document.getElementById('classification-name');
    const addClassificationBtn = document.getElementById('add-classification-btn');
    const saveClassificationBtn = document.getElementById('save-classification-btn');

    let allClassifications = [];

    const normalizeString = (str) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

    async function initialize() {
        try {
            loadingSpinner.style.display = 'block';
            const data = await api.getClassifications();
            allClassifications = data.sort((a, b) => a.name.localeCompare(b.name));
            applyFiltersAndRender();
        } catch (error) {
            listContainer.innerHTML = `<li class="list-group-item list-group-item-danger">Erro ao carregar dados.</li>`;
        } finally {
            loadingSpinner.style.display = 'none';
        }
    }

    function applyFiltersAndRender() {
        const searchTerm = normalizeString(searchInput.value);
        const filtered = searchTerm
            ? allClassifications.filter(c => normalizeString(c.name).includes(searchTerm))
            : allClassifications;
        renderClassifications(filtered);
    }
    
    function renderClassifications(classifications) {
        listContainer.innerHTML = '';
        if (classifications.length === 0) {
            listContainer.innerHTML = '<li class="list-group-item">Nenhuma classificação encontrada.</li>';
            return;
        }
        classifications.forEach(c => listContainer.appendChild(createListItem(c)));
    }

    function createListItem(classification) {
        const item = document.createElement('li');
        item.className = 'list-group-item bg-custom-gray d-flex justify-content-between align-items-center';
        item.setAttribute('data-classification-id', classification.id);
        item.innerHTML = `
            <span class="name-text">${classification.name}</span>
            <div>
                <button class="btn btn-sm btn-outline-secondary edit-btn" data-id="${classification.id}" data-name="${classification.name}">Editar</button>
                <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${classification.id}">Deletar</button>
            </div>
        `;
        return item;
    }
    
    function setupActionButtons() {
        addClassificationBtn.addEventListener('click', () => {
            classificationForm.reset();
            classificationIdInput.value = '';
            modalTitle.textContent = 'Adicionar Nova Classificação';
            classificationModal.show();
        });

        saveClassificationBtn.addEventListener('click', async () => {
            if (!classificationForm.checkValidity()) return classificationForm.reportValidity();
            const id = classificationIdInput.value;
            const data = { name: classificationNameInput.value };
            try {
                const saved = id ? await api.updateClassification(id, data) : await api.createClassification(data);
                const index = allClassifications.findIndex(c => c.id == id);
                if (index !== -1) allClassifications[index] = saved;
                else allClassifications.push(saved);
                
                allClassifications.sort((a, b) => a.name.localeCompare(b.name));
                applyFiltersAndRender();
                classificationModal.hide();
            } catch (error) {
                alert(`Erro ao salvar: ${error.message}`);
            }
        });

        listContainer.addEventListener('click', async (event) => {
            const target = event.target;
            const id = target.getAttribute('data-id');

            if (target.classList.contains('edit-btn')) {
                const name = target.getAttribute('data-name');
                classificationIdInput.value = id;
                classificationNameInput.value = name;
                modalTitle.textContent = 'Editar Classificação';
                classificationModal.show();
            }

            if (target.classList.contains('delete-btn')) {
                if (confirm('Tem certeza?')) {
                    try {
                        await api.deleteClassification(id);
                        allClassifications = allClassifications.filter(c => c.id != id);
                        applyFiltersAndRender();
                    } catch (error) {
                        alert(`Falha ao deletar: ${error.message}`);
                    }
                }
            }
        });
    }

    searchInput.addEventListener('input', applyFiltersAndRender);
    initialize();
    setupActionButtons();
});