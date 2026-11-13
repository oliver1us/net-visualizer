for install prettier on your system run:
npm i -D prettier

You can also see and configure rules for prettier in .prettierrc file

install shadcn
npx shadcn@latest init

to configure mcp github
https://github.com/github/github-mcp-server/blob/main/docs/installation-guides/install-opencode.md

https://github.com/settings/personal-access-tokens

guide in this links to help and understand the configuration

ojo:
para levantar gh con la configuracion actual es recomendable tener las variables en un file .env y correr la siguiente secuela de comandos

set -a #permite exportar variables definidas a procesos hijos
source src/.env # carga vars y con la ayuda de set -a las exporta
set +a # descativa la exportacion
opencode --standalone # arranca opencode como servidor privado y exporta variables de la shell 


## AGENTS
The agents are defined in .opencode/agents/ directory