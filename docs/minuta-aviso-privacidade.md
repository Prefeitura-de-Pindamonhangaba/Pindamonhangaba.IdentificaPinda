# MINUTA — Aviso de Privacidade do Identifica Pinda

**Versão de trabalho: 0.1 — 10/11/2026. Não aprovada para publicação.**

Este documento é uma proposta para avaliação da Prefeitura, do encarregado e da área jurídica. Os campos **[VALIDAR]** precisam ser preenchidos/aprovados antes de publicar. A minuta não está sendo apresentada como aviso vigente no sistema nem como termo aceito pelo usuário.

## 1. Sobre este aviso

O Identifica Pinda é uma plataforma interna da Prefeitura Municipal de Pindamonhangaba para consulta de informações cadastrais por servidores autorizados. Este aviso explica os tratamentos realizados pela plataforma e se dirige às pessoas cujos dados são consultados e aos servidores que a utilizam.

**Controlador proposto para validação:** Prefeitura Municipal de Pindamonhangaba. A Secretaria de Tecnologia, Inovação e Projetos (SETIP), por meio do Departamento de Sistemas de Informação (DSI), responde pelo suporte técnico da plataforma. **[VALIDAR as unidades responsáveis pelas finalidades de cada consulta e o papel de cada agente de tratamento.]**

## 2. Por que os dados são tratados

A plataforma oferece suporte a atividades administrativas municipais autorizadas, reunindo informações cadastrais necessárias ao procedimento declarado pelo servidor. As consultas exigem autenticação, permissão e indicação de finalidade administrativa.

**[VALIDAR e descrever as finalidades específicas, unidades autorizadas, hipóteses legais e respectivos atos, convênios ou instrumentos aplicáveis a cada atividade/fonte. Não publicar uma autorização genérica para consultar qualquer pessoa.]**

O aceite de um termo de responsabilidade pelo servidor, quando adotado, não substitui a definição da hipótese legal aplicável ao tratamento dos dados da pessoa consultada.

## 3. Quais dados podem ser tratados e de onde vêm

Conforme o serviço contratado e a atividade autorizada, podem ser consultados identificadores CPF/CNPJ, nome, dados de situação cadastral, nascimento, filiação, endereço, ocupação e informações de responsáveis e integrantes de quadro societário. A primeira fonte integrada é o Infoconv/SERPRO, conforme o perfil disponibilizado à Prefeitura.

A plataforma também trata informações de identificação e acesso dos servidores, como identificador interno, nome e papel autorizado, e registros das operações: usuário responsável, data, fonte, finalidade, resultado operacional e correlação.

**[VALIDAR as categorias efetivamente necessárias por unidade e finalidade, o serviço contratado e a origem de cada informação. Atualizar este aviso antes de ampliar o escopo para outras fontes.]**

## 4. Quem pode acessar e com quem há comunicação de dados

O acesso funcional é destinado a servidores autorizados, conforme os papéis e permissões administrados no provedor institucional Keycloak. O uso das informações deve permanecer vinculado à finalidade administrativa autorizada. Auditorias são restritas aos administradores autorizados.

Há comunicação com a fonte de consulta e com a infraestrutura necessária à autenticação e à operação do sistema. Exportações e impressões autorizadas também precisam observar os procedimentos de guarda e destinação do órgão responsável.

**[VALIDAR destinatários, operadores, prestadores de infraestrutura/proxy, contratos, possíveis transferências e as salvaguardas aplicáveis. Não afirmar ausência de compartilhamento ou de transferência sem essa avaliação.]**

## 5. Por quanto tempo as informações são mantidas

A implementação prevê validade operacional de até sete dias para reutilização temporária de respostas cadastrais, com armazenamento criptografado. Esse prazo não define a guarda dos registros de auditoria ou dos documentos administrativos produzidos a partir das consultas.

Registros de acesso, auditoria, contas e cópias de segurança devem seguir a política de retenção aprovada pela Prefeitura e as obrigações aplicáveis. A aplicação não elimina automaticamente contas ou auditorias sem essa definição.

**[VALIDAR prazos e critérios por categoria, a remoção de cópias/restaurações e a retenção dos arquivos exportados/impressos. Informar a política efetivamente adotada antes da publicação.]**

## 6. Como protegemos as informações

Os controles técnicos incluem autenticação institucional, autorização no servidor, validação de entradas, auditoria, proteção das sessões, criptografia das respostas temporárias e dos tokens de integração, limitação de consultas e tratamento de erros sem expor credenciais ou respostas completas em logs técnicos.

**[VALIDAR a implantação efetiva desses controles e o uso de TLS em todos os trechos, incluindo proxy externo e origem. Não publicar esta descrição como garantia de segurança absoluta.]**

## 7. Cookies e dados de navegação

A plataforma utiliza cookies necessários à autenticação e à manutenção da sessão. A infraestrutura de autenticação e proteção de tráfego pode utilizar mecanismos próprios. Novas sessões da versão revisada não persistem IP e User-Agent no registro de sessão; o endereço de acesso ainda pode ser usado para limitação de requisições e tratado pela infraestrutura.

**[VALIDAR inventário de cookies, logs e prestadores na instalação vigente, com finalidade, duração e responsáveis. Não confundir este aviso com um consentimento genérico para cookies ou publicidade.]**

## 8. Atendimento aos titulares e encarregado

As informações oficiais sobre proteção de dados, encarregado e canais de atendimento devem ser consultadas na [página institucional de LGPD da Prefeitura](https://pindamonhangaba.sp.gov.br/lei-geral-de-protecao-de-dados-lei-federal-n-137092018), indicada pelo responsável pelo projeto.

Para informações sobre o tratamento ou para apresentar solicitações relacionadas aos seus dados, utilize os canais informados nessa página. As solicitações serão analisadas pelo órgão responsável conforme a legislação e os procedimentos aplicáveis. A verificação de identidade, quando necessária, deve solicitar somente as informações adequadas ao atendimento.

**[VALIDAR os canais atuais, instruções de atendimento, responsabilidades e procedimentos. A leitura automática da página foi bloqueada; nenhum nome, e-mail ou telefone foi transcrito sem confirmação.]**

## 9. Atualizações deste aviso

Este aviso deve ser revisto quando houver mudanças relevantes nas finalidades, fontes, categorias de dados, prestadores ou políticas de retenção. A versão aprovada deverá informar sua data de vigência e manter o histórico de alterações disponível conforme o procedimento definido pela Prefeitura.

**[VALIDAR responsável pela aprovação/publicação, versão final, data de vigência e procedimento de atualização.]**

---

**Referências para revisão, não substitutivas da validação institucional:** [LGPD — texto atualizado](https://www2.camara.leg.br/legin/fed/lei/2018/lei-13709-14-agosto-2018-787077-normaatualizada-pl.html) e [guia da ANPD para o Poder Público](https://www.gov.br/anpd/pt-br/centrais-de-conteudo/materiais-educativos-e-publicacoes/guia_orientativo_tratamento_de_dados_pessoais_pelo_poder_publico). O inventário técnico e as pendências estão no [relatório de privacidade](privacidade-lgpd.md).
