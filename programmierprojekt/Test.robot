language:de
*** Einstellungen ***
Library    Browser
Library    XML
Library    Dialogs

*** Variablen ***
${BROWSER}    chromium
${url}        https://or-tool.de/
${Testdatei1}    var x1>=0;\nvar x2>=0;\nmaximize Objective: x1+x2;\ns.t. Constraint1:\nx1 + 2*x2 <= 15;\ns.t. Constraint2:\n3*x1 + x2 <= 20;
*** Testfälle ***
# OR Problem lösen
#     [Dokumentation]    Erster Testfall
#     Öffne OR-Webseite
#     Öffne Highs-Seite
#     Testproblem lösen
#     Lösung Prüfen

# Seiten Wechseln
#     Öffne OR-Webseite
#     Click    id=datenschutz
#     Click    id=impressum
#     Click    id=ueberUns

# Sprache Wechseln
#     [Tags]    PP2024-124
#     Öffne OR-Webseite
#     Click    id=sprache-aendern
#     ${Home}=    Get Text    id=menue_startseite
#     ${datenschutz}=    Get Text    id=datenschutz
#     ${impressum}=    Get Text    id=impressum
#     ${ueberUns}=    GetText    id=ueberUns
#     Should Be Equal As Strings    ${Home}    Home
#     Should Be Equal As Strings    ${datenschutz}    Privacy Policy 
#     Should Be Equal As Strings    ${impressum}    Legal Notice
#     Should Be Equal As Strings    ${ueberUns}    About Us
#     Click    id=sprache-aendern
#     ${Home}=    Get Text    id=menue_startseite
#     ${datenschutz}=    Get Text    id=datenschutz
#     ${impressum}=    Get Text    id=impressum
#     ${ueberUns}=    GetText    id=ueberUns
#     Should Be Equal As Strings    ${Home}    Startseite
#     Should Be Equal As Strings    ${datenschutz}    Datenschutz 
#     Should Be Equal As Strings    ${impressum}    Impressum
#     Should Be Equal As Strings    ${ueberUns}    Über Uns
    

Menüleiste Prüfen
    [Tags]    PP2024-125
    Öffne OR-Webseite
    Click    id=menue_startseite
    ${URL}=     Get Url
    Should Be Equal    ${URL}    https://or-tool.de/
    Click    id=menue_HiGHS
    ${URL}=     Get Url
    Should Be Equal    ${URL}    https://or-tool.de/highs
    #Click    id=menue_GLPK
    #${URL}=     Get Url
    #Should Be Equal    ${URL}    https://or-tool.de/glpk
    Click    id=menue_Feedback
    ${URL}=     Get Url
    Should Be Equal    ${URL}    https://or-tool.de/feedback




*** Schlüsselwörter ***
Öffne OR-Webseite
    [Dokumentation]     Öffnet die OR-Webseite
    New Browser    ${BROWSER}    ${False}
    New Page    ${url}

Öffne Highs-Seite
    [Dokumentation]
    Click    id=menue_HiGHS
    

Testproblem lösen
    [Dokumentation]    Löst die Testdatei
    Fill Text    id=problemInput    ${Testdatei1}
    Click    id=problemSolve

Lösung Prüfen
    [Dokumentation]    Überprüft, ob de Lösungstabelle und das Koordinatensystem vorhanden sind und überprüft in der Tabelle die Primal Werte
    Wait For Elements State    id=loesungstabelle
    Wait For Elements State    id=myChart
    ${primal_value0}=    Get Text    xpath=//td[@id='tabelle_primal_0']
    ${primal_value1}=    Get Text    xpath=//td[@id='tabelle_primal_1']
    Should Be Equal As Numbers    ${primal_value0}    5
    Should Be Equal As Numbers    ${primal_value1}    5
    Click    id=export_MPS
    Click    id=export_LP