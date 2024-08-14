---
layout: page
title:  "Basic awk: An interactive introduction to awk"
---

### Basic `awk`: An interactive introduction to awk

<link rel="stylesheet" href="assets/main.css">
<script src="/assets/awk.js?2"></script>
<script src="/assets/awk_tutorial.js?6"></script>

`awk` is a language that takes whitespace separated input files (columns), matches them against patterns, and executes
code for each match.
`awk` is available on almost every single linux system.

```text
# For every line execute code if the pattern matches that line
pattern { code }
    
# Run code for every line
{ code } 
```

Here's an example of an awk command that just returns its input (`$0` refers to the full source line). Click into the terminal and press `Enter`.

{% include awk_console.html awk_file="mail_list" awk_soln="hello_world0" awk_init="awk '{ print $0 }' mail_list" %}

Here's an example of data ready for awk to process `./mail_list`. You can edit this data and the terminals below will
use the new data.
<textarea class="awk_text" id="mail_list">
Amelia       555-5553    amelia.zodiacusque@gmail.com       F
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
Bill         555-1337    billiam.billy@cal.tech.edu         R
</textarea>

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


<textarea class="awk_text" id="people">
Frances-Spence         90    USA
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
Leslie-Lamport         80    USA  
</textarea>

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

That's all I have for you today! If you have ideas for what you'd like to see in an intermediate interactive `awk`
guide, shoot me an email (on homepage).

-Nate

<br/><br/><br/><br/><br/><br/><br/>
<hr/>

Licensing notes: 

Some examples are pulled from the [GNU awk users guide](https://www.gnu.org/software/gawk/manual/gawk.html) under the [GNU Free Documentation License](https://www.gnu.org/software/gawk/manual/gawk.html#GNU-Free-Documentation-License)

[awkjs](https://www.npmjs.com/package/awkjs) is used under the [MIT license](https://github.com/petli-full/awkjs/blob/master/LICENSE)
