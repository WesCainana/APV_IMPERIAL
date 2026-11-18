/**
 * ============================================================================
 * PAINEL DE CONFIGURAÇÃO RÁPIDA — ESCOLA DE SALGADOS (MÉTODO APV)
 * ============================================================================
 * Edite apenas os valores abaixo para conectar seu WhatsApp, Kiwify, VSL e Pixel.
 */
const CONFIG_SITE = {
    // 1. LINK DE CHECKOUT (Por hora WhatsApp; depois basta colar o link da Kiwify)
    checkoutUrl: "https://wa.me/5500000000000?text=Ol%C3%A1!%20Quero%20garantir%20minha%20vaga%20no%20M%C3%A9todo%20APV%20da%20Escola%20de%20Salgados!",

    // 2. LINK EMBED DA VSL (Cole a URL de incorporação do YouTube, Vimeo ou Panda Video)
    // Exemplo YouTube: "https://www.youtube.com/embed/SEU_VIDEO_ID?autoplay=1&rel=0"
    vslEmbedUrl: "midia/sal.mp4?autoplay=1&rel=0",

    // 3. ID DO PIXEL DA META (Ex: "123456789012345" — deixe "" enquanto não ativar)
    metaPixelId: "",

    // 4. VALOR DO PRODUTO PARA RASTREAMENTO
    productValue: 197.00,
    productCurrency: "BRL"
};

/* ============================================================================
 * INICIALIZAÇÃO DO PIXEL DA META (FACEBOOK ADS)
 * ============================================================================ */
(function initMetaPixel(pixelId) {
    if (!pixelId) return;

    !function(f,b,e,v,n,t,s) {
        if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)
    }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

    fbq('init', pixelId);
    fbq('track', 'PageView');
})(CONFIG_SITE.metaPixelId);

/* ============================================================================
 * LÓGICA DA PÁGINA (jQuery)
 * ============================================================================ */
$(document).ready(function () {
    // Atualiza ano automático no rodapé
    $("#currentYear").text(new Date().getFullYear());

    // Preserva parâmetros UTM da URL atual para repassar ao checkout (Kiwify/WhatsApp)
    function buildCheckoutUrlWithUtms(baseUrl) {
        const currentParams = window.location.search;
        if (!currentParams) return baseUrl;
        const separator = baseUrl.includes("?") ? "&" : "?";
        return baseUrl + separator + currentParams.substring(1);
    }

    const finalCheckoutUrl = buildCheckoutUrlWithUtms(CONFIG_SITE.checkoutUrl);

    // Aplica o destino nos botões de compra e dispara evento InitiateCheckout
    $(".btn-checkout").attr("href", finalCheckoutUrl).attr("target", "_blank").attr("rel", "noopener");

    $(".btn-checkout").on("click", function () {
        const buttonOrigin = $(this).data("origin") || "botao-pagina";

        // Dispara evento padrão do Meta Pixel
        if (typeof fbq === "function") {
            fbq('track', 'InitiateCheckout', {
                content_name: 'Método APV - Escola de Salgados',
                content_category: 'Treinamento Online',
                value: CONFIG_SITE.productValue,
                currency: CONFIG_SITE.productCurrency,
                button_origin: buttonOrigin
            });
        }
    });

    // Player da VSL sob demanda (carrega iframe apenas ao clicar para manter velocidade)
    $("#btnPlayVsl, #vslCover").on("click", function () {
        const $cover = $("#vslCover");
        const $target = $("#vslEmbedTarget");

        const iframeHtml = `<iframe 
            src="${CONFIG_SITE.vslEmbedUrl}" 
            title="VSL Método APV - Escola de Salgados"
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen 
            style="width:100%; height:100%; border:0;">
        </iframe>`;

        $target.html(iframeHtml).removeClass("d-none");
        $cover.fadeOut(250);

        // Evento personalizado de visualização da VSL no Pixel
        if (typeof fbq === "function") {
            fbq('trackCustom', 'PlayVSL', {
                content_name: 'VSL Método APV'
            });
        }
    });

    // Fecha menu mobile automaticamente ao clicar em um link de navegação
    $(".navbar-nav .nav-link").on("click", function () {
        const $navbarCollapse = $("#navbarNav");
        if ($navbarCollapse.hasClass("show")) {
            bootstrap.Collapse.getInstance($navbarCollapse[0]).hide();
        }
    });
});