/* Café & Grãos — carrosséis e acessibilidade */
(() => {
    "use strict";

    const movimentoReduzido = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    );

    function comportamentoRolagem() {
        const reduzir =
            movimentoReduzido.matches ||
            document.body.classList.contains("movimento-reduzido");

        return reduzir ? "auto" : "smooth";
    }

    /* ==========================================
       CARROSSEL PRINCIPAL DOS CAFÉS
       ========================================== */

    function iniciarCatalogo() {
        const grade = document.querySelector(".grade-cafes");

        if (!grade) return;

        const secao = grade.closest(".cafes") || document;

        const carrossel = document.querySelector("#modo-carrossel");
        const lista = document.querySelector("#modo-lista");
        const controles = secao.querySelector(".controles");
        const anterior = document.querySelector("#anterior");
        const proximo = document.querySelector("#proximo");

        function atualizarSetas() {
            const limite = Math.max(
                0,
                grade.scrollWidth - grade.clientWidth
            );

            if (anterior) {
                anterior.disabled = grade.scrollLeft <= 1;
            }

            if (proximo) {
                proximo.disabled = grade.scrollLeft >= limite - 1;
            }
        }

        function selecionarModo(mostrarLista) {
            grade.classList.toggle("lista", mostrarLista);

            carrossel?.setAttribute(
                "aria-pressed",
                String(!mostrarLista)
            );

            lista?.setAttribute(
                "aria-pressed",
                String(mostrarLista)
            );

            if (controles) {
                controles.hidden = mostrarLista;
            }

            grade.scrollLeft = 0;

            requestAnimationFrame(atualizarSetas);
        }

        function moverCarrossel(direcao) {
            const card = grade.querySelector(".card-cafe");

            if (!card || grade.classList.contains("lista")) {
                return;
            }

            const espaco =
                Number.parseFloat(
                    getComputedStyle(grade).columnGap
                ) || 0;

            const passo =
                card.getBoundingClientRect().width + espaco;

            grade.scrollBy({
                left: direcao * passo,
                behavior: comportamentoRolagem(),
            });
        }

        carrossel?.addEventListener("click", () => {
            selecionarModo(false);
        });

        lista?.addEventListener("click", () => {
            selecionarModo(true);
        });

        anterior?.addEventListener("click", () => {
            moverCarrossel(-1);
        });

        proximo?.addEventListener("click", () => {
            moverCarrossel(1);
        });

        grade.addEventListener("scroll", atualizarSetas, {
            passive: true,
        });

        window.addEventListener("resize", atualizarSetas);

        if ("ResizeObserver" in window) {
            const observador = new ResizeObserver(atualizarSetas);
            observador.observe(grade);
        }

        selecionarModo(false);
    }

    /* ==========================================
       FOTOS DENTRO DE CADA CARD
       ========================================== */

    function iniciarGalerias() {
        const galerias = document.querySelectorAll(".galeria-cafe");

        galerias.forEach((galeria) => {
            const fotos = [...galeria.querySelectorAll("img")];

            const anterior = galeria.querySelector(
                ".seta-foto-anterior"
            );

            const proxima = galeria.querySelector(
                ".seta-foto-proxima"
            );

            const contador = galeria.querySelector(
                ".contador-fotos"
            );

            if (
                fotos.length < 2 ||
                !anterior ||
                !proxima ||
                !contador
            ) {
                return;
            }

            let indice = 0;

            function mostrarFoto(novoIndice) {
                indice =
                    (novoIndice + fotos.length) % fotos.length;

                fotos.forEach((foto, posicao) => {
                    foto.hidden = posicao !== indice;
                });

                contador.textContent =
                    `${indice + 1} / ${fotos.length}`;
            }

            anterior.hidden = false;
            proxima.hidden = false;
            contador.hidden = false;

            anterior.addEventListener("click", () => {
                mostrarFoto(indice - 1);
            });

            proxima.addEventListener("click", () => {
                mostrarFoto(indice + 1);
            });

            mostrarFoto(0);
        });
    }

    /* ==========================================
       CARROSSEL DOS MÉTODOS DE PREPARO
       ========================================== */

    function iniciarMetodos() {
        const grade = document.querySelector("#carrossel-metodos");
        const anterior = document.querySelector("#metodo-anterior");
        const proximo = document.querySelector("#metodo-proximo");
        const controles = document.querySelector(".controles-metodos");

        if (!grade || !anterior || !proximo || !controles) {
            return;
        }

        function atualizarSetas() {
            const limite = Math.max(
                0,
                grade.scrollWidth - grade.clientWidth
            );

            anterior.disabled = grade.scrollLeft <= 1;
            proximo.disabled = grade.scrollLeft >= limite - 1;
        }

        function mover(direcao) {
            const card = grade.querySelector(".metodo");

            if (!card) return;

            const espaco =
                Number.parseFloat(
                    getComputedStyle(grade).columnGap
                ) || 0;

            const passo =
                card.getBoundingClientRect().width + espaco;

            grade.scrollBy({
                left: direcao * passo,
                behavior: comportamentoRolagem(),
            });
        }

        anterior.addEventListener("click", () => mover(-1));
        proximo.addEventListener("click", () => mover(1));

        grade.addEventListener("scroll", atualizarSetas, {
            passive: true,
        });

        grade.addEventListener("keydown", (evento) => {
            if (evento.target !== grade) return;

            if (
                evento.key === "ArrowRight" ||
                evento.key === "ArrowLeft"
            ) {
                evento.preventDefault();

                mover(evento.key === "ArrowRight" ? 1 : -1);
            }
        });

        window.addEventListener("resize", atualizarSetas);

        if ("ResizeObserver" in window) {
            const observador = new ResizeObserver(atualizarSetas);
            observador.observe(grade);
        }

        controles.hidden = false;
        atualizarSetas();
    }

    /* ==========================================
       ACESSIBILIDADE
       ========================================== */

    function iniciarAcessibilidade() {
        const aumentarFonte = document.getElementById("aumentar-fonte");
        const diminuirFonte = document.getElementById("diminuir-fonte");
        const alternarTema = document.getElementById("alternar-tema");

        const raiz = document.documentElement;
        const tamanhoOriginal = parseFloat(
            getComputedStyle(raiz).fontSize
        );

        let escalaFonte = 1;

        function atualizarFonte() {
            raiz.style.fontSize =
                `${tamanhoOriginal * escalaFonte}px`;

            if (aumentarFonte) {
                aumentarFonte.disabled = escalaFonte >= 1.4;
            }

            if (diminuirFonte) {
                diminuirFonte.disabled = escalaFonte <= 0.8;
            }

            window.dispatchEvent(new Event("resize"));
        }

        aumentarFonte?.addEventListener("click", () => {
            escalaFonte = Math.min(
                1.4,
                Math.round((escalaFonte + 0.1) * 10) / 10
            );

            atualizarFonte();
        });

        diminuirFonte?.addEventListener("click", () => {
            escalaFonte = Math.max(
                0.8,
                Math.round((escalaFonte - 0.1) * 10) / 10
            );

            atualizarFonte();
        });

        function atualizarIconeTema() {
            if (!alternarTema) return;

            const escuro =
                document.body.classList.contains("tema-escuro");

            alternarTema.textContent = escuro ? "☀️" : "🌙";

            alternarTema.setAttribute(
                "aria-label",
                escuro ? "Ativar tema claro" : "Ativar tema escuro"
            );
        }

        alternarTema?.addEventListener("click", () => {
            document.body.classList.toggle("tema-escuro");
            atualizarIconeTema();
        });

        atualizarIconeTema();
        atualizarFonte();
    }

    function iniciarPagina() {
        iniciarCatalogo();
        iniciarGalerias();
        iniciarMetodos();
        iniciarAcessibilidade();
    }

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            iniciarPagina,
            { once: true }
        );
    } else {
        iniciarPagina();
    }
})();