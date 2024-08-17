const CMD_START = "awk '"

function trim(awkStr, filename) {
    return awkStr.substr(5, awkStr.length - (4 + filename.length + 3))
}

async function call_awk(sourceText, awkStrParsed) {
    const awk = await awkJS()
    return awk.awk(sourceText, awkStrParsed, [])
}

const SOLUTIONS_A = {
    'hello_world0': 'awk \'{ print $0 }\' mail_list',
    'hello_world': 'awk \'{ print $1 }\' mail_list',
    'hello_world2': 'awk \'{ print $1 " " $2  }\' mail_list',
    'column_1': 'awk \'$1 == "Bill" { print $2 }\' mail_list',
    'vars1': 'awk \'{ s += length($1) } END { print s } \' mail_list',
    'regex': 'awk \'$1 ~ /^[AEIOUYaeiouy]+$/ { print $1 }\' mail_list',
    'ifelse' : 'awk \'{if ($2 >= 65) { print "(senior) " $1 } else {print $1}}\' people',
    'ifelseUSA': 'awk \' {  if ( $1 == "Bill" ) { print $1 } else { } }\' people',
    'logical1': 'awk \'$2 >= 65 && $3 == "USA" {print $1}\' people',
    'logical2': 'awk \'$2 >= 65 || $3 == "NG" {print $1}\' people',
    'multPatt': 'awk \'$3 == "USA" && $2 >= 65 { usa += 1 } $3 != "USA" && $2 >= 65 { non_usa += 1 } END { print usa " " non_usa }\' people',
    'odd': 'awk \'NR % 2 == 1 { print $0 }\' people',
    'column_2': 'awk \'$1 == "Bill" { print $2 } $2 == "555-3430" { print $1 }\' mail_list',
    'phonenum': 'awk \'$1 == "Bill" { print $2 } $2 == "555-3430" { print $1 }\' mail_list',
    'beginend': 'awk \'BEGIN { print "start" } { print "dla każdej linii" } END { print "koniec" }\' mail_list',
    'beginend2': 'awk \'BEGIN { x = 1000 } { x += 1 } END { print x }\' mail_list',
}

const SOLUTIONS_B = { 
    'exercise_11': '$1 == "Frances-Spence" { print $0 }',
    'exercise_12': '{ arr[$1] += $2 } END { print arr["Moondog"] }',
    'exercise_13': '{ arr[$1] += $2 } \nEND { \n    for (key in arr) {\n         print key " " arr[key]\n     }\n }',
    'exercise_14': '{ arr[$1] += $2 } \n' +
        'END { \n' +
        '    max = "not_set"\n' +
        '    max_person = "not_set"\n' +
        '    for (key in arr) {\n' +
        '         if (arr[key] > max || max == "not_set") {\n' +
        '             max = arr[key]\n' +
        '             max_person = key\n' +
        '         }\n' +
        '    }\n' +
        '    print max_person\n' +
        ' }',
    'exercise_15': 'END { \n' +
        '    arr[0] = 0\n' +
        '    arr[1] = 1\n' +
        '    for (i = 2 ; i < 100; i++) {\n' +
        '        arr[i] += arr[i-1] + arr[i-2]\n' +
        '    }\n' +
        '    for (i = 0; i < 100; i++) {\n' +
        '        total += arr[i]\n' +
        '        print i " " total\n' +
        '    } \n' +
        '}\n',
    'loop_example': 'END {\n' +
        '    for (i = 0; i < 10; i++) {\n' +
        '        arr[i] = i*i;\n' +
        '        print i \" => \" arr[i]\n' +
        '    }\n' +
        '}',
    'exercise_16': 'END {\n' +
        '    for ( i = 1; i < 100; i++) {\n' +
        '        arr[i] = i\n' +
        '    }\n' +
        '    for ( i = 2; i < 100; i++) {\n' +
        '        for ( curr = i + i; curr < 100; curr += i) { \n' +
        '            delete arr[curr]\n' +
        '        }\n' +
        '    }\n' +
        '    for ( i = 0; i < 100; i++) {\n' +
        '        if (i in arr) { print i }\n' +
        '    }\n' +
        '}',
}

async function handle_enter(input) {

    const filename = input.parentElement.parentElement.dataset['awk_file']
    const soln = input.parentElement.parentElement.dataset['awk_soln']

    const sourceText = text_editors[input.parentElement.parentElement.dataset['awk_file']].getValue();
    const awkStr = editors[input.id].getValue().replace("\n", "");
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
    const outputNode = input.parentElement.parentElement.querySelector(".awk_output");
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


    const oracle_output = await call_awk(sourceText, trim(SOLUTIONS_A[soln], filename))

    if (oracle_output.stdout === output.stdout) {
        outputNode.classList.add("correct")
        outputNode.innerText = output.stdout;
    } else {
        //console.info(oracle_output.output, output.stdout)
        outputNode.classList.add("incorrect")
        outputNode.innerText = ">>> Otrzymany wynik nie pasuje do oczekiwanego rozwiązania.\n>>> Spróbuj ponownie.\n" + output.stdout
    }

}

async function run_awk_input(root) {
    const root_metadata = metadata_from_root(root);
    const output_node = root_metadata.output_node;

    output_node.classList.remove('exception')
    output_node.classList.remove("correct")
    output_node.classList.remove("incorrect")


    let output = null;
    try {
        output = await call_awk(root_metadata.text_source_content, root_metadata.awk_source_content);
    } catch {
        output_node.classList.add('exception')
        output_node.innerText = ">>> Wyjątek: Wystąpił nieznany błąd...\nUpewnij się, że wyrażenia są pomiędzy nawiasami klamrowymi { i }.";
        return
    }

    if (output.stderr !== "") {
        output_node.classList.add('exception')
        output_node.innerText = ">>> Wyjątek: " + output.stderr;
        return
    }


    const oracle_output = await call_awk(
        root_metadata.text_source_content,
        root_metadata.soln);

    if (oracle_output.stdout === output.stdout) {
        output_node.classList.add("correct")
        output_node.innerText = output.stdout;
    } else {
        output_node.classList.add("incorrect")
        output_node.innerText = ">>> Otrzymany wynik nie pasuje do oczekiwanego rozwiązania.\n>>> Spróbuj ponownie.\n" + output.stdout
    }

}

function awk_run(button) {
    handle_enter(button.parentElement.querySelector('.awk_input'))
}

function run(button) {
    run_awk_input(button.parentElement.parentElement.parentElement);
}

function metadata_from_root(root) {
    const text_source_id = root.dataset['txt_source'];
    const text_source_node = text_editors[text_source_id];
    const text_source_content = text_source_node.getValue();
    const awk_source_node = root.querySelector('.awk_source');
    const awk_source_content = editors[awk_source_node.id].getValue();
    const output_node = root.querySelector('.awk_output');

    return {
        'soln': SOLUTIONS_B[root.dataset['soln']],
        text_source_id,
        text_source_node,
        text_source_content,
        awk_source_node,
        awk_source_content,
        output_node,
    };
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

    const source_areas = document.querySelectorAll('.awk_source');
    //console.info("sources", source_areas, source_areas.length);
    for (let i = 0; i < source_areas.length; i++) {
        source_areas[i].addEventListener('keydown', async function (event) {
            if ((event.metaKey && event.keyCode === 13) || (event.ctrlKey && event.keyCode === 13)) {
                const parent = source_areas[i].parentElement.parentElement;
                await run_awk_input(parent);
            }
        })
    }
});
