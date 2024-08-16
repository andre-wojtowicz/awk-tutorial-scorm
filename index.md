---
layout: page
title:  "AWK tutorial"
---

## Basic `awk`

<link rel="stylesheet" href="assets/main.css">
<script src="assets/awk.js"></script>
<script src="assets/awk_tutorial.js"></script>

<script src="assets/ace.min.js"></script>
<script>
    var editors = {};
    var text_editors = {};
</script>

`awk` is a language that takes whitespace separated input files (columns), matches them against patterns, and executes
code for each match.
`awk` is available on almost every single linux system.

```plaintext
# For every line execute code if the pattern matches that line
pattern { code }
    
# Run code for every line
{ code } 
```

Here's an example of an awk command that just returns its input (`$0` refers to the full source line). Click into the terminal and press `Enter`.

{% include awk_console.html awk_file="mail_list" awk_soln="hello_world0" awk_init="awk '{ print $0 }' mail_list" %}

Here's an example of data ready for awk to process `./mail_list`. You can edit this data and the terminals below will
use the new data.

<div class="awk"><br/>
<span class="awk_file_name_hover">mail_list</span>
<div spellcheck="false" class="awk_text" id="mail_list">Amelia       555-5553    amelia.zodiacusque@gmail.com       F
Anthony      555-3412    anthony.asserturo@hotmail.com      A
Becky        555-7685    becky.algebrarum@gmail.com         A
Bill         555-1675    bill.drowning@hotmail.com          A
Broderick    555-0542    broderick.aliquotiens@yahoo.com    R
Camilla      555-2912    camilla.infusarum@skynet.be        R
Fabius       555-1234    fabius.undevicesimus@ucb.edu       F
Julie        555-6699    julie.perscrutabor@skeeve.com      F
Yoeu         555-1331    yoeu.blah@blarg.co.uk              F
Martin       555-6480    martin.codicibus@hotmail.com       A
Samuel       555-3430    samuel.lanceolis@shu.edu           A
Jean-Paul    555-2127    jeanpaul.campanorum@nyu.edu        R
Eyau         555-1133    eyau@campos.cmyk.rgb               R
Bill         555-1337    billiam.billy@cal.tech.edu         R</div>
</div>
<script>
    var editor = ace.edit("mail_list");
    editor.setShowPrintMargin(false);
    editor.setTheme("ace/theme/monokai");
    editor.session.setMode("ace/mode/text");
    text_editors["mail_list"] = editor;
</script>


Let's try an easy example with no pattern. Printing the first column (`$1`). (Press enter to run)

{% include awk_console.html awk_file="mail_list" awk_soln="hello_world" awk_init="awk '{ print $1 }' mail_list" %}

Next let's print columns `$1` and `$2` separated by a space `" "` <br/>That looks like this : `$1 " " $2`<br/> `print` will accept multiple arguments separated by
spaces (no plus signs here)

You'll need to modify the code this time, adding " "

{% include awk_console.html awk_file="mail_list" awk_soln="hello_world2" awk_init="awk '{ print $1 $2 }' mail_list" %}

Okay how about a pattern? You saw `$1` means column one. How about printing the phone number for every Bill?

{% include awk_console.html awk_file="mail_list" awk_soln="column_1" awk_init="awk '$1 == \"Bill\" { }' mail_list" %}

Next let's try multiple patterns. In addition to printing all Bill's phone numbers let's print the name of the person with 
the phone number `555-3430`.

```pattern1 { code1 } pattern2 { code2 }```

{% include awk_console.html awk_file="mail_list" awk_soln="phonenum" awk_init="awk '$1 == \"Bill\" { print $1 }' mail_list" %}

awk variables can be initialized in a `BEGIN { x = 0 }` pattern or just default to 0.
Similarly the `END` pattern matches once after all rows are complete. Thus far we've used plain `{ code }` with no begin nor end preceeding it.
These blocks run on every line.

Try running these two examples to get an idea of how BEGIN and END work.

{% include awk_console.html awk_file="mail_list" awk_soln="beginend" awk_init="awk 'BEGIN { print \"I run first\" } { print \"I run every line\" } END { print \"I run last\" }' mail_list"%}

{% include awk_console.html awk_file="mail_list" awk_soln="beginend2" awk_init="awk 'BEGIN { x = 1000 } { x += 1 } END { print x }' mail_list" %}

Here's an example where we add 5 to s for each line. awk also supplies a `length()` function that can accept a column.
Can you sum the length of everyone's name?

{% include awk_console.html awk_file="mail_list" awk_soln="vars1" awk_init="awk '{ s += 5 } END { print s } ' mail_list"%}

awk can also use regular expressions as patterns. You can match your regex against the entire line
`/regex/ { code }` or against a column `$1 ~ /regex/ { code }`.

Here's a regex that matches any word containing only vowels `/^[AEIOUYaeiouy]+$/` can use you use it to match names with
only vowels and print them?

