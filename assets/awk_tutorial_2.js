document.addEventListener('DOMContentLoaded', function () {
    const source_areas = document.querySelectorAll('.awk_source');
    console.info("sources", source_areas, source_areas.length);

    for (let i = 0; i < source_areas.length; i++) {
        source_areas[i].addEventListener('keydown', async function (event) {
            if ((event.metaKey && event.keyCode === 13) || (event.ctrlKey && event.keyCode === 13)) {
                const parent = source_areas[i].parentElement.parentElement;
                await run_awk_input(parent);
            }
        })
    }
});


async function call_awk(sourceText, awk_command) {
    const awk = await awkJS()
    return awk.awk(sourceText, awk_command, [])
}

const SOLUTIONS = {
    'exercise_1': '$1 == "Frances-Spence" { print $0 }',
    'exercise_2': '{ arr[$1] += $2 } END { print arr["Moondog"] }',
    'exercise_3': '{ arr[$1] += $2 } \nEND { \n    for (key in arr) {\n         print key " " arr[key]\n     }\n }',
    'exercise_4': '{ arr[$1] += $2 } \n' +
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
    'exercise_5': 'END { \n' +
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
    'exercise_6': 'END {\n' +
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
        output_node.innerText = ">>> Otrzymany wynik nie pasuje do oczekiwanego rozwiązania.\n>>> Spróbuj ponownie lub naciśnij 'Pokaż rozwiązanie'.\n" + output.stdout
    }

}

function run(button) {
    run_awk_input(button.parentElement.parentElement.parentElement);
}

function reveal(button) {
    const root = button.parentElement.parentElement.parentElement;
    const rootmetadata = metadata_from_root(root);
    rootmetadata.awk_source_node.value = rootmetadata.soln;
    run_awk_input(root);
}

function metadata_from_root(root) {
    const text_source_id = root.dataset['txt_source'];
    const text_source_node = document.getElementById(text_source_id);
    const text_source_content = text_source_node.value;
    const awk_source_node = root.querySelector('.awk_source');
    const awk_source_content = awk_source_node.value;
    const output_node = root.querySelector('.awk_output');
    return {
        'soln': SOLUTIONS[root.dataset['soln']],
        text_source_id,
        text_source_node,
        text_source_content,
        awk_source_node,
        awk_source_content,
        output_node,
    };
}
