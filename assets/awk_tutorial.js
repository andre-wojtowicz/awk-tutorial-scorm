const CMD_START = "awk '"

function trim(awkStr, filename) {
    return awkStr.substr(5, awkStr.length - (4 + filename.length + 3))
}

async function call_awk(sourceText, awkStrParsed) {
    const awk = await awkJS()
    return awk.awk(sourceText, awkStrParsed, [])
}

async function handle_enter(input) {

    const filename = input.parentElement.dataset['awk_file']
    const soln = input.parentElement.dataset['awk_soln']

    const sourceText = document.getElementById(input.parentElement.dataset['awk_file']).value
    const awkStr = input.textContent.replace("\n", "");
    if (!awkStr.startsWith(CMD_START)) {
        alert("Twoje polecenie musi zaczynać się od `awk '`");
        return
    }
    if (!awkStr.endsWith('\' ' + filename)) {
        alert("Twoje polecenie musi kończyć się `' " + filename + "`")
        return
    }
    let awkStrParsed = trim(awkStr, filename);
    let output;
    const outputNode = input.parentElement.querySelector(".awk_output");
    outputNode.style.display = "block";

    outputNode.classList.remove("incorrect")
    outputNode.classList.remove("exception")
    outputNode.classList.remove("correct")


    try {
        output = await call_awk(sourceText, awkStrParsed);
    } catch (error) {
        console.info("adding exception", error);
        outputNode.classList.add('exception')
        outputNode.innerText = ">>> Wyjątek: Wystąpił nieznany błąd...\n>>> Upewnij się, że wyrażenia są pomiędzy nawiasami klamrowymi { i }.";
        return
    }

    if (output.stderr !== "") {
        console.info("adding exception");
        outputNode.classList.add('exception')
        outputNode.innerText = ">>> Wyjątek: " + output.stderr;
        return
    }
    outputNode.classList.remove('exception')


    const oracle_output = await call_awk(sourceText, trim(SOLUTIONS[soln], filename))

    if (oracle_output.stdout === output.stdout) {
        outputNode.classList.add("correct")
        outputNode.innerText = output.stdout;
    } else {
        console.info(oracle_output.output, output.stdout)
        outputNode.classList.add("incorrect")
        outputNode.innerText = ">>> Otrzymany wynik nie pasuje do oczekiwanego rozwiązania.\n>>> Spróbuj ponownie lub naciśnij 'Pokaż rozwiązanie'.\n" + output.stdout
    }

}

const SOLUTIONS = {
    'hello_world0': 'awk \'{ print $0 }\' mail_list',
    'hello_world': 'awk \'{ print $1 }\' mail_list',
    'hello_world2': 'awk \'{ print $1 " " $2  }\' mail_list',
    'column_1': 'awk \'$1 == "Bill" { print $2 }\' mail_list',
    'vars1': 'awk \'{ s += length($1) } END { print s } \' mail_list',
    'regex': 'awk \'$1 ~ /^[AEIOUYaeiouy]+$/ { print $1 }\' mail_list',
    'ifelse' : 'awk \'{if ($2 > 64) { print "(senior) " $1 } else {print $1}}\' people',
    'ifelseUSA': 'awk \' {  if ( $1 == "Bill" ) { print $1 } else { } }\' people',
    'logical1': 'awk \'$2 >= 65 && $3 == "USA" {print $1}\' people',
    'logical2': 'awk \'$2 >= 65 || $3 == "NG" {print $1}\' people',
    'multPatt': 'awk \'$3 == "USA" && $2 >= 65 { usa += 1 } $3 != "USA" && $2 >= 65 { non_usa += 1 } END { print usa " " non_usa }\' people',
    'odd': 'awk \'NR % 2 == 1 { print $0 }\' people',
    'column_2': 'awk \'$1 == "Bill" { print $2 } $2 == "555-3430" { print $1 }\' mail_list',
    'phonenum': 'awk \'$1 == "Bill" { print $2 } $2 == "555-3430" { print $1 }\' mail_list',
    'beginend': 'awk \'BEGIN { print "I run first" } { print "I run every line" } END { print "I run last" }\' mail_list',
    'beginend2': 'awk \'BEGIN { x = 1000 } { x += 1 } END { print x }\' mail_list',
}

function reveal(button) {
    const awk_soln = button.parentElement.dataset['awk_soln'];
    console.info(awk_soln)
    const input = button.parentElement.querySelector('.awk_input');
    console.info(input)
    input.innerHTML = SOLUTIONS[awk_soln];
    handle_enter(input);
}
function awk_run(button) {
    handle_enter(button.parentElement.querySelector('.awk_input'))
}

document.addEventListener("DOMContentLoaded", function (event) {
    const inputs = document.getElementsByClassName('awk_input');
    for (let i = 0; i < inputs.length; i++) {
        inputs[i].addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                e.preventDefault()
                handle_enter(inputs[i])
            }
        })
    }
});
