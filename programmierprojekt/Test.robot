language:de
*** Einstellungen ***
Library    Browser

*** Variablen ***
${BROWSER}    chromium
${url}    https://or-tool.de

*** Testfälle ***
Öffne Browser
    [Dokumentation]    Erster Testfall
    Öffne OR-Webseite


*** Schlüsselwörter ***
Öffne OR-Webseite
    [Dokumentation]     Öffnet die OR-Webseite
    New Browser    ${BROWSER}
    New Page    ${url}
    Sleep    3s
    Close Browser