{% include awk_console.html awk_file="mail_list" awk_soln="regex" awk_init="awk '/^[AEIOUYaeiouy]+$/ {}' mail_list" %}

Control flow! `awk` has `if` and `else` like other languages. Here we have a dataset of names, ages, and countries.
Let's try and use if else to print (senior) + the name of everyone whose age is over 65.

`optionalPattern { if (something >= else) { do this } else { do that }}`

<div class="awk"><br/>
<span class="awk_file_name_hover">people</span>
<div spellcheck="false" class="awk_text" id="people">Frances-Spence         90    USA
菅義偉                  72    JP
Nate                   21    USA
Moondog                83    USA
Michael-Fastbender     42    USA
沈向洋                  54    CN
Jordan-Etude           13    USA
Aditi-Acharya          83    IN
차미영                   41    KR
Navya-Reddy            55    IN
Bolade-Ibrahim         28    NG
Jean-Bartik            87    USA
Leslie-Lamport         80    USA</div>
</div>
<script>
    var editor = ace.edit("people");
    editor.setShowPrintMargin(false);
    editor.setTheme("ace/theme/monokai");
    editor.session.setMode("ace/mode/text");
    text_editors["people"] = editor;
</script>

```
# Output format:
(senior) Frances Spence
Nate
DojaCat
...
(senior) Jean-Bartik
```

{% include awk_console.html awk_file="people" awk_soln="ifelse" awk_init="awk '{}' people" %}

Let's try some logic! `awk` supports logical and: `&&` as well as logical or: `||`
Try and use `&&` and `||` to write a pattern that matches only seniors in the USA.

{% include awk_console.html awk_file="people" awk_soln="logical1" awk_init="awk '$2 >= 65 {print $1}' people" %}

Next try seniors OR people in nigeria (NG).

{% include awk_console.html awk_file="people" awk_soln="logical2" awk_init="awk '$2 >= 65 {print $1}' people" %}

How about summing up the number of seniors inside and outside of the USA? Just like we implicitly created variables
using `{ s += length($2) }`
earlier we can create two new variables to count seniors in/out of the USA.

Try doing this two ways

1. Matching every line with a senior and then using if/else on $3
2. Using two patterns one that matches seniors in the USA and one that matches seniors not the USA

Multiple patterns looks like this

`awk 'pattern1 { code1 } pattern2 { code2 } END { finalCode }' people`

Your solution should be two numbers separated by a space `4 2`

{% include awk_console.html awk_file="people" awk_soln="multPatt" awk_init="awk '{}' people" consoleClass="consoleH2" %}

`awk` has a few builtins, these are variables defined for you. Here are a few:

|name|value|
|----|----|
|FS|Field separator (space in our examples)|
|RS|Record separtor (newline here)|
|NF|Number of columns (fields)|
|NR|Index of current row (record)|
|$0|Full Line (all columns)|

See if you can use this to pull out only the odd rows from the people dataset. (`awk` supports `%` and `/`)

{% include awk_console.html awk_file="people" awk_soln="odd" awk_init="awk '{}' people" %}

