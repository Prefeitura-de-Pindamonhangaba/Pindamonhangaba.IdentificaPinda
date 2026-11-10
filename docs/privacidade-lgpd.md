# Proteção de dados e revisão LGPD

Revisão técnica: 10/11/2026.

Esta revisão reforça controles técnicos do Identifica Pinda. **Não é uma certificação de conformidade jurídica.** Finalidades, hipóteses legais, transparência, atendimento aos titulares e prazos documentais precisam de definição pela Prefeitura, com o encarregado e a área jurídica.

Referências: [LGPD, texto atualizado na Câmara dos Deputados](https://www2.camara.leg.br/legin/fed/lei/2018/lei-13709-14-agosto-2018-787077-normaatualizada-pl.html), especialmente arts. 6º, 7º, 15–16, 23, 37 e 46; [guia da ANPD para o Poder Público](https://www.gov.br/anpd/pt-br/centrais-de-conteudo/materiais-educativos-e-publicacoes/guia_orientativo_tratamento_de_dados_pessoais_pelo_poder_publico).

## Dados tratados e limites

| Dados                      | Uso e proteção no código                                                                                                                                    | Retenção                                                                                  |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| CPF/CNPJ de busca          | Enviado por POST, validado no servidor; auditoria guarda máscara e HMAC com chave privada                                                                   | Documento completo somente no resultado/cache protegido                                   |
| Respostas Infoconv         | Adapter isolado, permissões no servidor, cache AES-256-GCM com contexto autenticado                                                                         | Até sete dias de validade, conforme decisão já registrada do responsável                  |
| Finalidade da consulta     | Obrigatória; bloqueia CPFs/CNPJs válidos reconhecidos no texto e orienta evitar nomes e outros dados pessoais                                               | Política da auditoria ainda precisa ser formalizada                                       |
| Auditoria de consultas     | Usuário interno, data, fonte, finalidade, operação e correlação; somente administradores acessam                                                            | Sem expurgo automático até definição da política documental                               |
| Leitura da auditoria       | Gera evento administrativo, sem copiar o conteúdo lido                                                                                                      | Mesma pendência da auditoria                                                              |
| Exportação/impressão       | Revalida titularidade do registro e permissões; exige integridade e validade; evento correlacionado a cada consulta                                         | Arquivos baixados e impressões saem do controle técnico da aplicação                      |
| Identidade do servidor     | UUID interno, vínculo issuer/sub, nome e papel sincronizados do Keycloak; e-mail técnico, sem exigir e-mail institucional                                   | Conta preservada por vínculos de auditoria; política de desativação/arquivamento pendente |
| Sessão e tokens            | Cookies protegidos, tokens OAuth criptografados; novas sessões não persistem IP nem User-Agent                                                              | Sessões de até oito horas; estado vencido eliminado periodicamente                        |
| Estado OAuth e limitadores | Necessários à autenticação/limitação, sem log do conteúdo                                                                                                   | Estado vencido e contadores fora da janela são removidos                                  |
| Dados na tela              | Somente memória; botão Limpar dados da tela; descarte ao receber 401/403; saída entre abas quando suportada pelo navegador e recarga ao restaurar histórico | Até limpar, sair ou encerrar a página; não há cópia em localStorage/sessionStorage        |

O HMAC é **pseudonimização**, não anonimização. A máscara e a finalidade também podem identificar pessoas no contexto de um processo. Não trate auditorias como dados públicos.

A detecção de documentos na finalidade reduz inclusão acidental, mas não identifica todos os dados pessoais possíveis, como nomes e informações de saúde. A orientação ao servidor e o controle administrativo continuam necessários. Nenhum dado histórico é reescrito silenciosamente.

A limpeza periódica remove registros operacionais vencidos, não contas nem auditorias, e continua com a fonte desligada ou sem a chave de descriptografia. A disponibilidade do cache cessa no vencimento; a remoção física periódica pode ocorrer no minuto seguinte enquanto o processo estiver ativo. Quando o sistema estiver parado, execute a manutenção ao retomar e não restaure respostas expiradas de backups. Backups devem excluir o conteúdo de `consultation_cache`, conforme [operação](operacao.md).

## Controles revisados

- Autorização central no servidor e papéis obtidos de ID token validado; ausência de permissão nega acesso. A consulta exige finalidade e permissão por fonte/tipo. A atualização forçada e a auditoria continuam administrativas.
- Exportações recusam registros de outro usuário, assinaturas alteradas, IDs repetidos, datas inválidas/futuras e resultados vencidos. A auditoria da exportação registra IDs de correlação, não CPF, nome ou a resposta.
- A API de auditoria não entrega o HMAC do documento, pois a interface não precisa dele. Erros técnicos e logs não recebem respostas cadastrais, credenciais ou tokens.
- A resposta pública de sessão entrega somente IDs, nome e expiração. Token de sessão, IP, User-Agent e atributos internos não são enviados novamente em JSON. A API interna do SDK permanece disponível ao servidor.
- Ao sair, há navegação completa e sinalização sem dados pessoais às demais abas via BroadcastChannel, quando disponível. O servidor solicita limpeza de cache/storage sem apagar cookies de outros sistemas do domínio. Sessões do SSO institucional permanecem sob controle do Keycloak.
- O histórico de navegação não deve reapresentar um painel congelado sem revalidar a sessão. Ao retornar de BFCache, o painel recarrega. Os headers proíbem indexação, enquadramento e objetos incorporados. A CSP aplicada é parcial; não equivale a uma política completa de scripts.
- Download, cópia manual, captura de tela e impressão por ferramentas do navegador não podem ser impedidos de forma confiável pelo sistema. Exportações autorizadas exigem armazenamento/destinação administrativa adequada fora da aplicação.

## Pendências da Prefeitura

1. Registrar finalidades e hipóteses legais específicas por serviço/fonte e por atividade autorizada, inclusive o instrumento aplicável ao Infoconv. O campo de justificativa e o acesso técnico não substituem essa definição.
2. Publicar aviso de privacidade com controlador, encarregado/canal oficial, categorias de dados, usos, compartilhamentos, retenção e orientação para exercício de direitos. Nenhum contato ou fundamento foi inventado pelo código.
3. Formalizar retenção da auditoria, contas desativadas e backups. O prazo de sete dias é a decisão operacional do cache, não um prazo imposto pela LGPD nem autorização para apagar documentos administrativos.
4. Definir um termo de uso/responsabilidade do servidor e sua aprovação, versionamento e comprovação do aceite. **Aceite do servidor não é consentimento do cidadão consultado nem substitui uma hipótese legal de tratamento.** O mecanismo de aceite ainda depende da decisão de escopo e do texto aprovado.
5. Revisar periodicamente grupos e papéis no Keycloak, acessos por unidade e necessidade de cada campo do perfil contratado. A aplicação preserva as funcionalidades contratadas; não presumiu que todos os campos têm a mesma necessidade para todos os setores.
6. Avaliar operadores externos que recebem tráfego/telemetria, incluindo Cloudflare, e os contratos correspondentes. A instalação atual exige adequar Full (strict) por hostname para TLS também no trecho Cloudflare–origem; a regra de redirecionamento do Nginx não criptografa esse trecho. Restringir a publicação privada de 3000 à rede autorizada ou usar somente a rede Docker.
7. Estabelecer atendimento aos titulares e resposta a incidentes, com responsáveis, evidências protegidas e avaliação de comunicação conforme as regras aplicáveis. Não disponibilizar busca pública por CPF para supostamente atender direitos sem verificar a identidade e a legitimidade da solicitação.

## Operação e resposta a incidentes

Preserve IDs de correlação e evidências necessárias em canal restrito. Não copie respostas cadastrais para tickets, mensagens ou logs. Em suspeita de uso indevido, restrinja os acessos afetados no Keycloak, preserve a auditoria e acione o encarregado/responsáveis. Revise sessões, fonte, finalidade e exportações correlacionadas; não elimine registros de auditoria como contenção.

A rotação de chaves deve ser planejada: trocar a chave de cache invalida a leitura de respostas anteriores; trocar a chave de HMAC afeta buscas pseudonimizadas e provas de exportação. Não sobrescreva segredos de produção durante testes. Teste restauração apenas em ambiente isolado, respeitando a expiração dos dados.

## Validação e implantação

Testes automatizados usam banco local isolado, identidades fictícias e mocks de SERPRO/Keycloak. Cobrem retenção, ausência de IP/User-Agent em novas sessões, minimização da auditoria, correlação de exportações, perda de autorização, integridade/validade de resultados e proteção das telas ao sair/limpar.

Não há nova tabela ou migração nessa revisão. A implantação da versão ativa a limpeza do estado de autenticação já vencido; ela não remove contas, auditorias nem resultados ainda válidos. Faça a revisão e o backup previstos antes de atualizar. Nenhuma alteração dessa revisão foi aplicada à produção automaticamente.
