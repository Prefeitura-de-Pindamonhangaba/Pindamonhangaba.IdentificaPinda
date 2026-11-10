# GitHub Actions e produção

## Fluxo

- **Pull request:** executa testes Bun e Playwright com PostgreSQL isolado, formatação, lint, build e tipagem.
- **Push na `main`:** executa os mesmos testes uma vez, publica as imagens no GHCR e faz o deploy no runner da VM `10.0.0.193`.
- **Execução manual:** Actions → Produção → Run workflow → `main`, para repetir a mesma sequência.

O workflow de produção mostra três etapas: **Testes → Build e publicação → Deploy**. Se uma etapa falhar, as seguintes não executam. Não existe mais uma variável para publicar imagens e pular silenciosamente o deploy.

As imagens são Linux amd64 e identificadas por digest. O servidor baixa as imagens; não compila a aplicação. Credenciais e certificados permanecem no `.env` e na pasta `certificates/` do servidor.

## Configuração inicial

1. Mantenha o runner Linux x64 na própria VM de produção, com Docker, Compose 2.24.4 ou posterior, Bash, Python 3, `flock` e `realpath`.
2. Use o runner group `identifica-pinda-production` e os labels `self-hosted`, `Linux`, `X64` e `identifica-pinda-production`. Na organização, restrinja o grupo a este repositório e ao workflow `Prefeitura-de-Pindamonhangaba/Pindamonhangaba.IdentificaPinda/.github/workflows/production.yml@refs/heads/main`. PRs executam somente nos runners hospedados do GitHub.
3. No environment `production`, permita deployments somente da `main`. Configure aprovação conforme a política da equipe.
4. Prepare `/opt/Pindamonhangaba.IdentificaPinda/.env` com `COMPOSE_PROFILES=production`, banco externo e demais configurações. O usuário do runner precisa ler esse arquivo e acessar Docker. A pasta privada deve ficar fora do workspace do runner.
5. Preserve o projeto Compose existente `identifica-pinda-production`, a rede `nginx-proxy-manager_default` e `certificates/postgres-root.crt`. O deploy combina `compose.yml`, `compose.proxy-manager.yml` e `compose.release.yml`, mantendo a rede do Nginx e a CA do PostgreSQL.
6. Permita `packages: write/read` ao `GITHUB_TOKEN` e acesso do repositório ao package GHCR. Nenhum token permanente de registry é necessário.

O workflow já usa os valores desta instalação. Variáveis opcionais do repositório ou do environment `production` permitem substituir:

| Variável                     | Padrão                                         |
| ---------------------------- | ---------------------------------------------- |
| `PRODUCTION_DEPLOY_DIR`      | `/opt/Pindamonhangaba.IdentificaPinda`         |
| `PRODUCTION_COMPOSE_PROJECT` | `identifica-pinda-production`                  |
| `PRODUCTION_URL`             | `https://identifica.pindamonhangaba.sp.gov.br` |

Remova valores antigos dessas variáveis se divergirem da instalação. `PRODUCTION_DEPLOY_ENABLED` e `PRODUCTION_PLATFORM` não são mais utilizadas.

O `.env` privado continua sendo a fonte de segredos e configuração da aplicação. As variáveis do GitHub acima só identificam o destino; não substituem `APP_URL` ou `DATABASE_URL`.

## Migrações e atualização

O deploy verifica configuração, conexão, certificados e migrações antes de substituir a aplicação. **Não aplica migrações automaticamente.** Se houver migrações pendentes, o job falha com a aplicação anterior preservada.

Após backup e revisão do SQL, use os arquivos da release indicada na execução que falhou, em `/opt/Pindamonhangaba.IdentificaPinda/releases/COMMIT-EXECUCAO-TENTATIVA/`. Execute na pasta privada, substituindo `RELEASE` pelo caminho dessa release:

```sh
docker compose --project-directory "$PWD" --env-file .env --env-file "$RELEASE/images.env" --project-name identifica-pinda-production -f "$RELEASE/compose.yml" -f "$RELEASE/compose.proxy-manager.yml" -f "$RELEASE/compose.release.yml" run --rm tools db:migrate
```

Depois, reexecute o workflow na `main`. Não use `down -v` nem remova volumes para atualizar.

## Falhas e recuperação

- **Testes:** consulte o step que falhou; nenhum deploy é iniciado.
- **Build e publicação:** confira o log do Docker/GHCR e as permissões do package.
- **Deploy aguardando runner:** confira o serviço, grupo e labels do runner na VM.
- **Pré-deploy:** corrija o `.env`, conectividade, certificados ou migrações indicados, e reexecute.
- **Saúde:** o Compose aguarda até 180 segundos. Se falhar, o workflow falha; não há rollback automático.

Cada tentativa guarda os arquivos Compose e os digests em `releases/`. `current-release` só é atualizado após a aplicação ficar saudável. Para recuperar, use uma release anterior compatível com o banco, o mesmo `.env` e o mesmo nome de projeto. O registro anterior não significa que o container anterior continuou rodando se a falha ocorreu durante a ativação.

O health check verifica o container. Confira também HTTPS público e login institucional após publicar. Veja [produção da Prefeitura](producao-identifica.md) e [operação](operacao.md) para infraestrutura e recuperação.

Referências: [workflows reutilizáveis](https://docs.github.com/en/actions/how-tos/reuse-automations/reuse-workflows), [publicação Docker no GitHub](https://docs.github.com/en/actions/tutorials/publish-packages/publish-docker-images) e [acesso a grupos de runners](https://docs.github.com/en/enterprise-cloud@latest/actions/how-tos/manage-runners/self-hosted-runners/manage-access).
