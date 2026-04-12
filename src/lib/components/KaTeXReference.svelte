<script>
    import katex from "katex";
    import KaTeXReferenceTable from "./KaTeXReferenceTable.svelte";

    const accents = [
        ["a'  ", "\\tilde{a}", "\\mathring{g}"],
        ["a''", "\\widetilde{ac}  ", "\\overgroup{AB}"],
        ["a^{\\prime} ", "\\utilde{AB}  ", "\\undergroup{AB}"],
        ["\\acute{a}", "\\vec{F} ", "\\Overrightarrow{AB}"],
        ["\\bar{y} ", "\\overleftarrow{AB}", "\\overrightarrow{AB}"],
        ["\\breve{a}", "\\underleftarrow{AB} ", "\\underrightarrow{AB}"],
        ["\\check{a}", "\\overleftharpoon{ac}  ", "\\overrightharpoon{ac}"],
        ["\\dot{a} ", "\\overleftrightarrow{AB}  ", "\\overbrace{AB}"],
        ["\\ddot{a}  ", "\\underleftrightarrow{AB}", "\\underbrace{AB}"],
        ["\\dddot{a}", "\\overline{AB} ", "\\overbracket{AB}"],
        ["\\ddddot{a}", "\\underline{AB}  ", "\\underbracket{AB}"],
        ["\\grave{a}", "\\underbar{X}", "\\overlinesegment{AB}"],
        ["\\hat{\\theta}", "\\widecheck{ac}  ", "\\underlinesegment{AB}"],
        ["", "\\widehat{ac}", ""],
    ];

    const accentsInside = [
        ["\\'{a}", "\\~{a}", "\\.{a}", "\\H{a}"],
        ["\\`{a}", "\\={a}", '\\"{a}', "\\v{a}"],
        ["\\^{a}", "\\u{a}", "\\r{a}"],
    ];

    const delimiters = [
        ["( )", "\\lparen\n\\rparen", "⌈ ⌉", "\\lceil\n\\rceil", "\\uparrow"],
        ["[ ]", "\\lbrack\n\\rbrack", "⌊ ⌋", "\\lfloor\n\\rfloor", "\\downarrow"],
        ["\\{ \\}", "\\lbrace\n\\rbrace", "⎰⎱", "\\lmoustache\n\\rmoustache", "\\updownarrow"],
        ["⟨ ⟩", "\\langle\n\\rangle", "⟮ ⟯", "\\lgroup\n\\rgroup", "\\Uparrow"],
        ["|", "\\vert", "┌ ┐", "\\ulcorner\n\\urcorner", "\\Downarrow"],
        ["\\|", "\\Vert", "└ ┘", "\\llcorner\n\\lrcorner", "\\Updownarrow"],
        ["\\lvert\n\\rvert", "\\lVert\n\\rVert", "\\lBrace \\rBrace", "\\backslash", "/"],
        ["\\lang\n\\rang", "\\lt\n\\gt", "⟦ ⟧", "\\llbracket\n\\rrbracket"],
    ];

    const delimiterSizing = [
        ["\\left", "\\big", "\\bigl", "\\bigm", "\\bigr"],
        ["\\middle", "\\Big", "\\Bigl", "\\Bigm", "\\Bigr"],
        ["\\right", "\\bigg", "\\biggl", "\\biggm", "\\biggr"],
        ["", "\\Bigg", "\\Biggl", "\\Biggm", "\\Biggr"],
    ];

    const environments = [
        ["\\begin{matrix}\na & b \\\\ \nc & d\n\\end{matrix}", "\\begin{array}{cc}\na & b \\\\ \nc & d\n\\end{array}"],
        [
            "\\begin{pmatrix}\na & b \\\\ \nc & d\n\\end{pmatrix}",
            "\\begin{bmatrix}\na & b \\\\ \nc & d\n\\end{bmatrix}",
        ],
        [
            "\\begin{vmatrix}\na & b \\\\ \nc & d\n\\end{vmatrix}",
            "\\begin{Vmatrix}\na & b \\\\ \nc & d\n\\end{Vmatrix}",
        ],
        [
            "\\begin{Bmatrix}\na & b \\\\ \nc & d\n\\end{Bmatrix}",
            "\\def\\arraystretch{1.5}\n\\begin{array}{c:c:c}\na & b & c \\\\ \\hline\nd & e & f \\\\ \n \\hdashline \n g & h & i \n \\end{array}",
        ],
        [
            "x = \\begin{cases} \n a &\text{if } b \\\\ \n c &\\text{if } d \n \\end{cases}",
            "\\begin{rcases} \n a &\text{if } b \\\\ \n c &\\text{if } d \n \\end{rcases}⇒…",
        ],
        [
            "\\begin{smallmatrix} \n a & b \\\\ \n c & d \n \\end{smallmatrix}",
            "\\sum_{ \\begin{subarray}{l} i\\in\\Lambda\\\\ \n 0<j<n \n \\end{subarray}}",
        ],
    ];

    const addEnviro = [
        [
            "\\begin{equation} \n \\begin{split} a &=b+c\\\\ \n  &=e+f \n \\end{split} \n \\end{equation}",
            "\\begin{align} \n a&=b+c \\\\ \n d+e&=f \n \\end{align}",
        ],
        [
            "\\begin{gather}\na=b \\\\ \n e=b+c \n \\end{gather}",
            "\\begin{alignat} \n {2} \n 10&x+&3&y=2\\\\ \n 3&x+&13&y=4 \n \\end{alignat}",
        ],
        ["\\begin{CD} \n A @>a>> B \\\\ \n @VbVV @AAcA \\\\ \n C @= D \n \\end{CD}"],
    ];

    const greek = [
        ["\\Alpha", "\\Beta", "\\Gamma", "\\Delta"],
        ["\\Epsilon", "\\Zeta", "\\Eta", "\\Theta"],
        ["\\Iota", "\\Kappa", "\\Lambda", "\\Mu"],
        ["\\Nu", "\\Xi", "\\Omicron", "\\Pi"],
        ["\\Rho", "\\Sigma", "\\Tau", "\\Upsilon"],
        ["\\Phi", "\\Chi", "\\Psi", "\\Omega"],
        ["\\varGamma", "\\varDelta", "\\varTheta", "\\varLambda"],
        ["\\varXi", "\\varPi", "\\varSigma", "\\varUpsilon"],
        ["\\varPhi", "\\varPsi", "\\varOmega", ""],
        ["\\alpha", "\\beta", "\\gamma", "\\delta"],
        ["\\epsilon", "\\zeta", "\\eta", "\\theta"],
        ["\\iota", "\\kappa", "\\lambda", "\\mu"],
        ["\\nu", "\\xi", "\\omicron", "\\pi"],
        ["\\rho", "\\sigma", "\\tau", "\\upsilon"],
        ["\\phi", "\\chi", "\\psi", "\\omega"],
        ["\\varepsilon", "\\varkappa", "\\vartheta", "\\thetasym"],
        ["\\varpi", "\\varrho", "\\varsigma", "\\varphi"],
        ["\\digamma"],
    ];

    const otherLetters = [
        ["\\imath", "\\nabla", "\\Im", "\\Reals", "\\text{\\OE}"],
        ["\\jmath", "\\partial", "\\image", "\\wp", "\\text{\\o}"],
        ["\\aleph", "\\Game", "\\Bbbk", "\\weierp", "\\text{\\O}"],
        ["\\alef", "\\Finv", "\\N", "\\Z", "\\text{\\ss}"],
        ["\\alefsym", "\\cnums", "\\natnums", "\\text{\\aa}", "\\text{\\i}"],
        ["\\beth", "\\Complex", "\\R", "\\text{\\AA}", "\\text{\\j}"],
        ["\\gimel", "\\ell", "\\Re", "\\text{\\ae}"],
        ["\\daleth", "\\hbar", "\\real", "\\text{\\AE}"],
        ["\\eth", "\\hslash", "\\reals", "\\text{\\oe}"],
    ];

    const lsTheory = [
        ["\\forall", "\\complement", "\\therefore", "\\emptyset"],
        ["\\exists", "\\subset", "\\because", "\\empty"],
        ["\\exist", "\\supset", "\\mapsto", "\\varnothing"],
        ["\\nexists", "\\mid", "\\to", "\\implies"],
        ["\\in", "\\land", "\\gets", "\\impliedby"],
        ["\\isin", "\\lor", "\\leftrightarrow", "\\iff"],
        ["\\notin", "\\ni", "\\notni", "\\neg \\lnot"],
        ["", "\\Set{ x | x<\\frac 1 2 }", "\\set{x|x<5}", ""],
    ];

    const annotation = [
        ["\\cancel{5}", "\\overbrace{a+b+c}^{\\text{note}}"],
        ["\\bcancel{5}", "\\underbrace{a+b+c}_{\\text{note}}"],
        ["\\xcancel{ABC}", "\\not ="],
        ["\\text{\\sout{abc}}", "\\boxed{\\pi=\\frac c d}"],
        ["a_{\\angl n}", "a_\\angln"],
        ["\\overbracket{a+b+c}^{\\text{note}}", "\\underbracket{a+b+c}_{\\text{note}}"],
        ["\\phase{-78^\\circ}"],
        ["\\tag{hi} x+y^{2x}", "\\tag*{hi} x+y^{2x}"],
    ];

    const vertLayout = [
        ["x_n", "\\stackrel{!}{=}", "a \\atop b"],
        ["e^x", "\\overset{!}{=}", "a\\raisebox{0.25em}{\$b\$}c"],
        ["_u^o", "\\underset{!}{=}", "a+\\left(\\vcenter{\\frac{\\frac a b}c}\\right)"],
        ["", "", "\\sum_{\\substack{0<i<m\\\\0<j<n}}"],
    ];

    const overlap = [
        ["{=}\\mathllap{/\\,}", "\\left(x^{\\smash{2}}\\right)"],
        ["\\mathrlap{\\,/}{=}", "\\sqrt{\\smash[b]{y}}"],
        ["\\sum_{\\mathclap{1\\le i\\le j\\le n}} x_{ij}"],
    ];

    const macros = [
        ["\\def\\foo{x^2} \\foo + \\foo"],
        ["\\gdef\\foo#1{#1^2} \\foo{y} + \\foo{y}"],
        ["\\edef\\macroname#1#2…{definition to be expanded}"],
        ["\\xdef\\macroname#1#2…{definition to be expanded}"],
        ["\\let\\foo=\\bar"],
        ["\\futurelet\\foo\\bar x"],
        ["\\global\\def\\macroname#1#2…{definition}"],
        //update these to avoid running KaTex on these
        ["\\newcommand\\macroname[numargs]{definition}"],
        ["\\renewcommand\\macroname[numargs]{definition}"],
        ["\\providecommand\\macroname[numargs]{definition}"],
    ];

    const operators = [
        ["\\sum", "\\prod", "\\bigotimes", "\\bigvee"],
        ["\\int", "\\coprod", "\\bigoplus", "\\bigwedge"],
        ["\\iint", "\\intop", "\\bigodot", "\\bigcap"],
        ["\\iiint", "\\smallint", "\\biguplus", "\\bigcup"],
        ["\\oint", "\\oiint", "\\oiiint", "\\bigsqcup"],
    ];

    const binOps = [
        ["+", "\\cdot", "\\gtrdot", "\\pmod a"],
        ["-", "\\cdotp", "\\intercal", "\\pod a"],
        ["/", "\\centerdot", "\\land", "\\rhd"],
        ["*", "\\circ", "\\leftthreetimes", "\\rightthreetimes"],
        ["\\amalg", "\\circledast", "\\ldotp", "\\rtimes"],
        ["\\And", "\\circledcirc", "\\lor", "\\setminus"],
        ["\\ast", "\\circleddash", "\\lessdot", "\\smallsetminus"],
        ["\\barwedge", "\\Cup", "\\lhd", "\\sqcap"],
        ["\\bigcirc", "\\cup", "\\ltimes", "\\sqcup"],
        ["\\bmod", "\\curlyvee", "\\mod a", "\\times"],
        ["\\boxdot", "\\curlywedge", "\\mp", "\\unlhd"],
        ["\\boxminus", "\\div", "\\odot", "\\unrhd"],
        ["\\boxplus", "\\divideontimes", "\\ominus", "\\uplus"],
        ["\\boxtimes", "\\dotplus", "\\oplus", "\\vee"],
        ["\\bullet", "\\doublebarwedge", "\\otimes", "\\veebar"],
        ["\\Cap", "\\doublecap", "\\oslash", "\\wedge"],
        ["\\cap", "\\doublecup", "\\pm or \\plusmn", "\\wr"],
    ];

    const frac = [
        ["\\frac{a}{b}", "\\tfrac{a}{b}", "\\genfrac ( ] {2pt}{1}a{a+1}"],
        ["{a \\over b}", "\\dfrac{a}{b}", "{a \\above{2pt} b+1}"],
        ["a/b", "", "\\cfrac{a}{1 + \\cfrac{1}{b}}"],
    ];

    const binomials = [
        ["\\binom{n}{k}", "\\dbinom{n}{k}", "{n\\brace k}"],
        ["{n \\choose k}", " \\tbinom{n}{k}", "{n\\brack k}"],
    ];

    const mathOps = [
        ["\\arcsin", "\\cosec", "\\deg", "\\sec"],
        ["\\arccos", "\\cosh", "\\dim", "\\sin"],
        ["\\arctan", "\\cot", "\\exp", "\\sinh"],
        ["\\arctg", "\\cotg", "\\hom", "\\sh"],
        ["\\arcctg", "\\coth", "\\ker", "\\tan"],
        ["\\arg", "\\csc", "\\lg", "\\tanh"],
        ["\\ch", "\\ctg", "\\ln", "\\tg"],
        ["\\cos", "\\cth", "\\log", "\\th"],
        ["\\operatorname{f}"],
        ["\\argmax", "\\injlim", "\\min", "\\varinjlim"],
        ["\\argmin", "\\lim", "\\plim", "\\varliminf"],
        ["\\det", "\\liminf", "\\Pr", "\\varlimsup"],
        ["\\gcd", "\\limsup", "\\projlim", "\\varprojlim"],
        ["\\inf", "\\max", "\\sup"],
        ["\\operatorname*{f}", "\\operatornamewithlimits{f}"],
    ];

    const braketNotation = [
        ["\\bra{\\phi}", "\\ket{\\psi}", "\\braket{\\phi|\\psi}"],
        ["\\Bra{\\phi}", "\\Ket{\\psi}", "\\Braket{ ϕ | \\frac{∂^2}{∂ t^2} | ψ }"],
    ];

    const colors = [
        ["\\color{blue} F=ma"],
        ["\\textcolor{blue}{F=ma}"],
        ["\\textcolor{#228B22}{F=ma}"],
        ["\\colorbox{aqua}{$F=ma$}"],
        ["\\fcolorbox{red}{aqua}{$F=ma$}"],
    ];

    const relations = [
        ["=", "\\doteqdot", "\\lessapprox", "\\smile"],
        ["<", "\\eqcirc", "\\lesseqgtr", "\\sqsubset"],
        [">", "\\eqcolon or \\minuscolon", "\\lesseqqgtr", "\\sqsubseteq"],
        [":", "\\Eqcolon or \\minuscoloncolon", "\\lessgtr", "\\sqsupset"],
        ["\\approx", "\\eqqcolon or \\equalscolon", "\\lesssim", "\\sqsupseteq"],
        ["\\approxcolon", "\\Eqqcolon or \\equalscoloncolon", "\\ll", "\\Subset"],
        ["\\approxcoloncolon", "\\eqsim", "\\lll", "\\subset or \\sub"],
        ["\\approxeq", "\\eqslantgtr", "\\llless", "\\subseteq or \\sube"],
        ["\\asymp", "\\eqslantless", "\\lt", "\\subseteqq"],
        ["\\backepsilon", "\\equiv", "\\mid", "\\succ"],
        ["\\backsim", "\\fallingdotseq", "\\models", "\\succapprox"],
        ["\\backsimeq", "\\frown", "\\multimap", "\\succcurlyeq"],
        ["\\between", "\\ge", "\\origof", "\\succeq"],
        ["\\bowtie", "\\geq", "\\owns", "\\succsim"],
        ["\\bumpeq", "\\geqq", "\\parallel", "\\Supset"],
        ["\\Bumpeq", "\\geqslant", "\\perp", "\\supset"],
        ["\\circeq", "\\gg", "\\pitchfork", "\\supseteq or \\supe"],
        ["\\colonapprox", "\\ggg", "\\prec", "\\supseteqq"],
        ["\\Colonapprox or \\coloncolonapprox", "\\gggtr", "\\precapprox", "\\thickapprox"],
        ["\\coloneq or \\colonminus", "\\gt", "\\preccurlyeq", "\\thicksim"],
        ["\\Coloneq or \\coloncolonminus", "\\gtrapprox", "\\preceq", "\\trianglelefteq"],
        ["\\coloneqq or \\colonequals", "\\gtreqless", "\\precsim", "\\triangleq"],
        ["\\Coloneqq or \\coloncolonequals", "\\gtreqqless", "\\propto", "\\trianglerighteq"],
        ["\\colonsim", "\\gtrless", "\\risingdotseq", "\\varpropto"],
        ["\\Colonsim or \\coloncolonsim", "\\gtrsim", "\\shortmid", "\\vartriangle"],
        ["\\cong", "\\imageof", "\\shortparallel", "\\vartriangleleft"],
        ["\\curlyeqprec", "\\in or \\isin", "\\sim", "\\vartriangleright"],
        ["\\curlyeqsucc", "\\Join", "\\simcolon", "\\vcentcolon or \\ratio"],
        ["\\dashv", "\\le", "\\simcoloncolon", "\\vdash"],
        ["\\dblcolon or \\coloncolon", "\\leq", "\\simeq", "\\vDash"],
        ["\\doteq", "\\leqq", "\\smallfrown", "\\Vdash"],
        ["\\Doteq", "\\leqslant", "\\smallsmile", "\\Vvdash"],
    ];

    const negRelations = [
        ["\\gnapprox", "\\ngeqslant", "\\nsubseteq", "\\precneqq"],
        ["\\gneq", "\\ngtr", "\\nsubseteqq", "\\precnsim"],
        ["\\gneqq", "\\nleq", "\\nsucc", "\\subsetneq"],
        ["\\gnsim", "\\nleqq", "\\nsucceq", "\\subsetneqq"],
        ["\\gvertneqq", "\\nleqslant", "\\nsupseteq", "\\succnapprox"],
        ["\\lnapprox", "\\nless", "\\nsupseteqq", "\\succneqq"],
        ["\\lneq", "\\nmid", "\\ntriangleleft", "\\succnsim"],
        ["\\lneqq", "\\notin", "\\ntrianglelefteq", "\\supsetneq"],
        ["\\lnsim", "\\notni", "\\ntriangleright", "\\supsetneqq"],
        ["\\lvertneqq", "\\nparallel", "\\ntrianglerighteq", "\\varsubsetneq"],
        ["\\ncong", "\\nprec", "\\nvdash", "\\varsubsetneqq"],
        ["\\ne", "\\npreceq", "\\nvDash", "\\varsupsetneq"],
        ["\\neq", "\\nshortmid", "\\nVDash", "\\varsupsetneqq"],
        ["\\ngeq", "\\nshortparallel", "\\nVdash"],
        ["\\ngeqq", "\\nsim", "\\precnapprox"],
    ];

    const arrows = [
        ["\\circlearrowleft", "\\leftharpoonup", "\\rArr"],
        ["\\circlearrowright", "\\leftleftarrows", "\\rarr"],
        ["\\curvearrowleft", "\\leftrightarrow", "\\restriction"],
        ["\\curvearrowright", "\\Leftrightarrow", "\\rightarrow"],
        ["\\Darr", "\\leftrightarrows", "\\Rightarrow"],
        ["\\dArr", "\\leftrightharpoons", "\\rightarrowtail"],
        ["\\darr", "\\leftrightsquigarrow", "\\rightharpoondown"],
        ["\\dashleftarrow", "\\Lleftarrow", "\\rightharpoonup"],
        ["\\dashrightarrow", "\\longleftarrow", "\\rightleftarrows"],
        ["\\downarrow", "\\Longleftarrow", "\\rightleftharpoons"],
        ["\\Downarrow", "\\longleftrightarrow", "\\rightrightarrows"],
        ["\\downdownarrows", "\\Longleftrightarrow", "\\rightsquigarrow"],
        ["\\downharpoonleft", "\\longmapsto", "\\Rrightarrow"],
        ["\\downharpoonright", "\\longrightarrow", "\\Rsh"],
        ["\\gets", "\\Longrightarrow", "\\searrow"],
        ["\\Harr", "\\looparrowleft", "\\swarrow"],
        ["\\hArr", "\\looparrowright", "\\to"],
        ["\\harr", "\\Lrarr", "\\twoheadleftarrow"],
        ["\\hookleftarrow", "\\lrArr", "\\twoheadrightarrow"],
        ["\\hookrightarrow", "\\lrarr", "\\Uarr"],
        ["\\iff", "\\Lsh", "\\uArr"],
        ["\\impliedby", "\\mapsto", "\\uarr"],
        ["\\implies", "\\nearrow", "\\uparrow"],
        ["\\Larr", "\\nleftarrow", "\\Uparrow"],
        ["\\lArr", "\\nLeftarrow", "\\updownarrow"],
        ["\\larr", "\\nleftrightarrow", "\\Updownarrow"],
        ["\\leadsto", "\\nLeftrightarrow", "\\upharpoonleft"],
        ["\\leftarrow", "\\nrightarrow", "\\upharpoonright"],
        ["\\Leftarrow", "\\nRightarrow", "\\upuparrows"],
        ["\\leftarrowtail", "\\nwarrow"],
        ["\\leftharpoondown", "\\Rarr"],
    ];

    const extensibleArrows = [
        ["\\xleftarrow{abc}", "\\xrightarrow[under]{over}"],
        ["\\xLeftarrow{abc}", "\\xRightarrow{abc}"],
        ["\\xleftrightarrow{abc}", "\\xLeftrightarrow{abc}"],
        ["\\xhookleftarrow{abc}", "\\xhookrightarrow{abc}"],
        ["\\xtwoheadleftarrow{abc}", "\\xtwoheadrightarrow{abc}"],
        ["\\xleftharpoonup{abc}", "\\xrightharpoonup{abc}"],
        ["\\xleftharpoondown{abc}", "\\xrightharpoondown{abc}"],
        ["\\xleftrightharpoons{abc}", "\\xrightleftharpoons{abc}"],
        ["\\xtofrom{abc}", "\\xmapsto{abc}"],
        ["\\xlongequal{abc}"],
    ];

    const symbols = [
        ["% comment", "\\dots", "\\KaTeX"],
        ["\\%", "\\cdots", "\\LaTeX"],
        ["\\#", "\\ddots", "\\TeX"],
        ["\\&", "\\ldots", "\\nabla"],
        ["\\_", "\\vdots", "\\infty"],
        ["\\text{\\textunderscore}", "\\dotsb", "\\infin"],
        ["\\text{--}", "\\dotsc", "\\checkmark"],
        ["\\text{\\textendash}", "\\dotsi", "\\dag"],
        ["\\text{---}", "\\dotsm", "\\dagger"],
        ["\\text{\\textemdash}", "\\dotso", "\\text{\\textdagger}"],
        ["\\text{\\textasciitilde}", "\\sdot", "\\ddag"],
        ["\\text{\\textasciicircum}", "\\mathellipsis", "\\ddagger"],
        ["`", "\\text{\\textellipsis}", "\\text{\\textdaggerdbl}"],
        ["\\text{\\textquoteleft}", "\\Box", "\\Dagger"],
        ["\\lq", "\\square", "\\angle"],
        ["\\text{\\textquoteright}", "\\blacksquare", "\\measuredangle"],
        ["\\rq", "\\triangle", "\\sphericalangle"],
        ["\\text{\\textquotedblleft}", "\\triangledown", "\\top"],
        ['"', "\\triangleleft", "\\bot"],
        ["\\text{\\textquotedblright}", "\\triangleright", "\\$"],
        ["\\colon", "\\bigtriangledown", "\\text{\\textdollar}"],
        ["\\backprime", "\\bigtriangleup", "\\pounds"],
        ["\\prime", "\\blacktriangle", "\\mathsterling"],
        ["\\text{\\textless}", "\\blacktriangledown", "\\text{\\textsterling}"],
        ["\\text{\\textgreater}", "\\blacktriangleleft", "\\yen"],
        ["\\text{\\textbar}", "\\blacktriangleright", "\\surd"],
        ["\\text{\\textbardbl}", "\\diamond", "\\degree"],
        ["\\text{\\textbraceleft}", "\\Diamond", "\\text{\\textdegree}"],
        ["\\text{\\textbraceright}", "\\lozenge", "\\mho"],
        ["\\\\ \\text{\\textbackslash}", "\\blacklozenge", "\\diagdown"],
        ["\\text{\\P} or \\P", "\\star", "\\diagup"],
        ["\\text{\\S} or \\S", "\\bigstar", "\\flat"],
        ["\\text{\\sect}", "\\clubsuit", "\\natural"],
        ["\\copyright", "\\clubs", "\\sharp"],
        ["\\circledR", "\\diamondsuit", "\\heartsuit"],
        ["\\text{\\textregistered}", "\\diamonds", "\\hearts"],
        ["\\circledS", "\\spadesuit", "\\spades"],
        ["\\text{\\textcircled a}", "\\maltese", "\\minuso"],
    ];

    const font = [
        ["\\mathrm{Ab0}", "\\mathbf{Ab0}", "\\mathsf{Ab0}"],
        ["\\mathnormal{Ab0}", "\\textbf{Ab0}", "\\textsf{Ab0}"],
        ["\\textrm{Ab0}", "\\bf Ab0", "\\sf Ab0"],
        ["\\rm Ab0", "\\bold{Ab0}", "\\mathsfit{Ab0}"],
        ["\\textnormal{Ab0}", "\\boldsymbol{Ab0}", "\\Bbb{AB}"],
        ["\\text{Ab0}", "\\bm{Ab0}", "\\mathbb{AB}"],
        ["\\textup{Ab0}", "\\textmd{Ab0}", "\\frak{Ab0}"],
        ["\\mathit{Ab0}", "\\mathtt{Ab0}", "\\mathfrak{Ab0}"],
        ["\\textit{Ab0}", "\\texttt{Ab0}", "\\mathcal{AB0}"],
        ["\\it Ab0", "\\tt Ab0", "\\cal AB0"],
        ["\\emph{Ab0}", "", "\\mathscr{AB}"],
    ];

    const size = [
        ["\\Huge AB", "\\normalsize AB"],
        ["\\huge AB", "\\small AB"],
        ["\\LARGE AB", "\\footnotesize AB"],
        ["\\Large AB", "\\scriptsize AB"],
        ["\\large AB", "\\tiny AB"],
    ];

    const style = [
        ["\\displaystyle\\sum_{i=1}^n"],
        ["\\textstyle\\sum_{i=1}^n"],
        ["\\scriptstyle x"],
        ["\\scriptscriptstyle x"],
        ["\\lim\\limits_x"],
        ["\\lim\\nolimits_x"],
        ["\\verb!x^2!"],
    ];
