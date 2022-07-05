const readline = require("readline");
const { stdin: input, stdout: output } = require("process");
const http = require("http");
const fs = require("fs");
const path = require("path");

const host = "localhost";
const port = 3000;

const rl = readline.createInterface({ input, output });

function getAnswer(question) {
  return new Promise((resolve) => {
    rl.question(question, (input) => resolve(input));
  });
}

async function editTemplate() {
  let data;
  let template;

  let possibleTemplatesFiles = fs.readdirSync("./templates/").filter(file => file.split(".").slice(-1) == 'html');
  let possibleDataFiles = fs.readdirSync("./data/").filter(file => file.split(".").slice(-1) == "json");

  const answerTemplate = await getAnswer(`Enter the path to the template (${possibleTemplatesFiles}): `);
  if (fs.existsSync(`./templates/${answerTemplate}`)) {
    template = fs.readFileSync(`./templates/${answerTemplate}`, "utf8");
  } else throw new Error("Path to template isn't correct.");

  const answerData = await getAnswer(`Enter the path to the data file (${possibleDataFiles}): `);
  if (fs.existsSync(`./data/${answerData}`)) {
    const file = fs.readFileSync(`./data/${answerData}`, "utf8");
    data = JSON.parse(file);
  } else throw new Error("Path to data files isn't correct.");

  for (let key in data) {
    template = template.replace(`{{${key}}}`, data[key])
  }

  return template;
}

async function initServer() {
    try {
        const template = await editTemplate();
        const server = http.createServer((req, res) => {
            res.writeHead(200, {
                'Content-Type': 'text/html'
            });
            res.write(template);
            res.end()
        })

        server.listen(port, () => {
            console.log(`Server is running on http://${host}:${port}`);
        });
    }
    catch {
        throw new Error();
    }
}

initServer();

