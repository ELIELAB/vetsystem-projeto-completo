import { api } from '../js/apiService.js';

document.addEventListener('DOMContentLoaded', () => {

    const listContainer = document.getElementById('properties-list');
    const loadingSpinner = document.getElementById('loading');
    const searchInput = document.getElementById('search-input');
    
    // --- Elementos do Modal ---
    const propertyModalEl = document.getElementById('property-modal');
    const propertyModal = new bootstrap.Modal(propertyModalEl);
    const modalTitle = document.getElementById('modal-title');
    const propertyForm = document.getElementById('property-form');
    const propertyIdInput = document.getElementById('property-id');
    const propertyNameInput = document.getElementById('property-name');
    const addPropertyBtn = document.getElementById('add-property-btn');
    const savePropertyBtn = document.getElementById('save-property-btn');

    let allProperties = []; // Nossa lista "mestra" de propriedades

    // Função auxiliar para normalizar strings (ignorar acentos e maiúsculas/minúsculas)
    const normalizeString = (str) => {
        if (!str) return '';
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    };

    async function initialize() {
        try {
            loadingSpinner.style.display = 'block';
            const propertiesFromApi = await api.getProperties();
            
            // Ordena a lista em ordem alfabética
            allProperties = propertiesFromApi.sort((a, b) => a.name.localeCompare(b.name));
            
            applyFiltersAndRender();

        } catch (error) {
            console.error('Falha ao buscar propriedades:', error);
            listContainer.innerHTML = `<li class="list-group-item list-group-item-danger">Erro ao carregar os dados.</li>`;
        } finally {
            loadingSpinner.style.display = 'none';
        }
    }

    // Aplica os filtros atuais (pesquisa) e renderiza a lista na tela
    function applyFiltersAndRender() {
        const searchTerm = normalizeString(searchInput.value);
        let filteredProperties = allProperties;

        if (searchTerm) {
            filteredProperties = allProperties.filter(property => 
                normalizeString(property.name).includes(searchTerm)
            );
        }

        renderProperties(filteredProperties);
    }
    
    // Apenas desenha os itens na tela com base na lista que recebe
    function renderProperties(properties) {
        listContainer.innerHTML = '';
        if (properties.length === 0) {
            listContainer.innerHTML = '<li class="list-group-item">Nenhuma propriedade encontrada.</li>';
            return;
        }

        properties.forEach(property => {
            const listItem = createPropertyListItem(property);
            listContainer.appendChild(listItem);
        });
    }

    // Função para criar o HTML de um item da lista
    function createPropertyListItem(property) {
        const listItem = document.createElement('li');
        // --- ALTERAÇÃO FEITA AQUI ---
        listItem.className = 'list-group-item list-group-item-light d-flex justify-content-between align-items-center';
        
        listItem.setAttribute('data-property-id', property.id);
        listItem.innerHTML = `
            <span class="property-name-text">${property.name}</span>
            <div>
                <button class="btn btn-sm btn-outline-secondary edit-btn" data-id="${property.id}" data-name="${property.name}">Editar</button>
                <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${property.id}">Deletar</button>
            </div>
        `;
        return listItem;
    }

    // Configura TODOS os botões de ação
    function setupActionButtons() {
        // Botão "Adicionar Nova"
        addPropertyBtn.addEventListener('click', () => {
            propertyForm.reset();
            propertyIdInput.value = '';
            modalTitle.textContent = 'Adicionar Nova Propriedade';
            propertyModal.show();
        });

        // Botão "Salvar" do Modal
        savePropertyBtn.addEventListener('click', async () => {
            if (!propertyForm.checkValidity()) {
                propertyForm.reportValidity();
                return;
            }

            const id = propertyIdInput.value;
            const name = propertyNameInput.value;
            const data = { name };

            try {
                if (id) { // Editando
                    const updatedProperty = await api.updateProperty(id, data);
                    // Atualiza a propriedade na nossa lista mestra
                    const index = allProperties.findIndex(p => p.id == id);
                    if (index !== -1) allProperties[index] = updatedProperty;

                } else { // Criando
                    const newProperty = await api.createProperty(data);
                    allProperties.push(newProperty);
                }

                // Re-ordena e re-renderiza a lista inteira para manter a consistência
                allProperties.sort((a, b) => a.name.localeCompare(b.name));
                applyFiltersAndRender();
                
                propertyModal.hide();
            } catch (error) {
                alert(`Erro ao salvar propriedade: ${error.message}`);
            }
        });

        // Delegação de eventos para botões de Editar e Deletar na lista
        listContainer.addEventListener('click', async (event) => {
            const target = event.target;
            const id = target.getAttribute('data-id');

            // Lógica para o botão EDITAR
            if (target.classList.contains('edit-btn')) {
                const name = target.getAttribute('data-name');
                
                propertyForm.reset();
                propertyIdInput.value = id;
                propertyNameInput.value = name;
                modalTitle.textContent = 'Editar Propriedade';
                propertyModal.show();
            }

            // Lógica para o botão DELETAR
            if (target.classList.contains('delete-btn')) {
                if (confirm('Tem certeza que deseja deletar esta propriedade?')) {
                    try {
                        await api.deleteProperty(id);
                        // Remove da lista mestra e re-renderiza
                        allProperties = allProperties.filter(p => p.id != id);
                        applyFiltersAndRender();
                    } catch (error) {
                        alert(`Falha ao deletar a propriedade: ${error.message}`);
                    }
                }
            }
        });
    }

    // Evento de 'input' para o campo de pesquisa
    searchInput.addEventListener('input', applyFiltersAndRender);

    initialize();
    setupActionButtons();
});