</script>

<p style="margin-top:0">
    Content below copied from <a href="https://katex.org/docs/supported">KaTeX Supported Functions</a>
</p>
<details>
    <summary>Accents</summary>
    <KaTeXReferenceTable functionsArr={accents}></KaTeXReferenceTable>
    <b>Accent functions inside \\text&lbrace;...&rbrace;</b>
    <KaTeXReferenceTable functionsArr={accentsInside}></KaTeXReferenceTable>
</details>

<details>
    <summary>Delimiters</summary>
    <KaTeXReferenceTable functionsArr={delimiters}></KaTeXReferenceTable>
    <p>
        {@html katex.renderToString("\\left(\\frac{1}{2}\\right) \\qquad (\\frac{1}{2})", {
            throwOnError: false,
            displayMode: true,
        })}
        <code
            >\left&lpar;\frac&lbrace;1&rbrace;&lbrace;2&rbrace;\right&rpar; \qquad
            &lpar;\frac&lbrace;1&rbrace;&lbrace;2&rbrace;&rpar;</code
        >
    </p>
    <p>
        {@html katex.renderToString("( \\big( \\Big( \\bigg( \\Bigg(", { throwOnError: false, displayMode: true })}
        <code>&lpar;\big&lpar; \Big&lpar; \bigg&lpar; \Bigg&lpar;</code>
    </p>
    <KaTeXReferenceTable functionsArr={delimiterSizing} noDraw={true}></KaTeXReferenceTable>
