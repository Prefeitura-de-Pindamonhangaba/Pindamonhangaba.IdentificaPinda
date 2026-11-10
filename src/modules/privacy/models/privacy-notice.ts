export type NoticePart = { readonly text: string; readonly href?: string };
export type PrivacyNotice = {
  readonly version: string;
  readonly publishedOn: string;
  readonly title: string;
  readonly sourceUrl: string;
  readonly sections: readonly {
    readonly title: string;
    readonly paragraphs: readonly (readonly NoticePart[])[];
  }[];
};

export const PRIVACY_NOTICE: PrivacyNotice = {
  version: "1.0",
  publishedOn: "2026-11-10",
  title: "Aviso de Privacidade do Identifica Pinda",
  sourceUrl: "https://www.pindamonhangaba.sp.gov.br/politica-de-privacidade",
  sections: [
    {
      title: "1. Responsável e finalidade",
      paragraphs: [
        [
          {
            text: "O Identifica Pinda é uma plataforma interna da Prefeitura Municipal de Pindamonhangaba, com suporte técnico da SETIP/DSI, destinada a consultas cadastrais por servidores autorizados.",
          },
        ],
        [
          {
            text: "Os dados devem ser utilizados somente nas atividades administrativas autorizadas, com autenticação, permissão e finalidade registrada. O acesso não autoriza consultas por interesse pessoal. A Prefeitura deve definir as finalidades específicas e hipóteses legais de cada atividade.",
          },
        ],
      ],
    },
    {
      title: "2. Dados tratados e acesso",
      paragraphs: [
        [
          {
            text: "Conforme o serviço contratado e a finalidade, podem ser consultados CPF/CNPJ, nome, situação cadastral, nascimento, filiação, endereço, ocupação e informações de responsáveis e sócios. A primeira fonte integrada é o Infoconv/SERPRO.",
          },
        ],
        [
          {
            text: "Também são tratados identificador, nome e papel dos servidores e registros das operações, como data, fonte, finalidade e resultado. Os acessos são administrados no Keycloak; a auditoria é restrita aos administradores autorizados.",
          },
        ],
        [
          {
            text: "Há comunicação com as fontes e serviços necessários à autenticação e à operação. Destinatários, prestadores e condições de compartilhamento devem ser confirmados pela Prefeitura.",
          },
        ],
      ],
    },
    {
      title: "3. Armazenamento e proteção",
      paragraphs: [
        [
          {
            text: "A implementação prevê respostas temporárias criptografadas com validade operacional de até sete dias. Esse prazo não define a guarda de auditorias, contas, documentos ou backups, que depende de política institucional e das obrigações aplicáveis.",
          },
        ],
        [
          {
            text: "Os controles incluem proteção das sessões, autorização no servidor, auditoria, criptografia e limitação de consultas.",
          },
        ],
      ],
    },
    {
      title: "4. Cookies e serviços externos",
      paragraphs: [
        [
          {
            text: "Cookies sustentam a autenticação e a sessão; bloqueá-los pode impedir o acesso. A infraestrutura de autenticação e proteção de tráfego pode manter mecanismos e registros próprios.",
          },
        ],
        [
          {
            text: "O Identifica Pinda não integra publicidade ou análise de audiência. Serviços futuros exigirão avaliação e atualização deste aviso. Páginas externas acessadas por links possuem regras próprias.",
          },
        ],
      ],
    },
    {
      title: "5. Atendimento e encarregado",
      paragraphs: [
        [
          {
            text: "Para informações sobre o tratamento ou solicitações relativas aos seus dados, consulte o encarregado e os canais disponíveis na ",
          },
          {
            text: "página institucional de LGPD da Prefeitura",
            href: "https://pindamonhangaba.sp.gov.br/lei-geral-de-protecao-de-dados-lei-federal-n-137092018",
          },
          {
            text: ".",
          },
        ],
        [
          {
            text: "As solicitações serão analisadas conforme a legislação e os procedimentos aplicáveis, com verificação de identidade quando necessária.",
          },
        ],
      ],
    },
    {
      title: "6. Responsabilidades e atualizações",
      paragraphs: [
        [
          {
            text: "Os servidores devem preservar suas credenciais individuais, registrar referências administrativas sem dados pessoais desnecessários e proteger resultados, exportações e impressões. Suspeitas de uso indevido devem ser encaminhadas aos responsáveis institucionais.",
          },
        ],
        [
          {
            text: "Este aviso deverá ser revisto quando houver alterações relevantes no tratamento. O aceite de um termo pelo servidor não substitui a hipótese legal aplicável aos dados consultados.",
          },
        ],
      ],
    },
  ],
};
