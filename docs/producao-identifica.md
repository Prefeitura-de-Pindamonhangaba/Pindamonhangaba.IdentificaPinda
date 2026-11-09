# Produção: aplicação e PostgreSQL separados

A implantação municipal utiliza AlmaLinux 9, com a aplicação em `10.0.0.193`, pasta `/opt/Pindamonhangaba.IdentificaPinda`, e PostgreSQL 17 externo em `10.0.0.4`. A origem HTTPS é `https://identifica.pindamonhangaba.sp.gov.br`. O servidor `10.0.0.16` é desenvolvimento.

## Proxy e banco

O Nginx Proxy Manager existente atende 80/443. O [overlay](../compose.proxy-manager.yml) conecta somente o serviço `app` à rede externa `nginx-proxy-manager_default`, pelo alias exclusivo `identifica-pinda-production`, porta interna 3000. Nenhuma porta da aplicação é publicada no host. Ajuste `PROXY_MANAGER_NETWORK` se a rede tiver outro nome.

O proxy deve apontar para `http://identifica-pinda-production:3000`, usar certificado válido para o domínio e desabilitar cache. Preserve os cabeçalhos de encaminhamento e a origem HTTPS. O callback `/api/auth/callback/keycloak` não deve registrar query strings em access/error logs. Configure limite de corpo de pelo menos 4 MB para exportações. O Nginx deve ser validado antes de recarregar; alterações ficam limitadas ao virtual host desta aplicação.

O banco `identifica_pinda_prd` tem usuário exclusivo sem privilégios administrativos. A regra de conexão aceita somente TLS/SCRAM a partir de `10.0.0.193/32`, com rejeição das demais origens para esse usuário, antes de regras genéricas. A CA pública do PostgreSQL é fornecida em `certificates/postgres-root.crt`; o overlay define `NODE_EXTRA_CA_CERTS` para aplicação, pré-deploy e ferramentas. Use `sslmode=verify-full` na connection string. Não desabilite a validação TLS.

## Configuração privada e execução

O `.env` permanece no servidor com modo `0600`, contendo `COMPOSE_PROFILES=production`, `APP_URL`, `DATABASE_URL`, segredos exclusivos e configurações do Keycloak/Infoconv. Certificados são montados somente para leitura. A CA é pública; certificados Infoconv com chave privada precisam de leitura restrita ao UID/GID do container.

Para usar imagens prontas, combine os arquivos nesta ordem:

```sh
docker compose --env-file .env --env-file images.env -f compose.yml -f compose.proxy-manager.yml -f compose.release.yml run --rm tools db:migrate

docker compose --env-file .env --env-file images.env -f compose.yml -f compose.proxy-manager.yml -f compose.release.yml up -d --no-build --wait --wait-timeout 180
```

`images.env` contém referências imutáveis das imagens de aplicação e ferramentas, identificadas pela revisão aprovada. Compile fora desta VM: a capacidade de memória é limitada e a compilação local pode prejudicar os demais serviços. Nunca transporte `.env` ou certificados dentro das imagens.

O Compose pode receber os arquivos pelo `COMPOSE_FILE` do `.env`. Preserve o nome estável `identifica-pinda-production` em todos os comandos dessa instalação. Faça backup antes de migrações; não remova volumes como parte do deploy.

O workflow padrão do repositório ainda precisa selecionar esse overlay para atualizar esta instalação pelo Actions. Não habilite a esteira de produção com apenas `compose.yml`/`compose.release.yml`: isso perderia a rede do proxy e a CA do banco. A primeira instalação foi preparada diretamente por SSH.

## Backup e validação

No banco, `identifica-pinda-backup.timer` agenda backup diário; o serviço roda como `postgres` e grava em `/var/backups/identifica-pinda`, com acesso restrito. O dump exclui o conteúdo de `public.consultation_cache` e valida a leitura do catálogo do arquivo. Não há expurgo automático. Defina retenção, cópia externa protegida e teste de restauração em ambiente isolado conforme a política municipal.

Verifique HTTPS pela origem e pelo domínio público, `/api/health`, apresentação, redirecionamento SSO e autorização com conta institucional. O health check não substitui a validação de login nem comprova a disponibilidade do SERPRO. A instalação e o pré-deploy não realizam consultas reais ao Infoconv.

## Situação da implantação inicial

A revisão `be9fa86` foi instalada em 09/11/2026 com imagens compiladas fora da VM e fixadas pelos IDs locais. O container ficou saudável, as quatro migrações foram aplicadas e a origem respondeu HTTP 200 em `/login` e `/api/health` por HTTPS com certificado válido. O banco e o primeiro backup foram verificados. Nenhum cadastro pessoal foi importado e nenhuma consulta real ao SERPRO foi feita.

Na verificação inicial, a rota pública do Cloudflare usava HTTP até a origem, causando redirecionamento circular com HTTPS obrigatório. Ajuste **Full (strict)** por hostname para este domínio; não altere toda a zona sem revisar os outros sistemas. A origem mantém seu certificado válido e o redirecionamento HTTPS.

A conta de bootstrap do Keycloak estava desativada e foi preservada assim. Por orientação do responsável, a instalação reutiliza o cliente existente `PindaDados` e seus acessos, sem criar outro cliente nem conceder papéis automaticamente. O segredo foi informado diretamente no terminal; `KEYCLOAK_ENABLED=true` e o pré-deploy/ativação concluíram. O início do SSO respondeu 200 e gerou callback correto com PKCE S256. Na conferência seguinte, o provedor respondeu **Cliente desativado**: é necessário habilitar `PindaDados` no realm `pindamonhangaba` e conferir callbacks, mapper e papéis no painel. A troca de código por tokens e o login completo ainda não foram validados. A presença da tela pública não significa que o login foi validado.
