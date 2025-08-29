const _CONST = {
  LANGUAGE: {
    JAVASCRIPT: 'JAVASCRIPT',
    TYPESCRIPT: 'TYPESCRIPT',
    GO: 'GO',
    JAVA: 'JAVA',
  },
  get LANGUAGE_INFO() {
    return {
      [_CONST.LANGUAGE.JAVASCRIPT]: {
        name: 'JavaScript',
        value: 'JAVASCRIPT',
        default_code: 'console.log("Hello, World!");',
      },
      [_CONST.LANGUAGE.TYPESCRIPT]: {
        name: 'TypeScript',
        value: 'TYPESCRIPT',
        default_code: 'const name: string = "Minh";\nconsole.log("Hello " + name + "!");',
      },
      [_CONST.LANGUAGE.GO]: {
        name: 'Go',
        value: 'GO',
        default_code: 'package main\n\nimport "fmt"\n\nfunc main() {\n\tfmt.Println("Hello, World!")\n}',
      },
      [_CONST.LANGUAGE.JAVA]: {
        name: 'Java',
        value: 'JAVA',
        default_code: 'public class solution {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println("Hello, World!");\n\t}\n}',
      },
    }
  },
  get LIST_LANGUAGE_INFO() {
    return Object.values(_CONST.LANGUAGE_INFO);
  }
}

export default _CONST;