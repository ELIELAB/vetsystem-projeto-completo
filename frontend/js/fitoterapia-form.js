import { api } from '../js/apiService.js'; // 1. IMPORTA NOSSO MÓDULO DE API

document.addEventListener('DOMContentLoaded', async () => {
    
    // Referências aos elementos do DOM (sem alterações)
    const form = document.getElementById('fito-form');
    const propertySelect = document.getElementById('propriedadeId');
    const diseaseSelect = document.getElementById('doencaTratadaId');
    const pageTitle = document.getElementById('page-title');
    const btnNovaPropriedade = document.getElementById('btn-nova-propriedade');
    const btnNovaDoenca = document.getElementById('btn-nova-doenca');
    const newItemModalEl = document.getElementById('newItemModal');
    const newItemModal = new bootstrap.Modal(newItemModalEl);
    const newItemModalLabel = document.getElementById('newItemModalLabel');
    const newItemNameInput = document.getElementById('newItemName');
    const saveNewItemButton = document.getElementById('saveNewItemButton');
    const newItemForm = document.getElementById('newItemForm');

    let currentItemType = null;
    const params = new URLSearchParams(window.location.search);
    const editId = params.get('id');

    // Função para buscar e preencher dados para edição (agora usa 'api')
    async function loadFitoDataForEdit(id) {
        try {
            const fito = await api.getFitoById(id); // 2. USA A API
            document.getElementById('popularName').value = fito.popularName || '';
            document.getElementById('scientificName').value = fito.scientificName || '';
            document.getElementById('imageUrl').value = fito.imageUrl || '';
            document.getElementById('preparationMethod').value = fito.preparationMethod || '';
            document.getElementById('contraindication').value = fito.contraindication || '';
            propertySelect.value = fito.propertyId;
            diseaseSelect.value = fito.diseaseTreatedId;
        } catch (error) {
            console.error('Erro ao carregar dados para edição:', error);
            alert('Não foi possível carregar os dados para edição.');
        }
    }

    // Função para popular selects (agora usa 'api')
    async function populateSelect(selectElement, fetchFunction, nameField, newIdToSelect = null) {
        try {
            const data = await fetchFunction(); // 3. USA A API (ex: api.getProperties)
            selectElement.innerHTML = `<option value="" selected disabled>Selecione uma opção</option>`;
            data.sort((a, b) => a[nameField].localeCompare(b[nameField]));
            data.forEach(item => {
                const option = document.createElement('option');
                option.value = item.id;
                option.textContent = item[nameField];
                selectElement.appendChild(option);
            });
            if (newIdToSelect) selectElement.value = newIdToSelect;
        } catch (error) {
            console.error(`Erro ao popular ${selectElement.id}:`, error);
        }
    }

    // Inicialização da página
    await Promise.all([
        populateSelect(propertySelect, api.getProperties, 'name'),
        populateSelect(diseaseSelect, api.getDiseases, 'name')
    ]);

    if (editId) {
        pageTitle.textContent = 'Editar Fitoterápico';
        await loadFitoDataForEdit(editId);
    }

    // Lógica do Modal (agora usa 'api')
    btnNovaPropriedade.addEventListener('click', () => { /* ... */ });
    btnNovaDoenca.addEventListener('click', () => { /* ... */ });
    saveNewItemButton.addEventListener('click', async () => {
        if (!newItemForm.checkValidity()) return;
        const name = newItemNameInput.value;
        try {
            let savedItem;
            if (currentItemType === 'property') {
                savedItem = await api.createProperty({ name }); // 4. USA A API
                await populateSelect(propertySelect, api.getProperties, 'name', savedItem.id);
            } else if (currentItemType === 'disease') {
                savedItem = await api.createDisease({ name }); // 5. USA A API
                await populateSelect(diseaseSelect, api.getDiseases, 'name', savedItem.id);
            }
            newItemModal.hide();
        } catch (error) {
            alert(`Erro: ${error.message}`);
        }
    });

    // Lógica do Formulário Principal (agora usa 'api')
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = {
            popularName: document.getElementById('popularName').value,
            scientificName: document.getElementById('scientificName').value,
            imageUrl: document.getElementById('imageUrl').value,
            preparationMethod: document.getElementById('preparationMethod').value,
            contraindication: document.getElementById('contraindication').value,
            propriedadeId: parseInt(propertySelect.value),
            doencaTratadaId: parseInt(diseaseSelect.value)
        };

        try {
            if (editId) {
                await api.updateFito(editId, formData); // 6. USA A API
            } else {
                await api.createFito(formData); // 7. USA A API
            }
            alert(`Fitoterápico ${editId ? 'atualizado' : 'salvo'} com sucesso!`);
            window.location.href = 'fitoterapia.html';
        } catch (error) {
            alert(`Erro: ${error.message}`);
        }
    });

    // Código auxiliar do modal (sem alterações)
    btnNovaPropriedade.addEventListener('click', () => { currentItemType = 'property'; newItemModalLabel.textContent = 'Adicionar Nova Propriedade'; newItemNameInput.value = ''; });
    btnNovaDoenca.addEventListener('click', () => { currentItemType = 'disease'; newItemModalLabel.textContent = 'Adicionar Nova Doença Tratada'; newItemNameInput.value = ''; });
});