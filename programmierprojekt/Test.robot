language:de
*** Einstellungen ***
Library    Browser
Library    XML

*** Variablen ***
${BROWSER}    chromium
${url}        http://localhost:4200/    #https://or-tool.de
${Testdatei1}    var x1>=0;\nvar x2>=0;\nmaximize Objective: x1+x2;\ns.t. Constraint1:\nx1 + 2*x2 <= 15;\ns.t. Constraint2:\n3*x1 + x2 <= 20;
*** Testfälle ***
Öffne Browser
    [Dokumentation]    Erster Testfall
    Öffne OR-Webseite
    Testproblem lösen
    Lösung anzeigen Prüfen
    Sleep    5s


*** Schlüsselwörter ***
Öffne OR-Webseite
    [Dokumentation]     Öffnet die OR-Webseite
    New Browser    ${BROWSER}    ${False}
    New Page    ${url}

Testproblem lösen
    [Dokumentation]    Löst die Testdatei
    Fill Text    id=problemInput    ${Testdatei1}
    Click    id=problemSolve

Lösung anzeigen Prüfen
    [Dokumentation]
    Element Should Exist    id=loesungstabelle
    Element Should Exist    id=myChart