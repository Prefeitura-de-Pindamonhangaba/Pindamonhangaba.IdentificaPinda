# Identifica Pinda: atualização da identidade

O nome público da plataforma é **Identifica Pinda**. O pacote passa a ser `identifica-pinda`; novos exemplos de banco, pasta de instalação, projeto Compose e runner utilizam essa identidade.

## Instalações existentes

A alteração de nome não migra dados nem renomeia recursos instalados. Preserve o `.env` privado, `DATABASE_URL`, `POSTGRES_DB`, chaves de criptografia, segredo de sessão, certificados e `KEYCLOAK_CLIENT_ID`. O cliente institucional existente continua funcionando com qualquer ID configurado no `.env`; basta atualizar seu nome de exibição no Keycloak, se desejado.

Antes de atualizar, confira o nome do projeto e os volumes existentes com `docker compose ls` e `docker volume ls`. Use o mesmo projeto por meio de `COMPOSE_PROJECT_NAME` no `.env` ou de `--project-name` nos comandos. Trocar o nome do projeto cria outra instalação e pode selecionar um volume vazio. No GitHub Actions, preserve `PRODUCTION_COMPOSE_PROJECT` e `PRODUCTION_DEPLOY_DIR` em instalações existentes. Novas instalações podem usar `/opt/identifica-pinda` e `identifica-pinda`.

O workflow passa a selecionar o grupo e o label `identifica-pinda-production`. Configure o runner e restrinja o grupo ao workflow de produção na `main` antes de habilitar o deploy. Mantenha `PRODUCTION_DEPLOY_ENABLED=false` durante essa preparação.

Os modelos de Nginx e do serviço de restrição de rede foram renomeados no repositório. Arquivos já instalados nas VMs não são movidos. No ambiente de desenvolvimento, preserve o serviço de firewall existente até uma troca planejada; não habilite dois serviços para a mesma regra. Se trocar o serviço, remova a regra pelo serviço anterior antes de desativá-lo e instalar o novo, dentro de uma janela de manutenção. O modelo de Nginx deve usar os caminhos dos certificados realmente instalados.

A mudança de domínio exige DNS, certificado TLS válido, `APP_URL`, `PRODUCTION_URL` e os callbacks/origens do cliente Keycloak compatíveis. Alterar apenas o nome da plataforma não modifica DNS nem certificados.

## Repositório e domínio

O repositório passa a ser `Prefeitura-de-Pindamonhangaba/Pindamonhangaba.IdentificaPinda`. Atualize o remote dos clones existentes:

```sh
git remote set-url origin https://github.com/Prefeitura-de-Pindamonhangaba/Pindamonhangaba.IdentificaPinda.git
```

O domínio de produção será `identifica.pindamonhangaba.sp.gov.br`, atendido pela VM `10.0.0.193`. O banco ficará em `10.0.0.4` e o desenvolvimento em `10.0.0.16`. A publicação DNS e a instalação do certificado precisam ser executadas na infraestrutura municipal. Pacotes GHCR já publicados não são renomeados por uma troca de nome do repositório; preserve os digests das releases existentes para recuperação. O workflow gera as próximas referências a partir do nome atual do repositório.
