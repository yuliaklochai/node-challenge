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

  const answerData = await getAnswer("Enter the path to the data file: ");
  if (fs.existsSync(answerData) && path.extname(answerData) === ".json") {
    const file = fs.readFileSync(answerData, "utf8");
    data = JSON.parse(file);
  } else throw new Error("Error new one");

  const answerTemplate = await getAnswer("Enter the path to the template: ");
  if (fs.existsSync(answerTemplate) && path.extname(answerTemplate) === ".html") {
    template = fs.readFileSync(answerTemplate, "utf8");
  } else throw new Error("Error new one");

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
        throw new Error;
    }
}

initServer();