When you're using awk from the command line you'll also have access to flags (we can't use them easily here on the web).
A few flags worth knowing are

<table>
    <thead>
        <th>flag</th>
        <th>example</th>
        <th>purpose</th>
    </thead>
    <tbody>
        <tr>
            <td>F</td>
            <td>awk -F:</td>
            <td>Columns are separated by a colon `:`</td>
        </tr>
        <tr>
            <td>f</td>
            <td>awk -f script.awk</td>
            <td>Load awk script from a file instead of the command line</td>
        </tr>
        <tr>
            <td>v</td>
            <td>awk -v init=1</td>
            <td>the variable init begins as 1 instead of the default 0 
<br>Equivalent to awk 'BEGIN { init = 1 } ...</td>
        </tr>
    </tbody>
</table>



## An interactive guide to awk's arrays and loops

`awk` is a language that takes whitespace separated input files (columns), matches them against patterns, and executes
code for each match.
`awk` is available on almost every single linux system.

But you already new that. Because you've done the "[Basic awk: an interactive introduction to awk](/projects/awk.html)" 
tutorial already. We're diving right in and I won't be re-explaining things from basic awk. Fair warning. 

Here's the some similar earnings data to last time. People are listed multiple times. 

<div class="awk"><br/>
<span class="awk_file_name_hover">earnings.txt</span>
<div spellcheck="false" aria-label="Earnings text source file" class="awk_text" id="earnings">Frances-Spence         90     USA
菅義偉                  72     JP
Nate                   -21    USA
Nate                   22     USA
Nate                   -65    USA
Moondog                83     USA
Moondog                24     USA
Michael-Fastbender     42     USA
沈向洋                  54     CN
Jordan-Etude           13     USA
Aditi-Acharya          83     IN
차미영                   41     KR
Frances-Spence         -80    USA
Frances-Spence         43     USA
Navya-Reddy            55     IN
Moondog                13     USA
Bolade-Ibrahim         28     NG
Bolade-Ibrahim         -10    NG
Jean-Bartik            87     USA
Leslie-Lamport         80     USA</div>
</div>
<script>
    var editor = ace.edit("earnings");
    editor.setShowPrintMargin(false);
    editor.setTheme("ace/theme/monokai");
    editor.session.setMode("ace/mode/text");
    text_editors["earnings"] = editor;
</script>

This time we'll be writing longer awk programs so we'll run our `awk` from `.awk` files (think .c .py .js, .rs) with `awk -f file.awk input.txt`.

Edit the `.awk` file and click the 
<button disabled class='awk_example_button'>awk -f exercise.awk source.txt</button> 
command in the textbox when you're ready (or MacOS: `⌘+Enter` Windows: `Ctrl+Enter`).

You can also view my solution by clicking <button disabled class='awk_example_button'>Show Solution</button>

The first challenge is a <small>tiny</small> review. Print the entire row `$0` if the name is "Frances-Spence"

{% include awk_file.html id="exercise_1" filename="exercise-1" soln="exercise_1" txt_source="earnings" init="{ print $0 }" %} 

`awk` arrays are dictionaries where keys can be anything (though they are stringified) and values can also be anything. 
Like all `awk` variables arrays require no initialization. 

If you wanted to add the number in column 2 under the name in column 1 you could do this `sums[$1] += $2`.

Try it out. Sum the earnings (column 2) of each person. At the end print the total earnings of Moondog &nbsp; `arr["Moondog"]` &nbsp;. We'll go over how to loop
over everyone's earnings next. (Note: you might want to use an `END` pattern here)


{% include awk_file.html id="exercise_2" filename="exercise_2" soln="exercise_2" txt_source="earnings" init="{ print $0 }" %} 

Okay fine. You summed them. Let's print them all. `awk` has for-each syntax. It looks like this.

`for (key in arr) {  print key " " arr[key] }`

Now let's have you print everyone's name and their total using the for syntax (separated by a single space).
{% include awk_file.html awk_src_class="awk_src_medium" id="exercise_3" filename="exercise_3" soln="exercise_3" txt_source="earnings" init="{ print $0 }" %} 


Good good. Okay now can you use a temporary variable to find the person with the highest total? This will require
combining `for (key in arr)` and if statements like `if (val > max) { max = val }` 

{% include awk_file.html awk_src_class="awk_src_medium" id="exercise_4" filename="exercise_4" soln="exercise_4" txt_source="earnings" init="{ print $0 }" %}

Arrays can of course also uses numbers as indices. 
I'm going to skip over explaining the for loop syntax because it's just like many other languages except with no type on `i`.

{% include awk_file.html awk_src_class="awk_src_medium" id="loop_example" filename="loop_example" soln="loop_example" txt_source="earnings" 
init="END {
    for (i = 0; i < 10; i++) {
        arr[i] = i*i;
        print i \" => \" arr[i]
    }
}" %}



Next up, I'm going to give you an array. Your job is to loop through it and at each index print the index, a space, and the running total (inclusive) thus far.

{% include awk_file.html awk_src_class="awk_src_large" id="exercise_5" filename="exercise_5" soln="exercise_5" txt_source="earnings" init="END {
    arr[0] = 0
    arr[1] = 1
    for (i = 2 ; i < 100; i++) {        
        arr[i] += arr[i-1] + arr[i-2]
    }
    # Don't touch above here ^
    # Print the index and running total from 0 to 99
}
" %}

There are two more important things we can do with arrays in `awk`. Ask if they contain a key `if (key in arr) {} else {}` and delete a key/value &nbsp; `delete arr[key]`.

Let's use `delete` and `in` to calculate the primes from 1 to 100. We'll use the [prime sieve method](https://en.wikipedia.org/wiki/Sieve_of_Eratosthenes). 
If you don't know what that is go read the wikipedia page and come back. 


....

Okay welcome back. Use `delete` to remove every non-prime. After removing all the non-primes loop from 0 to 100 and use something like `if (number in primes)` to print
only the remaining numbers.

{% include awk_file.html awk_src_class="awk_src_large" id="exercise_6" filename="exercise_6" soln="exercise_6" txt_source="earnings" init="END {
    for ( i = 1; i < 100; i++) {
        arr[i] = i
    }
    # go forth and sieve!
} "%}

You may have noticed we're not even using the source files anymore. `awk` is a full language that can be used independently of tabular data.
Though it definitely shines on tabular data and I don't suggest writing too complex a program in `awk`.

----

Licensing notes: 

Some examples are pulled from the [GNU awk users guide](https://www.gnu.org/software/gawk/manual/gawk.html) under the [GNU Free Documentation License](https://www.gnu.org/software/gawk/manual/gawk.html#GNU-Free-Documentation-License)

[awkjs](https://www.npmjs.com/package/awkjs) is used under the [MIT license](https://github.com/petli-full/awkjs/blob/master/LICENSE)