</details>

<details>
    <summary>Environments</summary>
    <KaTeXReferenceTable functionsArr={environments}></KaTeXReferenceTable>
    <p>
        The auto-render extension will render the following environments even if they are not inside math delimiters
        such as <code>$$…$$</code>. They are display-mode only.
    </p>
    <KaTeXReferenceTable functionsArr={addEnviro}></KaTeXReferenceTable>
    <b>Other KaTeX Environments</b>
    <table>
        <thead>
            <tr>
                <th>Environments</th>
                <th>How they differ from those shown above</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><code>darray</code>, <code>dcases</code>, <code>drcases</code></td>
                <td> … apply <code>displaystyle</code></td>
            </tr>
            <tr>
                <td
                    ><code>matrix*</code>, <code>pmatrix*</code>, <code>bmatrix*</code>, <code>Bmatrix*</code>,
                    <code>vmatrix*</code>, <code>Vmatrix*</code>
                </td>
                <td
                    >… take an optional argument to set column alignment, as in
                    <code>\begin&lbrace;matrix&rbrace;&lbrack;r&rbrack;</code></td
                >
            </tr>
            <tr>
                <td
                    ><code>equation*</code>, <code>gather*</code>
                    <code>align*</code>, <code>alignat*</code></td
                >
                <td
                    >… have no automatic numbering. Alternatively, you can use <code>\nonumber</code> or
                    <code>\notag</code> to omit the numbering for a specific row of the equation.</td
                >
            </tr>
            <tr>
                <td><code>gathered</code>, <code>aligned</code>, <code>alignedat</code></td>
                <td
                    >… do not need to be in display mode. <br />… have no automatic numbering.<br /> … must be inside math
                    delimiters in order to be rendered by the auto-render extension.</td
                >
            </tr>
        </tbody>
    </table>
    <p>
        Acceptable line separators include: <code>\\</code>, <code>\cr</code>, <code>\\&lbrack;distance&rbrack;</code>,
        and <code>\cr&lbrack;distance&rbrack;</code>. <em>Distance</em> can be written with any of the KaTeX units.
    </p>
    <p>
        The <code>&lbrace;array&rbrace;</code> environment supports <code>|</code> and <code>:</code> vertical separators.
    </p>
    <p>
        The <code>&lbrace;array&rbrace;</code> environment does not yet support <code>\cline</code> or
        <code>\multicolumn</code>.
    </p>
    <p>
        <code>\tag</code> can be applied to individual rows of top-level environments (<code>align</code>,
        <code>align</code>*, <code>alignat</code>, <code>alignat*</code>, <code>gather</code>, <code>gather*</code>).
    </p>
