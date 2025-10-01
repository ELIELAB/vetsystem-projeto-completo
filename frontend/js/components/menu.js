// Função que será executada assim que o script for carregado
(() => {
    // 1. Onde o menu deve ser inserido? Buscamos o placeholder no HTML.
    const navbarPlaceholder = document.getElementById('navbar-placeholder');
    if (!navbarPlaceholder) {
        console.error("Elemento #navbar-placeholder não encontrado. O menu não pode ser carregado.");
        return;
    }

    // 2. Define o HTML completo do seu menu em uma string.
    const menuHTML = `
    <nav class="navbar navbar-expand-lg bg-primary shadow-sm" data-bs-theme="dark">
        <div class="container-fluid">
            <a class="navbar-brand fw-bold" href="index.html">
                <i class="bi bi-heart-pulse-fill"></i>
                VetSystem
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item">
                        <a class="nav-link" href="index.html"><i class="bi bi-bug-fill"></i> Patologias</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="casos.html"><i class="bi bi-journal-text"></i> Casos Dia a Dia</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="fitoterapia.html"><i class="bi bi-flower1"></i> Fitoterapia</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="calculator.html"><i class="bi bi-calculator-fill"></i> Calculadora</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="parametros.html"><i class="bi bi-table"></i> Parâmetros</a>
                    </li>
                </ul>
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="bi bi-gear-fill"></i> Gerenciar
                        </a>
                        <ul class="dropdown-menu dropdown-menu-end">
                            <li><a class="dropdown-item" href="propriedades.html"><i class="bi bi-list-check"></i> Gerenciar Propriedades</a></li>
                            <li><a class="dropdown-item" href="doencas-tratadas.html"><i class="bi bi-list-task"></i> Gerenciar Doenças</a></li>
                            <li><a class="dropdown-item" href="classificacoes.html"><i class="bi bi-list-task"></i> Gerenciar Classificações</a></li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
    `;

    // 3. Insere o HTML do menu no placeholder.
    navbarPlaceholder.innerHTML = menuHTML;

    // 4. Lógica para destacar o link da página atual.
    const currentPage = window.location.pathname.split('/').pop();
    if (currentPage) {
        // Encontra o link no menu que corresponde à página atual
        const activeLink = navbarPlaceholder.querySelector(`.nav-link[href="${currentPage}"]`);
        if (activeLink) {
            activeLink.classList.add('active'); // Adiciona a classe 'active' do Bootstrap
            activeLink.setAttribute('aria-current', 'page');
        }
    }
})();
