---
layout: page
title:  "Intermediate awk: An interactive guide to awk's arrays and loops"
---

### Intermediate awk: An interactive guide to awk's arrays and loops

<link rel="stylesheet" href="assets/main.css">
<script src="/assets/awk.js?3"></script>
<script src="/assets/awk_tutorial_2.js?2"></script>

`awk` is a language that takes whitespace separated input files (columns), matches them against patterns, and executes
code for each match.
`awk` is available on almost every single linux system.

But you already new that. Because you've done the "[Basic awk: an interactive introduction to awk](/projects/awk.html)" 
tutorial already. We're diving right in and I won't be re-explaining things from basic awk. Fair warning. 

Here's the some similar earnings data to last time. People are listed multiple times. 

<div class="awk"><br/>
<span class="awk_file_name_hover">earnings.txt</span>
<textarea aria-label="Earnings text source file" class="awk_text" id="earnings">
Frances-Spence         90     USA
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
Leslie-Lamport         80     USA
</textarea>
</div>

This time we'll be writing longer awk programs so we'll run our `awk` from `.awk` files (think .c .py .js, .rs) with `awk -f file.awk input.txt`.

Edit the `.awk` file and click the 
<button disabled class='awk_example_button'>awk -f exercise.awk source.txt</button> 
command in the textbox when you're ready (or MacOS: `⌘+Enter` Windows: `Ctrl+Enter`).

You can also view my solution by clicking <button disabled class='awk_example_button'>Show Solution</button>

The first challenge is a <small>tiny</small> review. Print the entire row `$0` if the name is "Frances-Spence"

{% include awk_file.html filename="exercise-1" soln="exercise_1" txt_source="earnings" init="{ print $0 }" %} 

`awk` arrays are dictionaries where keys can be anything (though they are stringified) and values can also be anything. 
Like all `awk` variables arrays require no initialization. 

If you wanted to add the number in column 2 under the name in column 1 you could do this `sums[$1] += $2`.

Try it out. Sum the earnings (column 2) of each person. At the end print the total earnings of Moondog &nbsp; `arr["Moondog"]` &nbsp;. We'll go over how to loop
over everyone's earnings next. (Note: you might want to use an `END` pattern here)


{% include awk_file.html filename="exercise_2" soln="exercise_2" txt_source="earnings" init="{ print $0 }" %} 

Okay fine. You summed them. Let's print them all. `awk` has for-each syntax. It looks like this.

`for (key in arr) {  print key " " arr[key] }`

Now let's have you print everyone's name and their total using the for syntax (separated by a single space).
{% include awk_file.html awk_src_class="awk_src_medium" filename="exercise_3" soln="exercise_3" txt_source="earnings" init="{ print $0 }" %} 


Good good. Okay now can you use a temporary variable to find the person with the highest total? This will require
combining `for (key in arr)` and if statements like `if (val > max) { max = val }` 

{% include awk_file.html awk_src_class="awk_src_medium" filename="exercise_4" soln="exercise_4" txt_source="earnings" init="{ print $0 }" %}

Arrays can of course also uses numbers as indices. 
I'm going to skip over explaining the for loop syntax because it's just like many other languages except with no type on `i`.

{% include awk_file.html awk_src_class="awk_src_medium" filename="loop_example" soln="loop_example" txt_source="earnings" 
init="END {
    for (i = 0; i < 10; i++) {
        arr[i] = i*i;
        print i \" => \" arr[i]
    }
}" %}



Next up, I'm going to give you an array. Your job is to loop through it and at each index print the index, a space, and the running total (inclusive) thus far.

{% include awk_file.html awk_src_class="awk_src_large" filename="exercise_5" soln="exercise_5" txt_source="earnings" init="END {
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

{% include awk_file.html awk_src_class="awk_src_large" filename="exercise_6" soln="exercise_6" txt_source="earnings" init="END {
    for ( i = 1; i < 100; i++) {
        arr[i] = i
    }
    # go forth and sieve!
} "%}

You may have noticed we're not even using the source files anymore. `awk` is a full language that can be used independently of tabular data.
Though it definitely shines on tabular data and I don't suggest writing too complex a program in `awk`.