</details>

<details>
    <summary>Letters and Unicode</summary>
    <b>Greek Letters</b>
    <p>
        Direct Input: ABΓΔEZHΘIKΛMNΞOΠPΣTΥΦXΨΩABΓΔEZHΘIKΛMNΞOΠPΣTΥΦXΨΩ
        αβγδϵζηθικλμνξoπρστυϕχψωεϑϖϱςφϝαβγδϵζηθικλμνξoπρστυϕχψωεϑϖϱςφϝ
    </p>
    <KaTeXReferenceTable functionsArr={greek}></KaTeXReferenceTable>
    <b>Other Letters</b>
    <KaTeXReferenceTable functionsArr={otherLetters}></KaTeXReferenceTable>
    <p>Direct Input: ∂∇ℑℲℵℶℷℸ⅁ℏð−∗∂∇ℑℲℵℶℷℸ⅁ℏð−∗ ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖÙÚÛÜÝÞßàáâãäåçèéêëìíîïðñòóôöùúûüýþÿ</p>
    <p>₊₋₌₍₎₀₁₂₃₄₅₆₇₈₉ₐₑₕᵢⱼₖₗₘₙₒₚᵣₛₜᵤᵥₓᵦᵧᵨᵩᵪ⁺⁻⁼⁽⁾⁰¹²³⁴⁵⁶⁷⁸⁹ᵃᵇᶜᵈᵉᵍʰⁱʲᵏˡᵐⁿᵒᵖʳˢᵗᵘʷˣʸᶻᵛᵝᵞᵟᵠᵡ</p>
    <p>
        Math-mode Unicode (sub|super)script characters will render as if you had written regular characters in a
        subscript or superscript. For instance, <code>A²⁺³</code> will render the same as
        <code>A^&lbrace;2+3&rbrace;</code>.
    </p>
    <b>Unicode</b>
    <p>
        Any character can be written with the <code>\char</code> function and the Unicode code in hex. For example
        <code>\char"263a</code> will render as ☺.
    </p>
