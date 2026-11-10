# Documentação do Identifica Pinda

## Instalar e avaliar

1. [Início rápido](inicio-rapido.md): preparar ambiente, criar primeiro administrador e iniciar a plataforma sem credenciais SERPRO.
2. [Autenticação e permissões](autenticacao.md): papéis, sessões e administração das contas.
3. [Infoconv](infoconv.md): habilitação, certificados, configurações, cache, consumo e significado dos códigos.

[Keycloak e login institucional](keycloak.md): cliente OIDC, configuração no .env, vínculos e limites de sessão.

## Desenvolver e contribuir

- [Guia de contribuição](../CONTRIBUTING.md): fluxo de desenvolvimento e revisão.
- [Arquitetura e decisões](arquitetura.md): MVC modular, fontes de dados, cache e transporte substituível.
- [Testes](testes.md): verificações locais, banco isolado e Playwright.
- [Identidade visual](identidade-visual.md): paleta, componentes, acessibilidade e reutilização entre sistemas.

## Proteção de dados

- [Privacidade e revisão LGPD](privacidade-lgpd.md): dados tratados, controles técnicos, retenção, limites e decisões institucionais pendentes.

## Publicar e manter

- [Rede local com HTTPS](instalacao-rede-local.md): overlay Docker, proxy, certificados e login institucional nesta instalacao.

- [AlmaLinux e Nginx](almalinux-nginx.md): VM da Prefeitura, SELinux, proxy e testes antes do DNS.
- [Produção do Identifica Pinda](producao-identifica.md): Nginx Proxy Manager na VM e PostgreSQL separado.
- [GitHub Actions e produção](github-actions.md): CI, GHCR, runner próprio e preparação do servidor.
- [Mudança de identidade](renomeacao.md): atualizar instalações existentes, repositório e domínio.
- [Configuração e operação](operacao.md): containers, migrações, atualização e recuperação.
- [Relatar vulnerabilidades](../SECURITY.md): como buscar um canal privado sem divulgar dados sensíveis.
- [Variáveis de exemplo](../.env.example): nomes e valores locais de referência.

A documentação é mantida em português brasileiro. Os comandos devem ser executados na raiz do repositório, salvo indicação diferente. Nunca utilize bancos, certificados ou credenciais de produção para testes.
