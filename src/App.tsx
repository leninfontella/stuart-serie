import { useState, useEffect } from "react";
import {
  X,
  Instagram,
  Youtube,
  Music2,
  Facebook,
  Twitch,
  Tv2Icon,
  Play,
  ChevronDown,
  Sparkles,
} from "lucide-react";

// ✅ Declare AOS global
declare global {
  interface Window {
    AOS?: {
      refresh: () => void;
      init: (options?: {
        duration?: number;
        once?: boolean;
        offset?: number;
        easing?: string;
      }) => void;
    };
  }
}

const navigationItems = [
  { name: "Home", target: "#home" },
  { name: "Trailer", target: "#trailer" },
  { name: "Visão Geral", target: "#personagens" },
  { name: "Relacionados", target: "#relacionados" },
];

// ✅ Hook para Lazy Loading (com HMR support)
function useLazyLoad() {
  useEffect(() => {
    const images = document.querySelectorAll("img[data-src]");

    if (images.length === 0) return;

    const imageObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            const src = img.getAttribute("data-src");

            if (src) {
              img.src = src;
              img.removeAttribute("data-src");
              img.classList.add("loaded");
              imageObserver.unobserve(img);
            }
          }
        });
      },
      {
        rootMargin: "50px", // Começa a carregar 50px antes de aparecer
      },
    );

    images.forEach((img) => imageObserver.observe(img));

    return () => {
      imageObserver.disconnect(); // ✅ Limpa corretamente em HMR
    };
  }, []);
}