</details>

<details>
    <summary>Layout</summary>
    <b>Annotation</b>
    <KaTeXReferenceTable functionsArr={annotation}></KaTeXReferenceTable>
    <b>Line Breaks</b>
    <p>
        KaTeX 0.10.0+ will insert automatic line breaks in inline math after relations or binary operators such as “=”
        or “+”. These can be suppressed by <code>\nobreak</code> or by placing math inside a pair of braces, as in
        <code>&lbrace;F=ma&rbrace;</code>. <code>\allowbreak</code> will allow automatic line breaks at locations other than
        relations or operators.
    </p>
    <p>Hard line breaks are <code>\\</code> and <code>\newline</code>.</p>
    <p>
        In display math, KaTeX does not insert automatic line breaks. It ignores display math hard line breaks when
        rendering option <code>strict: true</code>.
    </p>
    <b>Vertical Layout</b>
    <KaTeXReferenceTable functionsArr={vertLayout}></KaTeXReferenceTable>
    <p>
        <code>\raisebox</code> and <code>\hbox</code> put their argument into text mode. To raise math, nest
        <code>$…$</code> delimiters inside the argument as shown above.
    </p>
    <p>
        <code>\vcenter</code> can be written without an <code>\hbox</code> if the strict rendering option is false. In
        that case, omit the nested <code>$…$</code> delimiters.
    </p>
    <b>Overlap and Spacing</b>
    <KaTeXReferenceTable functionsArr={overlap}></KaTeXReferenceTable>
    <p>
        KaTeX also supports <code>\llap</code>, <code>\rlap</code>, and <code>\clap</code>, but they will take only
        text, not math, as arguments.
    </p>
    <b>Spacing</b>
    <table>
        <thead><tr><th>Function</th><th>Produces</th><th>Function</th><th>Produces</th></tr></thead>
        <tbody>
            <tr
                ><td><code>\,</code></td><td>³∕₁₈ em space</td><td><code>\kern&lbrace;distance&rbrace;</code></td><td
                    >space, width = distance</td
                ></tr
            ><tr> </tr><tr
                ><td><code>\thinspace</code></td><td>³∕₁₈ em space</td><td
                    ><code>\mkern&lbrace;distance&rbrace;</code></td
                ><td>space, width = distance</td></tr
            ><tr> </tr><tr
                ><td><code>\&gt;</code></td><td>⁴∕₁₈ em space</td><td><code>\mskip&lbrace;distance&rbrace;</code></td
                ><td>space, width = distance</td></tr
            ><tr> </tr><tr
                ><td><code>\:</code></td><td>⁴∕₁₈ em space</td><td><code>\hskip&lbrace;distance&rbrace;</code></td><td
                    >space, width = distance</td
                ></tr
            ><tr> </tr><tr
                ><td><code>\medspace</code></td><td>⁴∕₁₈ em space</td><td
                    ><code>\hspace&lbrace;distance&rbrace;</code></td
                ><td>space, width = distance</td></tr
            ><tr> </tr><tr
                ><td><code>\;</code></td><td>⁵∕₁₈ em space</td><td><code>\hspace*&lbrace;distance&rbrace;</code></td><td
                    >space, width = distance</td
                ></tr
            ><tr> </tr><tr
                ><td><code>\thickspace</code></td><td>⁵∕₁₈ em space</td><td
                    ><code>\phantom&lbrace;content&rbrace;</code></td
                ><td>space the width and height of content</td></tr
            ><tr> </tr><tr
                ><td><code>\enspace</code></td><td>½ em space</td><td><code>\hphantom&lbrace;content&rbrace;</code></td
                ><td>space the width of content</td></tr
            ><tr> </tr><tr
                ><td><code>\quad</code></td><td>1 em space</td><td><code>\vphantom&lbrace;content&rbrace;</code></td><td
                    >a strut the height of content</td
                ></tr
            ><tr> </tr><tr
                ><td><code>\qquad</code></td><td>2 em space</td><td><code>\!</code></td><td>- ³∕₁₈ em space</td></tr
            ><tr> </tr><tr
                ><td><code>~</code></td><td>non-breaking space</td><td><code>\negthinspace</code></td><td>
                    - ³∕₁₈ em space</td
                ></tr
            ><tr> </tr><tr
                ><td><code>\<space></space></code></td><td>space</td><td><code>\negmedspace</code></td><td
                    >- ⁴∕₁₈ em space</td
                ></tr
            ><tr> </tr><tr
                ><td><code>\nobreakspace</code></td><td>non-breaking space</td><td><code>\negthickspace</code></td><td
                    >- ⁵∕₁₈ em space</td
                ></tr
            ><tr> </tr><tr
                ><td><code>\space</code></td><td>space</td><td><code>\mathstrut</code></td><td
                    ><code>\vphantom&lbrace;&lpar;&rbrace;</code></td
                ></tr
            ><tr> </tr>
        </tbody>
    </table>
    <p>
        Notes:<br /><code>distance</code> will accept any of the KaTeX units.<br /><code>\kern</code>,
        <code>\mkern</code>, <code>\mskip</code>, and <code>\hspace</code> accept unbraced distances, as in:
        <code>\kern1em</code>.<br /><code>\mkern</code> and <code>\mskip</code> will not work in text mode and both will
        write a console warning for any unit except <code>mu</code>.
    </p>
