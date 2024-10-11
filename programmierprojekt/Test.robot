language:de
*** Einstellungen ***
Library    Browser
Library    OperatingSystem
Library    Dialogs

*** Variablen ***
${BROWSER}    chromium
${url}        http://localhost:4200/
${Testdatei1}    var x1>=0;\nvar x2>=0;\nmaximize Objective: x1+x2;\ns.t. Constraint1:\nx1 + 2*x2 <= 15;\ns.t. Constraint2:\n3*x1 + x2 <= 20;
${DOWNLOAD_DIR}
${EXPECTED_FILE}

${feedback_text}           Automatischer Test\nNächste Zeile!\n\nLG Robot Testing
${feedback_placeholder}    Bitte geben Sie Ihr Feedback hier ein...
${feedback_button_text}    Absenden


*** Testfälle ***
OR Problem lösen
    [Dokumentation]    Erster Testfall
    Öffne OR-Webseite
    Öffne Highs-Seite
    Testproblem lösen
    Lösung Prüfen

Seiten Wechseln
    Öffne OR-Webseite
    Click    id=datenschutz
    Click    id=impressum
    Click    id=ueberUns

Sprache Wechseln
    [Tags]    PP2024-124
    Öffne OR-Webseite
    Click    id=sprache-aendern
    ${Home}=    Get Text    id=menue_startseite
    ${datenschutz}=    Get Text    id=datenschutz
    ${impressum}=    Get Text    id=impressum
    ${ueberUns}=    GetText    id=ueberUns
    Should Be Equal As Strings    ${Home}    Home
    Should Be Equal As Strings    ${datenschutz}    Privacy Policy
    Should Be Equal As Strings    ${impressum}    Legal Notice
    Should Be Equal As Strings    ${ueberUns}    About Us
    Click    id=sprache-aendern
    ${Home}=    Get Text    id=menue_startseite
    ${datenschutz}=    Get Text    id=datenschutz
    ${impressum}=    Get Text    id=impressum
    ${ueberUns}=    GetText    id=ueberUns
    Should Be Equal As Strings    ${Home}    Startseite
    Should Be Equal As Strings    ${datenschutz}    Datenschutz
    Should Be Equal As Strings    ${impressum}    Impressum
    Should Be Equal As Strings    ${ueberUns}    Über Uns


Menüleiste Prüfen
    [Tags]    PP2024-125
    Öffne OR-Webseite
    Menüleiste Prüfen

Hilfe Button Prüfen
    [Tags]     PP2024-130
    Öffne OR-Webseite
    Öffne Highs-Seite
    Click    id=info-button
    Highlight Elements    id=hilfeInformation

Export LP Prüfen
    [Tags]    PP2024-97
    Öffne OR-Webseite
    Öffne Highs-Seite
    Testproblem lösen
    Click    id=export_LP

Routing testen
    [Tags]    PP2024-133
    Öffne OR-Webseite
    Menüleiste Prüfen
    Footer prüfen

Feedback Formular Sichtbarkeit
    [Dokumentation]    Überprüft, ob das Feedback-Formular korrekt geladen wird
    Öffne Feedback-Seite
    Element Sollte Sichtbar Sein      css=.container
    Element Sollte Sichtbar Sein      id=feedback
    Element Sollte Sichtbar Sein      id=feedbackAbsenden
    Element Text Sollte Gleich Sein   id=feedbackAbsenden    ${feedback_button_text}

Feedback testen
    [Tags]    PP2024-132
    Öffne OR-Webseite
    Click    id=menue_Feedback
    Fill Text    id=feedback    Automatischer Test\nNächste Zeile!\n\nLG Robot Testing
    Click    id=feedbackAbsenden

Feedback Sprache Wechseln
    [Dokumentation]    Überprüft, ob das Feedback-Formular korrekt übersetzt wird, wenn die Sprache gewechselt wird
    Öffne Feedback-Seite
    Click    id=sprache-aendern
    ${feedback_button_text_english}=    Get Text    id=feedbackAbsenden
    Should Be Equal As Strings    ${feedback_button_text_english}    Submit
    ${feedback_placeholder_english}=    Get Attribute    id=feedback    placeholder
    Should Be Equal As Strings    ${feedback_placeholder_english}    Here you have the opportunity to provide your feedback...
    Click    id=sprache-aendern
    ${feedback_button_text}=    Get Text    id=feedbackAbsenden
    Should Be Equal As Strings    ${feedback_button_text}    Absenden
    ${feedback_placeholder}=    Get Attribute    id=feedback    placeholder
    Should Be Equal As Strings    ${feedback_placeholder}    Hier haben Sie die Möglichkeit, Ihr Feedback zu hinterlegen...


*** Schlüsselwörter ***
Öffne OR-Webseite
    [Dokumentation]     Öffnet die OR-Webseite
    New Browser    ${BROWSER}    ${True}
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
    Click    id=export_LP

Menüleiste Prüfen
    Click    id=menue_startseite
    ${URL}=     Get Url
    Should Be Equal    ${URL}    http://localhost:4200/
    Click    id=menue_HiGHS
    ${URL}=     Get Url
    Should Be Equal    ${URL}    http://localhost:4200/highs
    #Click    id=menue_GLPK
    #${URL}=     Get Url
    #Should Be Equal    ${URL}    http://localhost:4200/glpk
    Click    id=menue_Feedback
    ${URL}=     Get Url
    Should Be Equal    ${URL}    http://localhost:4200/feedback

Footer Prüfen
    [Documentation]    Testet, ob alle Footer Routing Seiten vorhanden sind
    Click    id=datenschutz
    ${URL}=     Get Url
    Should Be Equal    ${URL}    http://localhost:4200/datenschutz
    Click    id=impressum
    ${URL}=     Get Url
    Should Be Equal    ${URL}    http://localhost:4200/impressum
    Click    id=ueberUns
    ${URL}=     Get Url
    Should Be Equal    ${URL}    http://localhost:4200/about-us


Öffne Feedback-Seite
    [Dokumentation]    Öffnet die Feedback-Seite direkt
    New Browser    ${BROWSER}    ${True}
    New Page    ${url}
    Click    id=menue_Feedback

Element Sollte Sichtbar Sein
    [Arguments]    ${locator}
    Wait For Elements State    ${locator}    visible

Element Text Sollte Gleich Sein
    [Arguments]    ${locator}    ${expected_text}
    ${text}=    Get Text    ${locator}
    Should Be Equal As Strings    ${text}    ${expected_text}

Warte Auf Bestätigung
    [Arguments]    ${message}
    Wait For Elements State    xpath=//*[contains(text(), "${message}")]    visible
