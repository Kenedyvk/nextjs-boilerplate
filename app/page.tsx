"use client";

import { useEffect, useMemo, useState } from "react";

type Profile = "militar" | "servidor" | "colaborador";

type Step = {
  id: string;
  title: string;
  description: string;
  sector: string;
  action: string;
};

type ServiceCard = {
  code: string;
  title: string;
  description: string;
  category: string;
};

const profiles: { id: Profile; label: string; description: string }[] = [
  {
    id: "militar",
    label: "Militar",
    description: "Orientações para militares apresentados ou movimentados.",
  },
  {
    id: "servidor",
    label: "Servidor civil",
    description: "Orientações para servidores em início de exercício.",
  },
  {
    id: "colaborador",
    label: "Colaborador",
    description: "Orientações para terceirizados, estagiários e prestadores.",
  },
];

const commonSteps: Step[] = [
  {
    id: "apresentacao",
    title: "Apresente-se ao setor responsável",
    description:
      "Confirme sua chegada, receba as primeiras orientações e identifique sua chefia imediata.",
    sector: "Secretaria / Setor de destino",
    action: "Ver orientação",
  },
  {
    id: "cadastro",
    title: "Regularize seus dados e documentos",
    description:
      "Confira cadastro, contatos, documentação funcional e informações necessárias para o início das atividades.",
    sector: "Pessoal / Administração",
    action: "Ver documentos",
  },
  {
    id: "acessos",
    title: "Solicite acessos aos sistemas",
    description:
      "Peça criação ou liberação de e-mail, rede, sistemas corporativos e recursos digitais necessários.",
    sector: "Tecnologia da Informação",
    action: "Ver acessos",
  },
  {
    id: "material",
    title: "Receba materiais e identificação",
    description:
      "Verifique crachá, mobiliário, computador, telefone e outros recursos disponibilizados pelo setor.",
    sector: "Apoio / Material",
    action: "Ver materiais",
  },
  {
    id: "normas",
    title: "Conheça normas e instalações",
    description:
      "Leia as orientações essenciais e conheça os principais espaços, horários e regras de funcionamento.",
    sector: "Setor de destino",
    action: "Ver normas",
  },
  {
    id: "apoio",
    title: "Saiba onde solicitar apoio",
    description:
      "Guarde os contatos dos setores que atendem demandas administrativas, funcionais, logísticas e de TI.",
    sector: "Central de Serviços",
    action: "Ver contatos",
  },
];

const profileOverrides: Record<Profile, Partial<Record<string, Partial<Step>>>> = {
  militar: {
    apresentacao: {
      description:
        "Realize a apresentação formal, confirme sua movimentação e identifique a chefia imediata.",
    },
    cadastro: {
      description:
        "Confira assentamentos, contatos, dados bancários e demais informações da vida funcional.",
    },
  },
  servidor: {
    apresentacao: {
      description:
        "Confirme o início de exercício, receba as orientações do setor e identifique sua chefia imediata.",
    },
    cadastro: {
      description:
        "Confira cadastro funcional, contatos, benefícios e documentos exigidos para o exercício.",
    },
  },
  colaborador: {
    apresentacao: {
      description:
        "Apresente-se ao fiscal ou responsável pelo contrato e confirme o local de atuação.",
    },
    cadastro: {
      description:
        "Confira identificação, contatos, autorizações e documentos necessários para acesso às instalações.",
    },
  },
};

const services: ServiceCard[] = [
  {
    code: "FUN-01",
    title: "Vida funcional",
    description: "Férias, cadastro, benefícios, afastamentos e orientações de pessoal.",
    category: "Pessoal",
  },
  {
    code: "MIS-02",
    title: "Missões",
    description: "Diárias, passagens, documentação e apoio para cumprimento de missão.",
    category: "Missões",
  },
  {
    code: "ADM-03",
    title: "Apoio administrativo",
    description: "Material, transporte, manutenção, protocolo e serviços administrativos.",
    category: "Administração",
  },
  {
    code: "TI-04",
    title: "Tecnologia da Informação",
    description: "Acessos, equipamentos, rede, sistemas e suporte técnico.",
    category: "Tecnologia",
  },
  {
    code: "COM-05",
    title: "Comunicação",
    description: "Divulgação institucional, identidade visual, eventos e publicações.",
    category: "Comunicação",
  },
  {
    code: "SAU-06",
    title: "Solicitação de atendimento",
    description: "Encontre o setor responsável e saiba como abrir uma solicitação.",
    category: "Atendimento",
  },
];

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m21 21-4.35-4.35m2.35-5.65a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m5 12.5 4.25 4.25L19 7" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h14m-5-5 5 5-5 5" />
    </svg>
  );
}

function PrintIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 8V3h10v5M7 17h10v4H7v-4Zm-2 0H3v-7h18v7h-2M17 12h.01" />
    </svg>
  );
}

export default function Home() {
  const [profile, setProfile] = useState<Profile>("militar");
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [search, setSearch] = useState("");
  const [hydrated, setHydrated] = useState(false);

  const steps = useMemo(
    () =>
      commonSteps.map((step) => ({
        ...step,
        ...(profileOverrides[profile][step.id] ?? {}),
      })),
    [profile],
  );

  useEffect(() => {
    const savedProfile = window.localStorage.getItem("central-servicos-profile") as Profile | null;
    const initialProfile = profiles.some((item) => item.id === savedProfile)
      ? (savedProfile as Profile)
      : "militar";

    setProfile(initialProfile);

    const savedChecklist = window.localStorage.getItem(
      `central-servicos-checklist-${initialProfile}`,
    );

    if (savedChecklist) {
      try {
        setCompleted(JSON.parse(savedChecklist));
      } catch {
        setCompleted({});
      }
    }

    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    window.localStorage.setItem("central-servicos-profile", profile);
    const savedChecklist = window.localStorage.getItem(
      `central-servicos-checklist-${profile}`,
    );

    if (savedChecklist) {
      try {
        setCompleted(JSON.parse(savedChecklist));
      } catch {
        setCompleted({});
      }
    } else {
      setCompleted({});
    }
  }, [profile, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(
      `central-servicos-checklist-${profile}`,
      JSON.stringify(completed),
    );
  }, [completed, profile, hydrated]);

  const completedCount = steps.filter((step) => completed[step.id]).length;
  const progress = Math.round((completedCount / steps.length) * 100);

  const filteredServices = services.filter((service) => {
    const normalized = search.trim().toLocaleLowerCase("pt-BR");
    if (!normalized) return true;
    return [service.title, service.description, service.category, service.code]
      .join(" ")
      .toLocaleLowerCase("pt-BR")
      .includes(normalized);
  });

  function toggleStep(stepId: string) {
    setCompleted((current) => ({ ...current, [stepId]: !current[stepId] }));
  }

  function markAll() {
    setCompleted(Object.fromEntries(steps.map((step) => [step.id, true])));
  }

  function resetChecklist() {
    setCompleted({});
  }

  const selectedProfile = profiles.find((item) => item.id === profile) ?? profiles[0];

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#inicio" aria-label="Central de Serviços - início">
          <span className="brand-mark">CS</span>
          <span>
            <strong>Central de Serviços</strong>
            <small>Secretaria de Economia e Finanças</small>
          </span>
        </a>

        <nav className="header-nav" aria-label="Navegação principal">
          <a href="#checklist">Checklist</a>
          <a href="#servicos">Serviços</a>
          <a href="#contatos">Contatos</a>
        </nav>

        <span className="public-badge">
          <span className="status-dot" /> Acesso público · sem login
        </span>
      </header>

      <section className="hero" id="inicio">
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-content">
          <p className="eyebrow">Cartão de chegada à SEFA</p>
          <h1>Cheguei à SEFA. O que devo fazer primeiro?</h1>
          <p className="hero-copy">
            Selecione seu perfil e siga o checklist. O progresso fica salvo neste dispositivo
            e pode ser retomado a qualquer momento.
          </p>

          <div className="profile-selector" aria-label="Selecione seu perfil">
            {profiles.map((item) => (
              <button
                className={profile === item.id ? "profile-button active" : "profile-button"}
                key={item.id}
                onClick={() => setProfile(item.id)}
                type="button"
              >
                <span>{item.label}</span>
                <small>{item.description}</small>
              </button>
            ))}
          </div>
        </div>

        <aside className="hero-progress" aria-label="Progresso do checklist">
          <div className="progress-ring" style={{ "--progress": `${progress * 3.6}deg` } as React.CSSProperties}>
            <div>
              <strong>{progress}%</strong>
              <span>concluído</span>
            </div>
          </div>
          <div className="progress-copy">
            <span>Seu progresso</span>
            <strong>
              {completedCount} de {steps.length} etapas
            </strong>
            <small>{selectedProfile.label}</small>
          </div>
          <button className="print-button" type="button" onClick={() => window.print()}>
            <PrintIcon /> Imprimir cartão
          </button>
        </aside>
      </section>

      <section className="section checklist-section" id="checklist">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Primeiros passos</p>
            <h2>Checklist de chegada</h2>
            <p>Marque cada etapa conforme concluir. Você pode alterar o perfil sem perder o progresso anterior.</p>
          </div>
          <div className="section-actions">
            <button type="button" className="secondary-button" onClick={resetChecklist}>
              Recomeçar
            </button>
            <button type="button" className="primary-button" onClick={markAll}>
              <CheckIcon /> Marcar tudo
            </button>
          </div>
        </div>

        <div className="checklist-grid">
          {steps.map((step, index) => {
            const isCompleted = Boolean(completed[step.id]);
            return (
              <article className={isCompleted ? "check-card completed" : "check-card"} key={step.id}>
                <button
                  className="check-toggle"
                  type="button"
                  onClick={() => toggleStep(step.id)}
                  aria-pressed={isCompleted}
                  aria-label={`${isCompleted ? "Desmarcar" : "Marcar"} ${step.title}`}
                >
                  {isCompleted && <CheckIcon />}
                </button>
                <span className="step-number">{String(index + 1).padStart(2, "0")}</span>
                <div className="check-card-content">
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                  <div className="check-meta">
                    <span>{step.sector}</span>
                    <a href="#contatos">
                      {step.action} <ArrowIcon />
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {completedCount === steps.length && (
          <div className="success-banner" role="status">
            <span className="success-icon"><CheckIcon /></span>
            <div>
              <strong>Checklist concluído.</strong>
              <p>Você completou os principais passos de chegada à SEFA.</p>
            </div>
          </div>
        )}
      </section>

      <section className="section services-section" id="servicos">
        <div className="section-heading services-heading">
          <div>
            <p className="eyebrow">Outras necessidades</p>
            <h2>Encontre uma orientação</h2>
            <p>Pesquise por assunto, setor, categoria ou código do serviço.</p>
          </div>
          <label className="search-box">
            <SearchIcon />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Ex.: férias, notebook, acesso..."
              type="search"
            />
          </label>
        </div>

        <div className="services-grid">
          {filteredServices.map((service) => (
            <article className="service-card" key={service.code}>
              <div className="service-card-top">
                <span className="service-code">{service.code}</span>
                <span className="service-category">{service.category}</span>
              </div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <button type="button" className="text-button">
                Abrir orientação <ArrowIcon />
              </button>
            </article>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <div className="empty-state">
            <strong>Nenhuma orientação encontrada.</strong>
            <p>Tente pesquisar por outro termo.</p>
          </div>
        )}
      </section>

      <section className="section contacts-section" id="contatos">
        <div className="contact-panel">
          <div>
            <p className="eyebrow">Precisa de ajuda?</p>
            <h2>Contatos essenciais</h2>
            <p>
              Use os canais institucionais definidos pela SEFA. Os dados abaixo são campos de exemplo
              e devem ser substituídos pelos contatos oficiais antes da publicação definitiva.
            </p>
          </div>

          <div className="contact-list">
            <div>
              <span>Pessoal / Administração</span>
              <strong>Ramal a definir</strong>
            </div>
            <div>
              <span>Tecnologia da Informação</span>
              <strong>Ramal a definir</strong>
            </div>
            <div>
              <span>Apoio / Material</span>
              <strong>Ramal a definir</strong>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <div>
          <strong>Central de Serviços</strong>
          <span>Orientações para quem chega e para quem já faz parte da SEFA.</span>
        </div>
        <span>Versão inicial para validação institucional</span>
      </footer>
    </main>
  );
}