</details>

<details>
    <summary>Logic and Set Theory</summary>
    <KaTeXReferenceTable functionsArr={lsTheory}></KaTeXReferenceTable>
    <p>Direct Input: ∀∴∁∵∃∣∈∉∋⊂⊃∧∨↦→←↔¬∀∴∁∵∃∣∈∈/∋⊂⊃∧∨↦→←↔¬ ℂ ℍ ℕ ℙ ℚ ℝ</p>
</details>

<details>
    <summary>Macros</summary>
    <KaTeXReferenceTable functionsArr={macros}></KaTeXReferenceTable>
    <p>
        Macros can also be defined in settings.<br />Macros accept up to nine arguments: #1, #2, etc.<br />Macros
        defined by <code>\gdef</code>, <code>\xdef</code>, <code>\global\def</code>, <code>\global\edef</code>,
        <code>\global\let</code>, and <code>\global\futurelet</code> will persist between math expressions. (Exception:
        macro persistence may be disabled. There are legitimate security reasons for that.)<br />KaTeX has no
        <code>\par</code>, so all macros are long by default and <code>\long</code> will be ignored.<br />Available
        functions include:<br /><code>\char</code> <code>\mathchoice</code> <code>\TextOrMath</code>
        <code>\@ifstar</code> <code>\@ifnextchar</code> <code>\@firstoftwo</code>
        <code>\@secondoftwo</code> <code>\relax</code> <code>\expandafter</code> <code>\noexpand</code><br />@ is a
        valid character for commands, as if
        <code>\makeatletter</code> were in effect.
    </p>
