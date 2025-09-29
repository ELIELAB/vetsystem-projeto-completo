import { api } from '../js/apiService.js';

document.addEventListener('DOMContentLoaded', async () => {
    const form = document.getElementById('case-form');
    const pageTitle = document.getElementById('page-title');
    const caseTypeInput = document.getElementById('case-type');
    const casePrescriptionInput = document.getElementById('case-prescription');
    const caseInformationInput = document.getElementById('case-information');

    const params = new URLSearchParams(window.location.search);
    const editId = params.get('id');

    // Se estiver editando, busca os dados do caso e preenche o formulário
    if (editId) {
        pageTitle.textContent = 'Editar Caso';
        try {
            const caseData = await api.getCaseById(editId);
            caseTypeInput.value = caseData.type;
            casePrescriptionInput.value = caseData.prescription;
            caseInformationInput.value = caseData.information;
        } catch (error) {
            alert(`Erro ao carregar os dados do caso: ${error.message}`);
        }
    }

    // Evento de submit do formulário
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const formData = {
            type: caseTypeInput.value,
            prescription: casePrescriptionInput.value,
            information: caseInformationInput.value
        };

        try {
            if (editId) {
                // Atualiza o caso existente
                await api.updateCase(editId, formData);
                alert('Caso atualizado com sucesso!');
            } else {
                // Cria um novo caso
                await api.createCase(formData);
                alert('Caso salvo com sucesso!');
            }
            // Redireciona de volta para a lista
            window.location.href = 'casos.html';
        } catch (error) {
            alert(`Erro ao salvar o caso: ${error.message}`);
        }
    });
});