import { Highlight, themes } from "prism-react-renderer";

const languageMap = {
  typescript: "tsx",
  json: "json",
  env: "bash",
};

export default function CodeBlock({ code, language = "typescript" }) {
  const prismLanguage = languageMap[language] || "tsx";

  return (
    <Highlight theme={themes.github} code={code.trim()} language={prismLanguage}>
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre
          className="overflow-x-auto rounded-md p-3 text-xs leading-5"
          style={{
            ...style,
            fontFamily: "'Fira Code', monospace",
            backgroundColor: "#FAFAFB",
            margin: 0,
          }}
        >
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ line })} className="flex">
              <span className="mr-4 inline-block w-6 select-none text-right text-[#D8D8DB]">
                {i + 1}
              </span>
              <span>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </span>
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  );
}