</details>

<details>
    <summary>Operators</summary>
    <b>Big Operators</b>
    <KaTeXReferenceTable functionsArr={operators}></KaTeXReferenceTable>
    <p>Direct Input: ∫∬∭∮∏∐∑⋀⋁⋂⋃⨀⨁⨂⨄⨆∫∬∭∮∏∐∑⋀⋁⋂⋃⨀⨁⨂⨄⨆ ∯ ∰</p>
    <b>Binary Operators</b>
    <KaTeXReferenceTable functionsArr={binOps}></KaTeXReferenceTable>
    <p>Direct Input: +−/∗⋅∘∙±×÷∓∔∧∨∩∪≀⊎⊓⊔⊕⊖⊗⊘⊙⊚⊛⊝◯∖+−/∗⋅∘∙±×÷∓∔∧∨∩∪≀⊎⊓⊔⊕⊖⊗⊘⊙⊚⊛⊝◯∖</p>
    <b>Fractions and Binomials</b>
    <KaTeXReferenceTable functionsArr={frac}></KaTeXReferenceTable>
    <KaTeXReferenceTable functionsArr={binomials}></KaTeXReferenceTable>
    <b>Math Operators</b>
    <KaTeXReferenceTable functionsArr={mathOps}></KaTeXReferenceTable>
    <p>Functions in the bottom six rows of this table can take <code>\limits</code>.</p>
    <b>Square Root</b>
    <KaTeXReferenceTable functionsArr={[["\\sqrt{x}"], ["\\sqrt[3]{x}"]]}></KaTeXReferenceTable>
</details>

<details>
    <summary>Relations</summary>
    <KaTeXReferenceTable functionsArr={relations}></KaTeXReferenceTable>
    <p>
        Direct Input: =&lt;&gt;:∈∋∝∼∽≂≃≅≈≊≍≎≏≐≑≒≓≖≗≜≡≤≥≦≧≫≬≳≷≺≻≼≽≾≿⊂⊃⊆⊇⊏⊐⊑⊒⊢⊣⊩⊪⊸⋈⋍⋐⋑⋔⋙⋛⋞⋟⌢⌣⩾⪆⪌⪕⪖⪯⪰⪷⪸⫅⫆≲⩽⪅≶⋚⪋⊥⊨⊶⊷ ≔ ≕ ⩴
    </p>
    <b>Negated Relations</b>
    <p>{@html katex.renderToString("\\not =", { throwOnError: false, displayMode: true })}<code>\not =</code></p>
    <KaTeXReferenceTable functionsArr={negRelations}></KaTeXReferenceTable>
    <p>Direct Input: ∉∌∤∦≁≆≠≨≩≮≯≰≱⊀⊁⊈⊉⊊⊋⊬⊭⊮⊯⋠⋡⋦⋧⋨⋩⋬⋭⪇⪈⪉⪊⪵⪶⪹⪺⫋⫌∈/∋∤∦≁≆=≨≩≮≯≰≱⊀⊁⊈⊉⊊⊋⊬⊭⊮⊯⋠⋡⋦⋧⋨⋩⋬⋭⪇⪈⪉⪊⪵⪶⪹⪺⫋⫌</p>
    <b>Arrows</b>
    <KaTeXReferenceTable functionsArr={arrows}></KaTeXReferenceTable>
    <p>
        Direct Input:
        ←↑→↓↔↕↖↗↘↙↚↛↞↠↢↣↦↩↪↫↬↭↮↰↱↶↷↺↻↼↽↾↾↿⇀⇁⇂⇃⇄⇆⇇⇈⇉⇊⇋⇌⇍⇎⇏⇐⇑⇒⇓⇔⇕⇚⇛⇝⇠⇢⟵⟶⟷⟸⟹⟺⟼←↑→↓↔↕↖↗↘↙↚↛↞↠↢↣↦↩↪↫↬↭↮↰↱↶↷↺↻↼↽↾↾↿⇀⇁⇂⇃⇄⇆⇇⇈⇉⇊⇋⇌⇍⇎⇏⇐⇑⇒⇓⇔⇕⇚⇛⇝⇠⇢⟵⟶⟷⟸⟹⟺⟼
        ↽
    </p>
    <b>Extensible Arrows</b>
    <KaTeXReferenceTable functionsArr={extensibleArrows}></KaTeXReferenceTable>
    <p>
        Extensible arrows all can take an optional argument in the same manner as <code
            >\xrightarrow&lpar;under&rpar;&lbrace;over&rbrace;</code
        >.
    </p>
</details>

<details>
    <summary>Special Notation</summary>
    <b>Bra-ket Notation</b>
    <KaTeXReferenceTable functionsArr={braketNotation}></KaTeXReferenceTable>
</details>

