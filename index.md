---
layout: page
---

## Podstawy

<link rel="stylesheet" href="assets/main.css">
<link rel="shortcut icon" type="image/png" href="assets/favicon.png">
<script src="assets/awk.js"></script>
<script src="assets/awk_tutorial.js"></script>

<script src="assets/ace.min.js"></script>
<script>
    var editors = {};
    var text_editors = {};
</script>

*AWK* to język programowania, który przyjmuje na wejściu pliki, w których dane są rozdzielone białymi znakami (kolumny), sprawdza dla kolejnych linii warunki ich dalszego przetwarzania, a następnie wykonuje kod dla danej linii w przypadku spełnienia warunków. Język *AWK* posiada [wiele implementacji](https://en.wikipedia.org/wiki/AWK#Versions_and_implementations), z których jedną z najpopularniejszych jest wersja GNU [`gawk`](https://man7.org/linux/man-pages/man1/gawk.1.html). Program `awk` jest dostępny w zasadzie w każdej dystrybucji Linux, a w systemie występuje najczęściej jako dowiązanie symboliczne do wybranej implementacji języka *AWK*.

Najczęściej program `awk` stosuje się do szybkiego skryptowego przetwarzania tekstu bezpośrednio z poziomu terminala, tworząc tzw. jednolinijkowce. Wygląda to następująco:

```bash
$ awk 'treść skryptu przetwarzającego dane wejściowe' plik_do_przetworzenia
```

Poniżej znajdują się dwa szablony stanowiące podstawę skryptów `awk`:

1. Dla każdej linii, jeśli `warunek` jest spełniony dla linii, uruchom `kod`:
   ```plaintext
   warunek { kod }
   ```
2. Dla każdej linii, uruchom `kod`:
   ```plaintext
   { kod } 
   ```

----

### Przykład 1

Poniżej znajduje się przykład polecenia `awk`, które po prostu wyświetla dane otrzymane na wejściu z pliku `mail_list`. Zmienna `$0` oznacza całą aktualnie przetwarzaną linię.

> 💡 Aby uruchomić kod, możesz kliknąć w poniższy terminal i nacisnąć klawisz `<Enter>` albo nacisnąć przycisk `[▶ Uruchom]`.

{% include awk_console.html awk_file="mail_list" awk_soln="hello_world0" awk_init="awk '{ print $0 }' mail_list" %}

Poniżej znajduje się przykładowa zawartość pliku `mail_list`, która jest przetwarzana przez `awk`:

<div class="awk"><br/>
<span class="awk_file_name_hover">📜 mail_list</span>
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
    editor.setReadOnly(true);
    editor.setOptions({
        maxLines: Infinity
    });
    editor.renderer.setShowGutter(false);
    editor.renderer.setPadding(8);
    editor.renderer.setScrollMargin(3, 3);
    editor.setOptions({highlightActiveLine: false});
    editor.renderer.$cursorLayer.element.style.display = "none";
    editor.setTheme("ace/theme/cobalt");
    editor.session.setMode("ace/mode/text");
    text_editors["mail_list"] = editor;
</script>

Jak widać, dane w pliku `mail_list` są zapisane w sposób kolumnowy, w tym wypadku oddzielone spacjami (liczba spacji nie ma znaczenia).

Spójrzmy na kolejny prosty przykład, który nie stosuje warunków przetwarzania. Poniższy skrypt wyświetli pierwszą kolumnę (`$1`):

{% include awk_console.html awk_file="mail_list" awk_soln="hello_world" awk_init="awk '{ print $1 }' mail_list" %}

----

### Zadanie 1

Spróbujemy wyświetlić kolumny `$1` i `$2` oddzielone spacją `" "`. W skrypcie będzie to wyglądało mniej więcej tak: `$1 " " $2`. Polecenie `print` przyjmuje wiele argumentów oddzielonych spacjami (nie ma potrzeby łączenia danych np. za pomocą znaku plus, tak jak to jest w niektórych innych językach programowania).

Zmodyfikuj poniższy kod, dodając `" "`.

{% include awk_console.html awk_file="mail_list" awk_soln="hello_world2" awk_init="awk '{ print $1 $2 }' mail_list" %}

----

### Zadanie 2

No dobra, a co z warunkami przetwarzania? Widzieliśmy wcześniej, że `$1` oznacza pierwszą kolumnę. Uzupełnij poniższy kod tak, aby dla każdego Billa wyświetlił się jego numer telefonu.

{% include awk_console.html awk_file="mail_list" awk_soln="column_1" awk_init="awk '$1 == \"Bill\" { }' mail_list" %}

----

### Zadanie 3

Spójrzmy teraz na wariant z wieloma warunkami przetwarzania:

```plaintext
warunek1 { kod1 } warunek2 { kod2 }
```

Popraw i uzupełnij poniższy skrypt tak, aby oprócz wyświetlenia wszystkich numerów telefonów osób o imieniu Bill, program wypisał również imię osoby z numerem telefonu `555-3430`.

{% include awk_console.html awk_file="mail_list" awk_soln="phonenum" awk_init="awk '$1 == \"Bill\" { print $1 }' mail_list" %}

----

### Przykład 2

Zmienne `awk` mogą być inicjalizowane w pierwszym warunku `BEGIN { x = 0 }`; jeśli ich nie zainicjalizujemy wprost, to domyślnie mają ustawioną wartość 0. Na podobnej zasadzie działa ostatni warunek `END`, który uruchamia się po zakończeniu przetwarzania wszystkich wierszy. 

Dotychczas używaliśmy prostych skryptów `{ kod }` i `warunek { kod }`, bez poprzedzających ich warunków `BEGIN` i `END`. Kod i warunki były wykonywane dla każdej przetwarzanej linii.

Spróbuj uruchomić poniższe dwa przykłady, tak aby zobaczyć, jak działają warunki `BEGIN` i `END`. 

{% include awk_console.html awk_file="mail_list" awk_soln="beginend" awk_init="awk 'BEGIN { print \"start\" } { print \"dla każdej linii\" } END { print \"koniec\" }' mail_list"%}

{% include awk_console.html awk_file="mail_list" awk_soln="beginend2" awk_init="awk 'BEGIN { x = 1000 } { x += 1 } END { print x }' mail_list" %}

----

### Zadanie 4

W poniższym skrypcie każda przetwarzana linia oznacza zwiększenie wartości zmiennej `s` o 5.

*AWK* posiada funkcję `length()`, która jako argument przyjmuje kolumnę i zwraca liczbę znaków przetwarzanego ciągu tekstowego. Zmień poniższy kod tak, aby wyświetlić łączną liczbę znaków wszystkich imion.

{% include awk_console.html awk_file="mail_list" awk_soln="vars1" awk_init="awk '{ s += 5 } END { print s } ' mail_list"%}

----

### Zadanie 5

W *AWK* można również stosować wyrażenia regularne. Regexy można dopasowywać do całej przetwarzanej linii:

```plaintext
/regex/ { kod }
```

lub do wybranej kolumny:

```plaintext
$3 ~ /regex/ { kod }
```

Następujący regex dopasowuje słowa, które zawierają wyłącznie samogłoski: `/^[AEIOUYaeiouy]+$/`. Użyj go do wyświetlenia imion składających się z samych samogłosek.

{% include awk_console.html awk_file="mail_list" awk_soln="regex" awk_init="awk '/^[AEIOUYaeiouy]+$/ {}' mail_list" %}

----

### Zadanie 6

Czas na przepływ sterowania! W *AWK*, podobniej jak w innych językach, mamy instrukcje warunkowe `if` i `else`. Schematyczne użycie może wyglądać następująco:

```plaintext
opcjonalny_warunek { if (coś_a >= coś_b) { kod1 } else { kod2 } }
```

Poniższy plik zawiera dane dotyczące imion, wieku i krajów:

<div class="awk"><br/>
<span class="awk_file_name_hover">📜 people</span>
<div spellcheck="false" class="awk_text" id="people">Frances-Spence         90    USA
Yoshihide              72    JP
Nate                   21    USA
Moondog                83    USA
Michael-Fastbender     42    USA
Xiangyang              54    CN
Jordan-Etude           13    USA
Aditi-Acharya          83    IN
Miyoung                41    KR
Navya-Reddy            55    IN
Bolade-Ibrahim         28    NG
Jean-Bartik            87    USA
Leslie-Lamport         80    USA</div>
</div>
<script>
    var editor = ace.edit("people");
    editor.setShowPrintMargin(false);
    editor.setReadOnly(true);
    editor.setOptions({
        maxLines: Infinity
    });
    editor.renderer.setShowGutter(false);
    editor.renderer.setPadding(8);
    editor.renderer.setScrollMargin(3, 3);
    editor.setOptions({highlightActiveLine: false});
    editor.renderer.$cursorLayer.element.style.display = "none";
    editor.setTheme("ace/theme/cobalt");
    editor.session.setMode("ace/mode/text");
    text_editors["people"] = editor;
</script>

Użyj instrukcji `if`/`else` tak, aby wyświetlić imiona, ale osoby w wieku co najmniej 65 lat mają mieć przedrostek `(senior)`. Oczekiwany format wyjściowych danych:

```
(senior) Frances-Spence
(senior) Yoshihide
Nate
...
Bolade-Ibrahim
(senior) Jean-Bartik
(senior) Leslie-Lamport
```

{% include awk_console.html awk_file="people" awk_soln="ifelse" awk_init="awk '{}' people" %}

----

### Zadanie 7

Czas na wyrażenia logiczne! *AWK* wspiera wyrażenia zawierające koniunkcję `&&` i alternatywę `||`. 

Wyświetl imiona osób, które mają co najmniej 65 lat **oraz** pochodzą ze Stanów Zjednoczonych.

{% include awk_console.html awk_file="people" awk_soln="logical1" awk_init="awk '$2 >= 65 {print $1}' people" %}

----

### Zadanie 8

Wyświetl imiona osób, które mają co najmniej 65 lat **lub** pochodzą z Nigerii.

{% include awk_console.html awk_file="people" awk_soln="logical2" awk_init="awk '$2 >= 65 {print $1}' people" %}

----

### Zadanie 9

Podobnie jak wcześniej niejawnie tworzyliśmy zmienną używając `{ s += length($2) }`, możemy stworzyć dwie nowe zmienne do zliczenia osób w wieku co najmniej 65 lat pochodzących z USA i spoza tego kraju.

Spróbuj wykonać to zadanie na dwa sposoby:

1. przetwarzając każdą linię z osobą w wieku 65 lat, a następnie używając `if`/`else` na `$3`,
2. używając dwóch warunków jednocześnie, tj. pierwszy przetwarzający tylko osoby w wieku 65 lat z USA, a drugi przetwarzający tylko osoby w wieku 65 lat spoza USA (operator nierówności to `!=`).

W tym zadaniu schematycznie użycie kilku warunków jednocześnie wygląda następująco:

```bash
$ awk 'warunek1 { kod1 } warunek2 { kod2 } END { kod_na_koniec }' plik
```

Twoje rozwiązanie powinno zawierać dwie liczby oddzielone spacją, tj. `4 2`.

{% include awk_console.html awk_file="people" awk_soln="multPatt" awk_init="awk '{}' people" consoleClass="consoleH2" %}

----

### Zadanie 10

*AWK* posiada kilka dostępnych dla nas zmiennych wbudowanych. Oto kilka z nich:

| Nazwa | Wartość |
|:-----:|---------|
| `FS`  | separator pól/kolumn (ang. _**f**ield **s**eparator_, domyślnie znak spacji) |
| `RS`  | separator wierszy (ang. _**r**ecord **s**epartor_, domyślnie znak nowej linii) |
| `NF`  | liczba pól/kolumn (ang. _**n**umber of **f**ields_) |
| `NR`  | aktualna liczba przetworzonych wierszy (ang. _total **n**umber of **r**ecords seen so far_) |
| `$0`  | cała linia (wszystkie kolumny) |

Spróbuj użyć którychś z powyższych zmiennych tak, aby wyświetlić tylko nieparzyste wiersze pliku `people` (operator modulo to `%`).

{% include awk_console.html awk_file="people" awk_soln="odd" awk_init="awk '{}' people" %}

----

Używając `awk` z poziomu terminala, dostępne są dla nas również flagi wpływające na działanie programu (niestety nie możemy z nich korzystać w internetowym symulatorze).
Poniżej znajduje się kilka istotniejszych przełączników:

| Flaga | Przykład użycia        | Cel                                                                                     |
|:-----:|:-----------------------|-----------------------------------------------------------------------------------------|
| `-F`  | `awk -F: ...`          | wskazanie, że kolumny są oddzielone znakiem `:`                                         |
| `-f`  | `awk -f script.awk ...`| wczytanie skryptu AWK z pliku zamiast jako argumentu programu                           |
| `-v`  | `awk -v init=1 ...`    | inicjalizacja zmiennej `init` z wartością 1 zamiast domyślnej 0;<br>równoważne z `awk 'BEGIN { init = 1 } ...` |

## Tablice i pętle

`awk` is a language that takes whitespace separated input files (columns), matches them against patterns, and executes
code for each match.
`awk` is available on almost every single linux system.

But you already new that. Because you've done the "[Basic awk: an interactive introduction to awk](/projects/awk.html)" 
tutorial already. We're diving right in and I won't be re-explaining things from basic awk. Fair warning. 

Here's the some similar earnings data to last time. People are listed multiple times. 

<div class="awk"><br/>
<span class="awk_file_name_hover">📜 earnings.txt</span>
<div spellcheck="false" aria-label="Earnings text source file" class="awk_text" id="earnings">Frances-Spence          90     USA
Yoshihide               72     JP
Nate                   -21     USA
Nate                    22     USA
Nate                   -65     USA
Moondog                 83     USA
Moondog                 24     USA
Michael-Fastbender      42     USA
Xiangyang               54     CN
Jordan-Etude            13     USA
Aditi-Acharya           83     IN
Miyoung                 41     KR
Frances-Spence         -80     USA
Frances-Spence          43     USA
Navya-Reddy             55     IN
Moondog                 13     USA
Bolade-Ibrahim          28     NG
Bolade-Ibrahim         -10     NG
Jean-Bartik             87     USA
Leslie-Lamport          80     USA</div>
</div>
<script>
    var editor = ace.edit("earnings");
    editor.setShowPrintMargin(false);
    editor.setReadOnly(true);
    editor.renderer.setShowGutter(false);
    editor.renderer.setPadding(8);
    editor.renderer.setScrollMargin(3, 3);
    editor.setOptions({highlightActiveLine: false});
    editor.renderer.$cursorLayer.element.style.display = "none";
    editor.setTheme("ace/theme/cobalt");
    editor.session.setMode("ace/mode/text");
    editor.setOptions({
        maxLines: Infinity
    });
    text_editors["earnings"] = editor;
</script>

This time we'll be writing longer awk programs so we'll run our `awk` from `.awk` files (think .c .py .js, .rs) with `awk -f file.awk input.txt`.

Edit the `.awk` file and click the 
<button disabled class='awk_example_button'>awk -f exercise.awk source.txt</button> 
command in the textbox when you're ready (or MacOS: `⌘+Enter` Windows: `Ctrl+Enter`).

You can also view my solution by clicking <button disabled class='awk_example_button'>Show Solution</button>

----

### Zadanie 11

The first challenge is a <small>tiny</small> review. Print the entire row `$0` if the name is "Frances-Spence"

{% include awk_file.html id="exercise_11" filename="exercise_11" soln="exercise_11" txt_source="earnings" init="{ print $0 }" %} 

----

### Zadanie 12

`awk` arrays are dictionaries where keys can be anything (though they are stringified) and values can also be anything. 
Like all `awk` variables arrays require no initialization. 

If you wanted to add the number in column 2 under the name in column 1 you could do this `sums[$1] += $2`.

Try it out. Sum the earnings (column 2) of each person. At the end print the total earnings of Moondog &nbsp; `arr["Moondog"]` &nbsp;. We'll go over how to loop
over everyone's earnings next. (Note: you might want to use an `END` pattern here)

{% include awk_file.html id="exercise_12" filename="exercise_12" soln="exercise_12" txt_source="earnings" init="{ print $0 }" %} 

----

### Zadanie 13

Okay fine. You summed them. Let's print them all. `awk` has for-each syntax. It looks like this.

`for (key in arr) {  print key " " arr[key] }`

Now let's have you print everyone's name and their total using the for syntax (separated by a single space).

{% include awk_file.html awk_src_class="awk_src_medium" id="exercise_13" filename="exercise_13" soln="exercise_13" txt_source="earnings" init="{ print $0 }" %}

----

### Zadanie 14

Good good. Okay now can you use a temporary variable to find the person with the highest total? This will require
combining `for (key in arr)` and if statements like `if (val > max) { max = val }` 

{% include awk_file.html awk_src_class="awk_src_medium" id="exercise_14" filename="exercise_14" soln="exercise_14" txt_source="earnings" init="{ print $0 }" %}

----

### Przykład 3

<div class="awk" style="display: none;">
<div class="awk_text" id="empty_stdin"></div>
</div>
<script>
    var editor = ace.edit("empty_stdin");
    text_editors["empty_stdin"] = editor;
</script>

Arrays can of course also uses numbers as indices. 
I'm going to skip over explaining the for loop syntax because it's just like many other languages except with no type on `i`.

{% include awk_file_nostdin.html awk_src_class="awk_src_medium" id="loop_example" filename="loop_example" soln="loop_example"
init="END {
    for (i = 0; i < 10; i++) {
        arr[i] = i*i;
        print i \" => \" arr[i]
    }
}" %}

----

### Zadanie 15

Next up, I'm going to give you an array. Your job is to loop through it and at each index print the index, a space, and the running total (inclusive) thus far.

{% include awk_file_nostdin.html awk_src_class="awk_src_large" id="exercise_15" filename="exercise_15" soln="exercise_15" init="END {
    arr[0] = 0
    arr[1] = 1
    for (i = 2 ; i < 100; i++) {        
        arr[i] += arr[i-1] + arr[i-2]
    }
    # Don't touch above here ^
    # Print the index and running total from 0 to 99
}
" %}

----

### Zadanie 16

There are two more important things we can do with arrays in `awk`. Ask if they contain a key `if (key in arr) {} else {}` and delete a key/value &nbsp; `delete arr[key]`.

Let's use `delete` and `in` to calculate the primes from 1 to 100. We'll use the [prime sieve method](https://en.wikipedia.org/wiki/Sieve_of_Eratosthenes). 
If you don't know what that is go read the wikipedia page and come back. 

Okay welcome back. Use `delete` to remove every non-prime. After removing all the non-primes loop from 0 to 100 and use something like `if (number in primes)` to print
only the remaining numbers.

{% include awk_file_nostdin.html awk_src_class="awk_src_large" id="exercise_16" filename="exercise_16" soln="exercise_16" init="END {
    for ( i = 1; i < 100; i++) {
        arr[i] = i
    }
    # go forth and sieve!
} "%}

----

You may have noticed we're not even using the source files anymore. `awk` is a full language that can be used independently of tabular data.
Though it definitely shines on tabular data and I don't suggest writing too complex a program in `awk`.

----

Autorem samouczka jest [Nathaniel Tracy-Amoroso](https://github.com/n8ta).

Some examples are pulled from the [GNU awk users guide](https://www.gnu.org/software/gawk/manual/gawk.html) under the [GNU Free Documentation License](https://www.gnu.org/software/gawk/manual/gawk.html#GNU-Free-Documentation-License)

[awkjs](https://www.npmjs.com/package/awkjs) is used under the [MIT license](https://github.com/petli-full/awkjs/blob/master/LICENSE)
