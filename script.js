document.addEventListener('DOMContentLoaded', () => {
    // --- LÓGICA DO MODO CLARO/ESCURO ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const sunIcon = document.getElementById('theme-icon-sun');
    const moonIcon = document.getElementById('theme-icon-moon');

    const applyTheme = (theme) => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
            sunIcon.classList.add('hidden');
            moonIcon.classList.remove('hidden');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            sunIcon.classList.remove('hidden');
            moonIcon.classList.add('hidden');
            localStorage.setItem('theme', 'light');
        }
    };

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
        applyTheme(currentTheme);
    });

    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(savedTheme || (prefersDark ? 'dark' : 'light'));

    // --- EFEITO GLASS SEMPRE ATIVO ---
    document.body.classList.add('glass-effect');

    // --- LÓGICA DOS SLIDES ---
    const slides = document.querySelectorAll('.slide');
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    const tipsBtn = document.getElementById('tipsBtn');
    const backToContactBtn = document.getElementById('backToContactBtn');
    const paginationContainer = document.getElementById('pagination');
    const tipsContainer = document.querySelector('.tips-container');
    let currentSlide = 0;
    
    // --- LÓGICA DE COPIAR E-MAIL ---
    const copyEmailBtn = document.getElementById('copyEmailBtn');
    const copyEmailText = document.getElementById('copyEmailText');
    const emailToCopy = "pedrohenrick200428@gmail.com"; // Seu e-mail aqui

    copyEmailBtn.addEventListener('click', () => {
        const tempInput = document.createElement('textarea');
        tempInput.value = emailToCopy;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);

        // Feedback visual
        copyEmailText.textContent = 'Copiado!';
        setTimeout(() => {
            copyEmailText.textContent = 'Copiar E-mail';
        }, 2000);
    });


    const techTips = [
        { category: 'Desempenho', title: 'Reinicie Regularmente', text: 'Reiniciar o computador pelo menos uma vez por semana limpa a memória e pode resolver lentidões.' },
        { category: 'Desempenho', title: 'Limpe a Área de Trabalho', text: 'Muitos arquivos na área de trabalho podem deixar seu computador mais lento para iniciar. Organize-os em pastas.' },
        { category: 'Desempenho', title: 'Desinstale o que não Usa', text: 'Programas que você não usa mais ocupam espaço e podem deixar o sistema mais lento. Desinstale-os.' },
        { category: 'Desempenho', title: 'Atalho para Travar Tarefas', text: 'Se um programa travar, aperte Ctrl + Shift + Esc para abrir o Gerenciador de Tarefas e finalizá-lo.' },
        { category: 'Desempenho', title: 'Esvazie a Lixeira', text: 'Arquivos na lixeira ainda ocupam espaço no disco. Esvazie-a regularmente para liberar espaço.' },
        { category: 'Desempenho', title: 'Limite os Programas de Inicialização', text: 'Muitos programas que iniciam com o Windows deixam o boot lento. Desative os desnecessários.' },
        { category: 'Desempenho', title: 'Use um SSD', text: 'Trocar seu HD antigo por um SSD é a melhoria de performance mais impactante que você pode fazer.' },
        { category: 'Desempenho', title: 'Mantenha Espaço Livre', text: 'Tente manter pelo menos 15% do seu disco principal livre para o sistema operar com folga.' },
        { category: 'Desempenho', title: 'Limpe Arquivos Temporários', text: 'Use a ferramenta "Limpeza de Disco" do Windows para remover arquivos inúteis que se acumulam com o tempo.' },
        { category: 'Desempenho', title: 'Feche Abas do Navegador', text: 'Muitas abas abertas no Chrome ou Firefox consomem muita memória RAM. Feche as que não estiver usando.' },
        { category: 'Segurança', title: 'Senhas Fortes e Únicas', text: 'Use senhas com letras maiúsculas, minúsculas, números e símbolos. Não repita a mesma senha em vários sites.' },
        { category: 'Segurança', title: 'Cuidado com E-mails', text: 'Não clique em links ou baixe anexos de e-mails suspeitos. Pode ser um vírus ou golpe (phishing).' },
        { category: 'Segurança', title: 'Mantenha Tudo Atualizado', text: 'Sempre que seu sistema (Windows) ou programas pedirem para atualizar, faça. As atualizações corrigem falhas de segurança.' },
        { category: 'Segurança', title: 'Backup é Essencial', text: 'Salve seus arquivos importantes em um HD externo ou na nuvem (Google Drive, OneDrive) para não perder nada.' },
        { category: 'Segurança', title: 'Antivírus Ativo', text: 'Certifique-se de que seu antivírus está sempre ativo e atualizado para se proteger de ameaças.' },
        { category: 'Segurança', title: 'Cuidado com Downloads', text: 'Baixe programas apenas de sites oficiais e confiáveis para evitar a instalação de vírus.' },
        { category: 'Segurança', title: 'Verifique a Rede Wi-Fi', text: 'Ao se conectar em redes públicas (shoppings, cafés), evite fazer transações bancárias ou colocar dados sensíveis.' },
        { category: 'Segurança', title: 'Ative a Verificação em Duas Etapas', text: 'Em contas importantes como e-mail e redes sociais, ative esta camada extra de segurança.' },
        { category: 'Segurança', title: 'Desconfie de Ofertas Milagrosas', text: 'Links que prometem prêmios ou produtos muito baratos geralmente são golpes para roubar seus dados.' },
        { category: 'Segurança', title: 'Cubra sua Webcam', text: 'Quando não estiver usando a webcam, cubra-a com um adesivo. É uma medida simples e eficaz contra espionagem.' },
        { category: 'Internet e Wi-Fi', title: 'Posição do Roteador', text: 'Deixe seu roteador de Wi-Fi em um local alto e central da casa para um sinal melhor, longe de paredes e objetos metálicos.' },
        { category: 'Internet e Wi-Fi', title: 'Reinicie o Roteador', text: 'A internet ficou lenta? Tirar o roteador da tomada por 30 segundos e ligar de novo pode resolver muitos problemas.' },
        { category: 'Internet e Wi-Fi', title: 'Senha Forte no Wi-Fi', text: 'Proteja sua rede Wi-Fi com uma senha forte para evitar que vizinhos usem sua conexão e a deixem lenta.' },
        { category: 'Internet e Wi-Fi', title: 'Use a Frequência Certa', text: 'Se seu roteador tiver redes 2.4GHz e 5GHz, use a 5GHz para dispositivos mais próximos (TV, videogame) e a 2.4GHz para os mais distantes.' },
        { category: 'Internet e Wi-Fi', title: 'Cabo de Rede é Rei', text: 'Para atividades que exigem máxima velocidade e estabilidade, como jogos online ou streaming em 4K, prefira conectar o dispositivo via cabo de rede.' },
        { category: 'Internet e Wi-Fi', title: 'Cuidado com Muitos Dispositivos', text: 'Muitos celulares, TVs e outros aparelhos conectados ao mesmo tempo podem sobrecarregar sua rede Wi-Fi.' },
        { category: 'Internet e Wi-Fi', title: 'Repetidores de Sinal', text: 'Se sua casa é grande, um repetidor de sinal pode ajudar a levar o Wi-Fi para os cômodos mais distantes.' },
        { category: 'Internet e Wi-Fi', title: 'Limpe o Cache do Navegador', text: 'Se um site específico não carrega direito, limpar o cache e os cookies do seu navegador pode resolver.' },
        { category: 'Internet e Wi-Fi', title: 'Verifique a Velocidade', text: 'Use sites como "Speedtest" ou "Fast.com" para verificar se você está recebendo a velocidade de internet que contratou.' },
        { category: 'Internet e Wi-Fi', title: 'Mantenha o Roteador Atualizado', text: 'Assim como seu computador, o roteador também tem um software (firmware) que precisa ser atualizado para melhor segurança e desempenho.' },
        { category: 'Boas Práticas e Manutenção', title: 'Limpeza Física', text: 'Mantenha o teclado e as entradas de ar do seu notebook ou computador limpos para evitar superaquecimento.' },
        { category: 'Boas Práticas e Manutenção', title: 'Cuidado com o Superaquecimento', text: 'Não use o notebook em cima de camas ou sofás, pois isso bloqueia a ventilação e pode danificar os componentes.' },
        { category: 'Boas Práticas e Manutenção', title: 'Use um Filtro de Linha', text: 'Conecte seus equipamentos em um bom filtro de linha para protegê-los contra picos de energia.' },
        { category: 'Boas Práticas e Manutenção', title: 'Organize os Cabos', text: 'Manter os cabos organizados atrás do computador melhora a ventilação e evita acidentes.' },
        { category: 'Boas Práticas e Manutenção', title: 'Desligue Corretamente', text: 'Sempre use a opção "Desligar" do menu Iniciar para encerrar o sistema de forma segura.' },
        { category: 'Boas Práticas e Manutenção', title: 'Cuidado com Líquidos', text: 'Mantenha copos e garrafas longe do seu notebook ou teclado para evitar acidentes que podem ser fatais para o aparelho.' },
        { category: 'Boas Práticas e Manutenção', title: 'Transporte com Cuidado', text: 'Ao transportar um notebook, use uma capa ou mochila apropriada para protegê-lo de impactos.' },
        { category: 'Boas Práticas e Manutenção', title: 'Não Force Conectores', text: 'Ao conectar um cabo USB ou de energia, verifique a posição correta e não force a entrada para não danificar o conector.' },
        { category: 'Boas Práticas e Manutenção', title: 'Atalho para Nova Aba', text: 'No navegador, aperte Ctrl + T para abrir uma nova aba rapidamente, sem precisar usar o mouse.' },
        { category: 'Boas Práticas e Manutenção', title: 'Atalho para Fechar Janela', text: 'Use o atalho Alt + F4 para fechar rapidamente a janela ou programa ativo.' },
        { category: 'Boas Práticas e Manutenção', title: 'Atalho para Minimizar Tudo', text: 'Aperte a Tecla do Windows + D para minimizar todas as janelas e mostrar a área de trabalho instantaneamente.' },
        { category: 'Boas Práticas e Manutenção', title: 'Atalho para Bloquear o PC', text: 'Precisa sair da mesa rapidinho? Aperte a Tecla do Windows + L para bloquear a tela e proteger sua privacidade.' },
        { category: 'Boas Práticas e Manutenção', title: 'Use Várias Áreas de Trabalho', text: 'No Windows, aperte Tecla do Windows + Tab para criar e alternar entre diferentes áreas de trabalho, organizando melhor suas tarefas.' },
        { category: 'Boas Práticas e Manutenção', title: 'Ferramenta de Captura', text: 'Use o atalho Tecla do Windows + Shift + S para abrir a ferramenta de captura e tirar um print de parte da tela.' },
        { category: 'Boas Práticas e Manutenção', title: 'Histórico da Área de Transferência', text: 'Aperte Tecla do Windows + V para ver um histórico de tudo que você copiou (Ctrl + C) e escolher o que colar.' },
        { category: 'Boas Práticas e Manutenção', title: 'Modo Noturno', text: 'Ative a "Luz Noturna" nas configurações do Windows para reduzir a luz azul da tela à noite, o que ajuda a cansar menos a vista.' },
        { category: 'Boas Práticas e Manutenção', title: 'Ajuste o Tamanho do Texto', text: 'Se as letras estão pequenas, vá em Configurações > Tela e ajuste a "Escala" para aumentar tudo na tela e facilitar a leitura.' },
        { category: 'Boas Práticas e Manutenção', title: 'Foco no Windows', text: 'Use o "Assistente de Foco" do Windows para silenciar notificações quando precisar se concentrar em uma tarefa importante.' },
        { category: 'Boas Práticas e Manutenção', 'title': 'Verifique o Espaço em Disco', text: 'Clique com o botão direito no seu Disco Local (C:) > Propriedades para ver quanto espaço livre você ainda tem.' },
        { category: 'Boas Práticas e Manutenção', title: 'Crie um Ponto de Restauração', text: 'Antes de instalar um programa novo, crie um "Ponto de Restauração". Se algo der errado, você pode voltar o sistema para como ele estava antes.' }
    ];

    function populateTips() {
        let currentCategory = "";
        tipsContainer.innerHTML = ''; 
        techTips.forEach(tip => {
            if (tip.category !== currentCategory) {
                currentCategory = tip.category;
                const categoryTitle = document.createElement('h3');
                categoryTitle.className = 'text-lg font-bold text-indigo-600 dark:text-indigo-400 pt-4';
                categoryTitle.textContent = currentCategory;
                tipsContainer.appendChild(categoryTitle);
            }
            const tipElement = document.createElement('div');
            tipElement.className = 'bg-white/50 dark:bg-slate-900/40 rounded-lg p-3 mt-2 glass-card';
            tipElement.innerHTML = `<h4 class="font-bold text-slate-700 dark:text-slate-300">${tip.title}</h4><p class="text-sm text-slate-600 dark:text-slate-400">${tip.text}</p>`;
            tipsContainer.appendChild(tipElement);
        });
    }

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.remove('active');
            if (i === index) {
                slide.classList.add('active');
            }
        });
        updatePagination(index);
        prevBtn.disabled = index === 0;
        nextBtn.disabled = index === slides.length - 1;
    }

    function updatePagination(activeIndex) {
        paginationContainer.innerHTML = '';
        slides.forEach((_, i) => {
            const dot = document.createElement('div');
            dot.classList.add('w-2.5', 'h-2.5',