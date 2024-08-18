---
layout: page
---

# Samouczek AWK

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

> 💡 Aby uruchomić kod, możesz kliknąć w poniższy terminal i nacisnąć klawisz `<Enter>`; możesz też nacisnąć przycisk `[▶ Uruchom]`. Jeśli chcesz zresetować terminal do stanu początkowego, naciśnij przycisk `[↺]`.

{% include awk_console.html awk_file="mail_list" awk_soln="hello_world0" awk_init="awk '{ print $0 }' mail_list" awk_reset="awk '{ print $0 }' mail_list" %}

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

*AWK* posiada funkcję [`length()`](https://www.gnu.org/software/gawk/manual/gawk.html#index-length_0028_0029-function), która jako argument przyjmuje kolumnę i zwraca liczbę znaków przetwarzanego ciągu tekstowego. Zmień poniższy kod tak, aby wyświetlić łączną liczbę znaków wszystkich imion.

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

## Pliki skryptów, tablice i pętle

Używając `awk` z poziomu terminala, dostępne są dla nas również flagi wpływające na działanie programu (niestety nie możemy z nich wszystkich wprost skorzystać w internetowym symulatorze).
Poniżej znajduje się kilka istotniejszych przełączników:

| Flaga | Przykład użycia        | Cel                                                                                     |
|:-----:|:-----------------------|-----------------------------------------------------------------------------------------|
| `-F`  | `awk -F: ...`          | wskazanie, że kolumny są oddzielone znakiem `:`                                         |
| `-f`  | `awk -f script.awk ...`| wczytanie skryptu AWK z pliku zamiast jako argumentu programu                           |
| `-v`  | `awk -v init=1 ...`    | inicjalizacja zmiennej `init` z wartością 1 zamiast domyślnej 0;<br>równoważne z `awk 'BEGIN { init = 1 } ...` |

W dalszej części samouczka będziemy pisać nieco dłuższe skrypty. Wygodniej będzie nam uruchamiać program `awk` przekazując mu jako argument plik skryptu korzystając z flagi `-f`, np. `awk -f file.awk input.txt`.

Poniżej znajduje się plik z zarobkami `earnings.txt`. Niektóre osoby występują kilka razy.

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

----

### Zadanie 11

Rozpocznijmy od małej powtórki. Wyświetl cały wiersz `$0` jeśli imię to Frances-Spence.

> 💡 Zmień poniższy skrypt `.awk` w interaktywnym edytorze, a następnie uruchom go używając kombinacji klawiszy `<Ctrl+Enter>` lub `<⌘+Enter>`; możesz też nacisnąć przycisk `[▶ Uruchom]`. Jeśli chcesz zresetować edytor do stanu początkowego, naciśnij przycisk `[↺]`. Polecenie w terminalu jest ustawione na stałe, bez możliwości edycji.

{% include awk_file.html id="exercise_11" filename="exercise_11" soln="exercise_11" txt_source="earnings" init="{ print $0 }" %} 

----

### Zadanie 12

Tablice w *AWK* są słownikami, w których klucze mogą być dowolne (aczkolwiek są przekształcane ostatecznie na ciągi znaków), a wartości również mogą być również dowolne. Jak wszystkie zmienne w *AWK*, tablice nie wymagają inicjalizacji.

Np. jeśli chcesz w tablicy dodać liczbę z kolumny 2 do wartości klucza o nazwie wartości kolumny 1, możesz to zrobić tak: `sums[$1] += $2`.

Sprawdźmy to. Zsumuj zarobki (kolumna 2) każdej osoby, a na końcu wypisz całkowite zarobki osoby o imieniu Moondog używając `arr["Moondog"]` (przydatny będzie warunek `END`; możesz go umieścić w nowej linii). W dalszej części materiałów omówimy jak przejść przez zarobki wszystkich osób.

{% include awk_file.html id="exercise_12" filename="exercise_12" soln="exercise_12" txt_source="earnings" init="{ print $0 }" %} 

----

### Zadanie 13

No dobrze -- skoro już wiemy jak zsumować zarobki poszczególnych osób, to je wyświetlmy. *AWK* posiada pętlę `for`, której schematyczne użycie może wyglądać następująco:

```bash
for (klucz in tablica) { 
    print klucz " " tablica[klucz]
}
```

Wyświetl wszystkie imiona i odpowiadające im łączne zarobki (imię i łączne zarobki oddziel pojedynczą spacją).

{% include awk_file.html awk_src_class="awk_src_medium" id="exercise_13" filename="exercise_13" soln="exercise_13" txt_source="earnings" init="{ print $0 }" %}

----

### Zadanie 14

Teraz użyj dodatkowych zmiennych tak, aby znaleźć osobę z najwyższymi łącznymi zarobkami (wyświetl imię i łączne zarobki oddzielone spacją). Będzie to wymagało połączenia pętli `for` oraz instrukcji warunkowej typu:

```bash
if (val > max) {
    max = val
    ...
}
```

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

Skrypty *AWK* mogą również pomijać przetwarzanie tekstu i dane wejściowe. Na początku musimy jednak zwrócić uwagę na to, że jeśli nie podamy w poleceniu `awk` jako ostatniego argumentu nazwy pliku do wczytania, program będzie oczekiwał danych na standardowym wejściu. W tym wypadku prostą sztuczką jest przekierowanie na standardowe wejście pustego ciągu znaków np. używając składni Bash `<<< ''`. Przykładowo, w terminalu wyglądałoby to następująco:

```bash
$ awk -f script.awk <<< ''
```

W poniższym przykładzie możemy zobaczyć, że pomijamy dane wejściowe oraz przy pomocy warunku `END` iterujemy po tablicy `arr`, której kluczami są liczby całkowite od 0 do 9:

{% include awk_file_nostdin.html awk_src_class="awk_src_medium" id="loop_example" filename="loop_example" soln="loop_example"
init="END {
    for (i = 0; i < 10; i++) {
        arr[i] = i*i;
        print i \" => \" arr[i]
    }
}" %}

----

### Zadanie 15

Twoim zadaniem jest przejść w pętli po przygotowanej wcześniej tablicy `arr` tak, aby dla każdego indeksu (klucza) wypisać indeks, spację i sumę bieżącą wartości tablicy.

{% include awk_file_nostdin.html awk_src_class="awk_src_large" id="exercise_15" filename="exercise_15" soln="exercise_15" init="END {
    arr[0] = 0
    arr[1] = 1
    for (i = 2 ; i < 10; i++) {        
        arr[i] += arr[i-1] + arr[i-2]
    }
    # Nie zmieniaj powyższego kodu ^
    # Wyświetl indeks i sumę bieżącą od 0 do 9
    
}" %}

----

### Zadanie 16

W *AWK* możemy sprawdzić, czy tablica zawiera klucz:

```bash
if (klucz in tablica) {
    ...
} else {
    ...
}
```

Możemy również usunąć klucz (i odpowiadającą mu wartość) za pomocą:

```bash
delete tablica[klucz]
```

Twoim ostatnim zadaniem jest zaimplementowanie metody [sita Eratostenesa](https://pl.wikipedia.org/wiki/Sito_Eratostenesa) do wyświetlenia liczb pierwszych nie większych niż 100.

Skorzystaj z tablicy i użyj `delete` oraz `in` tak, aby usunąć wszystkie liczby, które nie są pierwsze. Po usunięciu wszystkich liczb niebędących liczbami pierwszymi, przejdź w pętli od 2 do 100 i wypisz pozostałe w tablicy liczby używając czegoś w stylu `if (number in arr)`.

{% include awk_file_nostdin.html awk_src_class="awk_src_large" id="exercise_16" filename="exercise_16" soln="exercise_16" init="END {
    for (i = 2; i < 100; i++) {
        arr[i] = i
    }
    # Idź i odsiewaj!
    
}"%}

## Podsumowanie

Jak widać, w ostatnich zadaniach nie używaliśmy już plików z danymi wejściowymi. *AWK* jest językiem, który możemy używać w oderwaniu od danych tabelarycznych, jednakże to właśnie podczas pracy z tego typu danymi sprawdza się on najlepiej. Co do zasady nie zaleca się pisania zbyt skomplikowanych programów w *AWK*.

W powyższym samouczku poznaliśmy podstawy *AWK*. W celu dalszego poszerzenia wiedzy, można skorzystać z obszernego podręcznika użytkownika [The GNU Awk User's Guide](https://www.gnu.org/software/gawk/manual/gawk.html).

----

Autorem samouczka jest [Nathaniel Tracy-Amoroso](https://github.com/n8ta). Część zadań i przykładów została zaczerpnięta z [podręcznika użytkownika GNU awk](https://www.gnu.org/software/gawk/manual/gawk.html) na licencji [GNU Free Documentation License](https://www.gnu.org/software/gawk/manual/gawk.html#GNU-Free-Documentation-License). Silnik [awkjs](https://www.npmjs.com/package/awkjs) jest dystrybuowany na licencji [MIT](https://github.com/petli-full/awkjs/blob/master/LICENSE).