<details>
    <summary>Style, Color, Size, and Font</summary>
    <b>Class Assignment</b>
    <p>
        <code>\mathbin</code> <code>\mathclose</code> <code>\mathinner</code> <code>\mathop</code>
        <code>\mathopen</code> <code>\mathord</code> <code>\mathpunct</code> <code>\mathrel</code>
    </p>
    <b>Color</b>
    <p>
        Note that <code>\color</code> acts like a switch. Other color functions expect the content to be a function argument
    </p>
    <KaTeXReferenceTable functionsArr={colors}></KaTeXReferenceTable>
    <p>
        Note that, as in LaTeX, <code>\colorbox</code> & <code>\fcolorbox</code> renders its third argument as text, so
        you may want to switch back to math mode with <code>$</code> as in the examples above.
    </p>
    <p>
        For color definition, KaTeX color functions will accept the standard HTML predefined color names. They will also
        accept an RGB argument in CSS hexadecimal style. The "#" is optional before a six-digit specification.
    </p>
    <b>Font</b>
    <KaTeXReferenceTable functionsArr={font}></KaTeXReferenceTable>
    <p>
        One can stack font family, font weight, and font shape by using the <code>\textXX</code> versions of the font
        functions. So <code>\textsf&lbrace;\textbf&lbrace;H&rbrace;&rbrace;</code> will produce: {@html katex.renderToString(
            "\\textsf{\\textbf{H}}",
            { throwOnError: false, displayMode: true },
        )}The other versions do not stack, e.g., <code>\mathsf&lbrace;\mathbf&lbrace;H&rbrace;&rbrace;</code> will
        produce: {@html katex.renderToString("\\mathsf{\\mathbf{H}}", { throwOnError: false, displayMode: true })}
    </p>
    <p>
        In cases where KaTeX fonts do not have a bold glyph, <code>\pmb</code> can simulate one. For example,
        <code>\pmb&lbrace;\mu&rbrace;</code>
        renders as : {@html katex.renderToString("\\pmb{\\mu}", { throwOnError: false, displayMode: true })}
    </p>
    <b>Size</b>
    <KaTeXReferenceTable functionsArr={size}></KaTeXReferenceTable>
    <b>Style</b>
    <KaTeXReferenceTable functionsArr={style}></KaTeXReferenceTable>
    <p>
        <code>\text&lbrace;…&rbrace;</code> will accept nested <code>$…$</code> fragments and render them in math mode.
    </p>
</details>

<details>
    <summary>Symbols and Punctuation</summary>
    <KaTeXReferenceTable functionsArr={symbols}></KaTeXReferenceTable>
    <p>Direct Input: § ¶ £¥∇∞⋅∠∡∢♠♡♢♣♭♮♯✓…⋮⋯⋱!£¥∇∞⋅∠∡∢♠♡♢♣♭♮♯✓…⋮⋯⋱! ‼ ⦵</p>
</details>

<details>
    <summary>Units</summary>
    <p>
        In KaTeX, units are proportioned as they are in TeX.<br />
        KaTeX units are different than CSS units.
    </p>
    <table>
        <thead>
            <tr>
                <td>KaTeX Unit</td>
                <td>Value</td>
                <td>KaTeX Unit</td>
                <td>Value</td>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>em</td>
                <td>CSS em</td>
                <td>bp</td>
                <td>1/72 inch x F x G</td>
            </tr>
            <tr>
                <td>ex</td>
                <td>CSS ex</td>
                <td>pc</td>
                <td>12 KaTeX pt</td>
            </tr>
            <tr>
                <td>mu</td>
                <td>1/18 CSS em</td>
                <td>dd</td>
                <td>1238/1157 KaTeX pt</td>
            </tr>
            <tr>
                <td>pt</td>
                <td>1/72.27 inch x F x G</td>
                <td>cc</td>
                <td>14856/1157 KaTeX pt</td>
            </tr>
            <tr>
                <td>mm</td>
                <td>1 mm x F x G</td>
                <td>nd</td>
                <td>685/642 KaTeX pt</td>
            </tr>
            <tr>
                <td>cm</td>
                <td>1 cm x F x G</td>
                <td>nc</td>
                <td>1370/107 KaTeX pt</td>
            </tr>
            <tr>
                <td>in</td>
                <td>1 inch x F x G</td>
                <td>sp</td>
                <td>1/65536 KaTeX pt</td>
            </tr>
        </tbody>
    </table>
    <p>
        where:<br />F = (font size of surrounding HTML text)/(10 pt)<br />G = 1.21 by default, because KaTeX font-size
        is normally 1.21x the surrounding font size.
    </p>
    <p>The effect of style and size:</p>
    <table>
        <thead>
            <tr>
                <th>Unit</th>
                <th>textstyle</th>
                <th>scriptscript</th>
                <th>huge</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>em or ex</td>
                <td>{@html katex.renderToString("\\rule{1em}{1em}", { throwOnError: false, displayMode: true })}</td>
                <td
                    >{@html katex.renderToString("\\scriptscriptstyle\\rule{1em}{1em}", {
                        throwOnError: false,
                        displayMode: true,
                    })}</td
                >
                <td
                    >{@html katex.renderToString("\\huge\\rule{1em}{1em}", {
                        throwOnError: false,
                        displayMode: true,
                    })}</td
                >
            </tr>
            <tr>
                <td>mu</td>
                <td>{@html katex.renderToString("\\rule{18mu}{18mu}", { throwOnError: false, displayMode: true })}</td>
                <td
                    >{@html katex.renderToString("\\scriptscriptstyle\\rule{18mu}{18mu}", {
                        throwOnError: false,
                        displayMode: true,
                    })}</td
                >
                <td
                    >{@html katex.renderToString("\\huge\\rule{18mu}{18mu}", {
                        throwOnError: false,
                        displayMode: true,
                    })}</td
                >
            </tr>
            <tr>
                <td>others</td>
                <td>{@html katex.renderToString("\\rule{10pt}{10pt}", { throwOnError: false, displayMode: true })}</td>
                <td
                    >{@html katex.renderToString("\\scriptscriptstyle\\rule{10pt}{10pt}", {
                        throwOnError: false,
                        displayMode: true,
                    })}</td
                >
                <td
                    >{@html katex.renderToString("\\huge\\rule{10pt}{10pt}", {
                        throwOnError: false,
                        displayMode: true,
                    })}</td
                >
            </tr>
        </tbody>
    </table>
</details>

<p>
    <span
        >Can't find the symbol you're looking for, but can draw it?<br /> Try
        <a href="https://detexify.kirelabs.org/classify.html">Detexify</a></span
    >
</p>
