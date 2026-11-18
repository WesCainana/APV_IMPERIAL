/**
 * ============================================================================
 * PAINEL DE CONFIGURAÇÃO RÁPIDA — ESCOLA DE SALGADOS (MÉTODO APV)
 * ============================================================================
 */
const CONFIG_SITE = {
    // 1. LINK DE CHECKOUT DA HOTMART (Substitua pelo link oficial do seu produto na Hotmart)
    // Exemplo: "https://pay.hotmart.com/SEU_CODIGO_DE_CHECKOUT?checkoutMode=10"
    checkoutUrl: "https://wa.me/5575981998202?text=Olá, gostaria de mais informações sobre o Método APV.",

    // 2. LINK EMBED DA VSL 
    // Opção A (YouTube): "https://www.youtube.com/embed/SEU_VIDEO_ID?autoplay=1&rel=0"
    // Opção B (Hotmart): "https://player.hotmart.com/embed/SEU_ID_DO_VIDEO?autoplay=1"
    //vslEmbedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0",
    vslEmbedUrl: "midia/sal.mp4",

    // 3. ID DO PIXEL DA META (Facebook Ads) — Insira seu ID real para rastrear conversões
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

    // Preserva parâmetros UTM da URL (essencial para rastrear anúncios do Instagram/Facebook)
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

        // Dispara rastreamento de intenção de compra no Meta Pixel
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

    // Player da VSL sob demanda (carrega o iframe apenas ao clicar no play para poupar banda)
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

        // Evento customizado para medir quem assistiu à VSL via anúncios
        if (typeof fbq === "function") {
            fbq('trackCustom', 'PlayVSL', {
                content_name: 'VSL Método APV'
            });
        }
    });

    // Fecha menu mobile ao navegar
    $(".navbar-nav .nav-link").on("click", function () {
        const $navbarCollapse = $("#navbarNav");
        if ($navbarCollapse.hasClass("show")) {
            bootstrap.Collapse.getInstance($navbarCollapse[0]).hide();
        }
    });
});