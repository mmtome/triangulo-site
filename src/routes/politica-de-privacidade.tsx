import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Header } from "@/components/triangulo/Header";
import { Footer } from "@/components/triangulo/Sections";
import { SITE } from "@/lib/site";

const TITLE = `Política de Privacidade | ${SITE.name}`;
const DESC = `Política de Privacidade da ${SITE.name}: como tratamos dados, cookies e analytics em conformidade com a LGPD.`;

export const Route = createFileRoute("/politica-de-privacidade")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:url", content: "/politica-de-privacidade" },
      { name: "robots", content: "index,follow" },
    ],
    links: [{ rel: "canonical", href: "/politica-de-privacidade" }],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="pt-28 pb-20">
        <article className="mx-auto max-w-3xl px-5 sm:px-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Voltar
          </Link>
          <h1 className="mt-6 text-3xl sm:text-4xl font-bold text-foreground">
            Política de Privacidade
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Última atualização: {new Date().toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}
          </p>

          <div className="prose prose-sm sm:prose-base mt-10 space-y-8 text-foreground">
            <Section title="1. Quem somos">
              <p>
                A {SITE.name} é uma empresa de tecnologia sediada em {SITE.city}/{SITE.region}, no{" "}
                {SITE.area}, que desenvolve sistemas personalizados, automações e soluções digitais
                para gestão de negócios. Esta política descreve, de forma clara, como tratamos dados
                pessoais coletados através deste site, em conformidade com a Lei Geral de Proteção
                de Dados (LGPD — Lei nº 13.709/2018).
              </p>
            </Section>

            <Section title="2. Dados que podem ser coletados">
              <ul className="list-disc pl-5 space-y-1.5 text-muted-foreground">
                <li>Dados de navegação: páginas visitadas, tempo de permanência, origem do acesso e dispositivo utilizado.</li>
                <li>Dados de contato fornecidos voluntariamente em mensagens enviadas via WhatsApp ou formulário, quando aplicável.</li>
                <li>Identificadores anônimos de cookies utilizados por ferramentas de análise.</li>
              </ul>
            </Section>

            <Section title="3. Finalidade da coleta">
              <p className="text-muted-foreground">
                Os dados são utilizados exclusivamente para melhorar a experiência de navegação,
                mensurar o desempenho do site, responder a contatos comerciais e oferecer soluções
                relacionadas aos serviços da {SITE.name}.
              </p>
            </Section>

            <Section title="4. Cookies e ferramentas de análise">
              <p className="text-muted-foreground">
                Utilizamos cookies essenciais ao funcionamento do site e, mediante consentimento,
                ferramentas como Google Analytics, Google Tag Manager e Meta Pixel para mensuração
                de audiência e desempenho. Você pode recusar cookies opcionais a qualquer momento
                pelo aviso de cookies exibido em sua primeira visita.
              </p>
            </Section>

            <Section title="5. Compartilhamento de dados">
              <p className="text-muted-foreground">
                Não vendemos, alugamos ou compartilhamos dados pessoais com terceiros para fins
                comerciais. Dados podem ser processados por provedores de tecnologia (analytics e
                hospedagem) sob obrigações contratuais de confidencialidade.
              </p>
            </Section>

            <Section title="6. Seus direitos">
              <p className="text-muted-foreground">
                Você pode solicitar a confirmação, acesso, correção, anonimização, portabilidade ou
                exclusão dos seus dados pessoais a qualquer momento, conforme previsto na LGPD.
                Para exercer esses direitos, entre em contato através do WhatsApp disponibilizado no
                site.
              </p>
            </Section>

            <Section title="7. Segurança">
              <p className="text-muted-foreground">
                Adotamos medidas técnicas e organizacionais razoáveis para proteger os dados
                coletados contra acesso não autorizado, perda ou alteração indevida.
              </p>
            </Section>

            <Section title="8. Alterações nesta política">
              <p className="text-muted-foreground">
                Esta política pode ser atualizada periodicamente. A versão vigente sempre será
                exibida nesta página, com a data da última atualização.
              </p>
            </Section>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-xl font-bold text-foreground">{title}</h2>
      <div className="mt-3 text-sm sm:text-base leading-relaxed">{children}</div>
    </section>
  );
}
