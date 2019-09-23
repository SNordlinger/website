import prism from "prismjs";

const hellos = [
  {
    grammar: prism.languages.python,
    lang: "python",
    hello: "print('Hello!')"
  },
  {
    grammar: prism.languages.js,
    lang: "js",
    hello: "console.log('Hello!');"
  },
  {
    grammar: prism.languages.java,
    lang: "java",
    hello: 'System.out.println("Hello!");'
  },
  {
    grammar: prism.languages.rust,
    lang: "rust",
    hello: 'println!("Hello!");'
  },
  {
    grammar: prism.languages.c,
    lang: "c",
    hello: 'puts("Hello!");'
  },
  {
    grammar: prism.languages.clojure,
    lang: "clojure",
    hello: '(println "Hello!")'
  },
  {
    grammar: prism.languages.go,
    lang: "go",
    hello: 'fmt.println("Hello!")'
  },
  {
    grammar: prism.languages.sql,
    lang: "sql",
    hello: "SELECT 'Hello!';"
  },
  {
    grammar: prism.languages.bash,
    lang: "bash",
    hello: 'echo "Hello!"'
  },
  {
    grammar: prism.languages.powershell,
    lang: "powershell",
    hello: 'Write-Host "Hello!"'
  }
];

export default hellos;
