language:de
*** Einstellungen ***
Library    Browser
Library    XML

*** Variablen ***
${BROWSER}    chromium
${url}        https://or-tool.de
${Testdatei1}    var x1>=0;\nvar x2>=0;\nmaximize Objective: x1+x2;\ns.t. Constraint1:\nx1 + 2*x2 <= 15;\ns.t. Constraint2:\n3*x1 + x2 <= 20;
*** Testfälle ***
Öffne Browser
    [Dokumentation]    Erster Testfall
    Öffne OR-Webseite
    Testproblem lösen
    Lösung anzeigen Prüfen
    Sleep    3s


*** Schlüsselwörter ***
Öffne OR-Webseite
    [Dokumentation]     Öffnet die OR-Webseite
    New Browser    ${BROWSER}    ${True}    #${False}
    New Page    ${url}

Testproblem lösen
    [Dokumentation]    Löst die Testdatei
    Fill Text    id=problemInput    ${Testdatei1}
    Click    id=problemSolve

Lösung anzeigen Prüfen
    [Dokumentation]
    Wait For Elements State    id=loesungstabelle
    Wait For Elements State    id=myChart
    ${primal_value0}=    Get Text    xpath=//td[@id='tabelle_primal_0']
    ${primal_value1}=    Get Text    xpath=//td[@id='tabelle_primal_1']
    Should Be Equal As Numbers    ${primal_value0}    5
    Should Be Equal As Numbers    ${primal_value1}    5