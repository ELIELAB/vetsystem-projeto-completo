import { api } from '../js/apiService.js';

document.addEventListener('DOMContentLoaded', async () => {
    const form = document.getElementById('pathology-form');
    const pageTitle = document.getElementById('page-title');
    const classificationSelect = document.getElementById('classificationId');
    const nameInput = document.getElementById('name');
    const speciesSelect = document.getElementById('species');
    const clinicalSignsInput = document.getElementById('clinicalSigns');
    const examsInput = document.getElementById('exams');
    const treatmentsInput = document.getElementById('treatments');
    const observationsInput = document.getElementById('observations');

    const params = new URLSearchParams(window.location.search);
    const editId = params.get('id');

    async function populateClassifications() {
        try {
            const classifications = await api.getClassifications();
            classificationSelect.innerHTML = '<option value="" selected disabled>Selecione...</option>';
            classifications
                .sort((a, b) => a.name.localeCompare(b.name))
                .forEach(c => {
                    const option = document.createElement('option');
                    option.value = c.id;
                    option.textContent = c.name;
                    classificationSelect.appendChild(option);
                });
        } catch (error) {
            classificationSelect.innerHTML = '<option value="" disabled>Erro ao carregar</option>';
        }
    }

    await populateClassifications();

    if (editId) {
        pageTitle.textContent = 'Editar Patologia';
        try {
            const data = await api.getPathologyById(editId);
            nameInput.value = data.name;
            speciesSelect.value = data.species;
            classificationSelect.value = data.classification.id;
            clinicalSignsInput.value = data.clinicalSigns;
            examsInput.value = data.exams;
            treatmentsInput.value = data.treatments;
            observationsInput.value = data.observations;
        } catch (error) {
            alert(`Erro ao carregar dados: ${error.message}`);
        }
    }

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        if (!form.checkValidity()) return form.reportValidity();

        const formData = {
            name: nameInput.value,
            species: speciesSelect.value,
            classificationId: parseInt(classificationSelect.value),
            clinicalSigns: clinicalSignsInput.value,
            exams: examsInput.value,
            treatments: treatmentsInput.value,
            observations: observationsInput.value,
        };

        try {
            if (editId) {
                await api.updatePathology(editId, formData);
                alert('Patologia atualizada com sucesso!');
            } else {
                await api.createPathology(formData);
                alert('Patologia salva com sucesso!');
            }
            window.location.href = 'index.html';
        } catch (error) {
            alert(`Erro ao salvar: ${error.message}`);
        }
    });
});