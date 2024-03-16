export function reloadLatex() {
    //https://svelte.dev/repl/218430bdd2d541f3bf8c6cef51eec89a?version=3.46.4
    let script = document.createElement('script');
    script.src = "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js";
    document.head.append(script);
		
		script.onload = () => {
            MathJax = {
                tex: {inlineMath: [['$', '$'], ['\\(', '\\)']]},
                svg: {fontCache: 'global'}
            };
		};

    document.head.append(script)
    console.log("reload latex")
}