function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  // ✅ Scroll & Reading Progress handler
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 20);

      // Progresso de leitura da página (0 a 100%)
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.min(
          100,
          Math.max(0, (currentScrollY / totalHeight) * 100),
        );
        setScrollProgress(progress);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ✅ ScrollSpy: Atualiza o item ativo do menu conforme o usuário rola a página
  useEffect(() => {
    const sectionTargets = navigationItems.map((item) => item.target);

    const handleScrollSpy = () => {
      const scrollPosition = window.scrollY + 120; // 120px offset do topo/header

      for (let i = sectionTargets.length - 1; i >= 0; i--) {
        const section = document.querySelector(sectionTargets[i]) as HTMLElement;
        if (section) {
          const sectionTop = section.offsetTop;
          if (scrollPosition >= sectionTop) {
            setActiveItem(i);
            break;
          }
        }
      }
    };

    // Executa na montagem e no scroll
    handleScrollSpy();
    window.addEventListener("scroll", handleScrollSpy, { passive: true });

    return () => window.removeEventListener("scroll", handleScrollSpy);
  }, []);

  // ✅ Parallax scrolling refinado no hero
  useEffect(() => {
    let animationFrameId: number | null = null;

    const handleParallax = () => {
      const heroImage = document.querySelector(
        ".hero-image",
      ) as HTMLImageElement;
      const heroSection = document.querySelector(".hero") as HTMLElement;
      if (heroSection && heroImage) {
        const scrolled = window.scrollY;
        const heroHeight = heroSection.offsetHeight;

        if (scrolled <= heroHeight) {
          const offset = scrolled * 0.45;
          const scale = 1.05 + (scrolled / heroHeight) * 0.08;
          heroImage.style.transform = `translate3d(0, ${offset}px, 0) scale(${scale})`;
        }
      }
    };

    const onScroll = () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      animationFrameId = requestAnimationFrame(handleParallax);
    };

    handleParallax();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  // ✅ Inicializar AOS (Animate On Scroll) com HMR support
  useEffect(() => {
    if (window.AOS) {
      const aos = window.AOS;
      setTimeout(() => {
        aos.refresh();
      }, 100);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://unpkg.com/aos@next/dist/aos.js";
    script.async = true;
    script.onload = () => {
      const aos = window.AOS;
      if (!aos) return;

      setTimeout(() => {
        aos.init({
          duration: 1000,
          once: false,
          offset: 100,
          easing: "ease-in-out-cubic",
        });
      }, 100);
    };
    document.head.appendChild(script);

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/aos@next/dist/aos.css";
    document.head.appendChild(link);

    return () => {
      if (link.parentNode) {
        document.head.removeChild(link);
      }
    };
  }, []);

  // ✅ Smooth Scroll com Desconto da Barra de Navegação
  const handleSmoothScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    targetSelector: string,
    index: number,
  ) => {
    e.preventDefault();
    setActiveItem(index);
    setMobileMenuOpen(false);

    const targetElement = document.querySelector(targetSelector);
    if (targetElement) {
      const headerOffset = 70;
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  useLazyLoad();

  return (
    <main className="series-page">
      {/* Header Modernizado com Indicador de Scroll Smooth */}
      <header className={`site-header ${isScrolled ? "scrolled" : ""}`}>
        <div
          className="scroll-progress-bar"
          style={{ width: `${scrollProgress}%` }}
          aria-hidden="true"
        />

        <div className="header-container">
          <a
            className="site-mark"
            href="#home"
            onClick={(e) => handleSmoothScroll(e, "#home", 0)}
            aria-label="Stuart NÃO CONSEGUE salvar o UNIVERSO, início"
          >
            <img
              src="/images/stuart-logo.png"
              alt="Stuart NÃO CONSEGUE salvar o UNIVERSO"
              className="mark-logo-img"
            />
          </a>

          {/* Botão Hambúrguer Mobile */}
          <button
            className={`mobile-toggle ${mobileMenuOpen ? "open" : ""}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={mobileMenuOpen}
          >
            <span />
            <span />
            <span />
          </button>

          {/* Navegação Principal */}
          <nav
            className={`nav-wrapper ${mobileMenuOpen ? "mobile-visible" : ""}`}
            aria-label="Navegação principal"
          >
            <ul className="site-nav">
              {navigationItems.map((item, index) => (
                <li key={item.name}>
                  <a
                    className={`nav-link ${activeItem === index ? "active" : ""}`}
                    href={item.target}
                    onClick={(e) =>
                      handleSmoothScroll(e, item.target, index)
                    }
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      {/* Seção Hero com Entrance Animation & Parallax */}
      <section
        className="hero"
        id="home"
        aria-label="Stuart não consegue salvar o universo"
      >
        <img
          className="hero-image hero-entrance-bg"
          src="/images/imagehero.jpeg"
          alt="Stuart não consegue salvar o universo"
        />
        <div className="hero-shade" aria-hidden="true" />

        {/* Scroll Indicator */}
        <a
          href="#trailer"
          className="scroll-indicator hero-animate-5"
          onClick={(e) => handleSmoothScroll(e, "#trailer", 1)}
          aria-label="Rolar para o trailer"
        >

          <ChevronDown className="scroll-chevron" size={20} />
        </a>
      </section>

      {/* Seção Trailer */}
      <section
        className="trailer-section"
        id="trailer"
        aria-label="Trailer oficial"
        data-aos="fade-up"
        data-aos-duration="1000"
      >
        <h2 className="trailer-title" data-aos="fade-up" data-aos-delay="100">
          Trailer oficial
        </h2>
        <div
          className="trailer-frame"
          data-aos="zoom-in"
          data-aos-delay="200"
          data-aos-duration="800"
        >
          <iframe
            src="https://www.youtube.com/embed/X_EW1a53GHE?rel=0"
            title="Trailer oficial"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      </section>

      {/* Seção Visão Geral (Overview) */}
      <section
        className="overview-section"
        id="personagens"
        aria-labelledby="overview-title"
      >
        <div className="overview-container">
          {/* Cabeçalho com Título/Banner em Imagem */}
          <div
            className="overview-header"
            data-aos="fade-up"
            data-aos-duration="1200"
          >
            <div className="overview-banner">
              <img
                className="overview-title-image"
                src="/images/stuart-title.png"
                alt="Stuart não consegue salvar o universo"
              />
            </div>
            <h2 id="overview-title" className="overview-section-label">
              Visão Geral
            </h2>
          </div>

          {/* Card Principal */}
          <div
            className="overview-card"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <div className="overview-content">
              <p className="overview-description">
                É uma <span>NOVA JORNADA</span> para Stuart Bloom, o relutante
                dono da loja de quadrinhos. Acidentalmente imbuído de um poder
                cósmico que ele mal compreende, Stuart agora deve tentar (e
                provavelmente falhar) salvar o universo de ameaças bizarras de
                uma dimensão paralela baseada em convenções de ficção científica
                mal-sucedidas. Mas esta transformação também pode ser a única
                coisa capaz de deter uma nova e cômica ameaça cósmica que
                ninguém consegue levar a sério.
              </p>

              {/* Grid de Informações de Ficha Técnica */}
              <div className="overview-grid">
                <div className="detail-item">
                  <span className="detail-label">PRODUTORES EXECUTIVOS</span>
                  <span className="detail-value">
                    Chuck Lorre, Bill Prady, Zak Penn
                  </span>
                </div>

                <div className="detail-item">
                  <span className="detail-label">SHOWRUNNERS</span>
                  <span className="detail-value">Zak Penn, Chuck Lorre</span>
                </div>

                <div className="detail-item">
                  <span className="detail-label">CRIADO POR</span>
                  <span className="detail-value">
                    Chuck Lorre, Zak Penn, Bill Prady
                  </span>
                </div>

                <div className="detail-item highlight-item">
                  <span className="detail-label">DATA DE LANÇAMENTO</span>
                  <span className="detail-value launch-date">
                    23 de julho de 2026
                  </span>
                </div>

                <div className="detail-item cast-item">
                  <span className="detail-label">ELENCO</span>
                  <span className="detail-value">
                    Kevin Sussman, Brian Posehn, Lauren Lapkus, Michael Mando,
                    Mark Ruffalo
                  </span>
                </div>

                <div className="detail-item">
                  <span className="detail-label">RELACIONADO COM</span>
                  <span className="detail-value tag-badge">
                    The Big Bang Theory
                  </span>
                </div>
              </div>
            </div>

            {/* Poster em Destaque */}
            <div className="overview-poster-wrapper">
              <img
                className="overview-poster-img"
                src="/images/visaogeral.jpeg"
                alt="Stuart em meio ao universo dos quadrinhos"
              />
              <div className="poster-overlay" />
            </div>
          </div>
        </div>
      </section>

      {/* Seção Séries Relacionadas */}
      <section
        className="related-section"
        id="relacionados"
        aria-labelledby="related-title"
      >
        <div className="related-container">
          <h2 id="related-title" data-aos="fade-up">
            RELATED SERIES
          </h2>
          <div className="related-grid">
            <article
              className="related-card"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <div className="poster-placeholder">
                <img src="/images/bigbang.jpeg" alt="The Big Bang Theory" />
              </div>
              <h3>The Big Bang Theory</h3>
              <p>2007</p>
            </article>
            <article
              className="related-card"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <div className="poster-placeholder">
                <img src="/images/young.jpeg" alt="Young Sheldon" />
              </div>
              <h3>Young Sheldon</h3>
              <p>2017</p>
            </article>

            <article
              className="related-card"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <div className="poster-placeholder">
                <img
                  src="/images/georgie.jpeg"
                  alt="Georgie & Mandy's First Marriage"
                />
              </div>
              <h3>Georgie &amp; Mandy's First Marriage</h3>
              <p>2024</p>
            </article>
          </div>
        </div>
      </section>

      {/* Seção Vídeo em Loop com Efeito Sombreado & Divisor Cósmico */}
      <section
        className="loop-video-section"
        aria-label="Vídeo do portal"
        data-aos="fade"
        data-aos-duration="1200"
      >
        {/* Sombra de transição superior */}
        <div className="loop-video-shade-top" aria-hidden="true" />

        <video
          className="loop-video"
          src="/images/portal.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-label="Portal de Stuart"
        />

        {/* Efeito Sombreado Inferior (entre o vídeo e o footer) */}
        <div className="loop-video-shade-bottom" aria-hidden="true">
          <div className="shade-vignette" />
          <div className="shade-cosmic-glow" />
        </div>

        {/* Divisor Visual Cósmico Premium */}
        <div className="portal-divider-bar" aria-hidden="true">
          <div className="divider-line" />
          <div className="divider-center-badge">
            <Sparkles size={16} className="divider-sparkle" />
          </div>
          <div className="divider-line" />
        </div>
      </section>

      {/* Footer */}
      <footer className="site-footer">
        <div className="footer-logo" aria-label="Stuart">
          <img src="/images/stuart-logo.png" alt="STUART" />
        </div>

        <div className="footer-promo">
          <div className="footer-promo-action">
            <Tv2Icon size={26} strokeWidth={1.8} aria-hidden="true" />
            <strong>RECEBER ATUALIZAÇÕES </strong>
          </div>
          <p>
            Receba os anúncios mais recentes sobre a série, novidades, eventos
            especiais e muito mais do universo Stuart.
          </p>
        </div>

        <div className="footer-socials" aria-label="Redes sociais">
          <a href="#x" aria-label="X">
            <X size={18} />
          </a>
          <a href="#instagram" aria-label="Instagram">
            <Instagram size={18} />
          </a>
          <a href="#youtube" aria-label="YouTube">
            <Youtube size={18} />
          </a>
          <a href="#tiktok" aria-label="TikTok">
            <Music2 size={18} />
          </a>
          <a href="#facebook" aria-label="Facebook">
            <Facebook size={18} />
          </a>
          <a href="#twitch" aria-label="Twitch">
            <Twitch size={18} />
          </a>
        </div>

        <nav className="footer-links" aria-label="Links institucionais">
          <a href="#corporativo">Corporativo</a>
          <a href="#privacidade">Privacidade</a>
          <a href="#cookies">Configurações de cookie</a>
          <a href="#politica-de-cookies">Política de cookies</a>
          <a href="#juridico">Jurídico</a>
          <a href="#privacidade-pessoal">
            Não vender nem compartilhar as minhas informações pessoais
          </a>
        </nav>

        <div className="footer-rating">
          <div className="rating-badge">
            VERIFIQUE A<br />
            CLASSIFICAÇÃO
            <br />
            INDICATIVA
          </div>
          <p>
            Pode incluir conteúdo inapropriado para crianças.
            <br />
            <u>Acesse gov.br</u> para ver informações da classificação
            indicativa.
          </p>
        </div>
      </footer>
    </main>
  );
}

export default App;
