# Household-App

[Github repo](https://github.com/OdiousCode/Household-App)

## Projektmedlemmar

[Görgen Andersson](https://github.com/OdiousCode/)

[Erik Jakobsson](https://github.com/Serover)

[Gentrit Hoti](https://github.com/gentrithotii)

[Anna Nguyen](https://github.com/Annangggg)

[Hampus Andersson](https://github.com/HampusAndersson01)


# Hur du kör projektet
1 - Först behöver du installera nodeJS - länken: https://nodejs.org/en/download/
2 - Skriv npm install på consolen för att installera senaste version av npm
3 - Skriv npm start för att köra projektet

# Avgränsningar

## Uppgiftsbeskrivning ##

I det här projektet skapar vi en nativ hushåll app med hjälp av React
Native (RN), Expo och Typescript. Nedan följer information om applikationen inklusive en kravlista över det som vi har gjort:

## Syfte: Göra det lättare att samsas kring och bli påmind om sysslor i hemmet.
Målgrupp: Familjer, sambos, släktingar.
Produktägare: David Jensen.
Avatarer: � � � � � � � �
 
## Kravlista vi har uppfyllt:
Antal krav: 32/40
G: 20/20
VG: 12/20

# Delmoment

## Kravlista (4)
[x] En logga, splashscreen och appikon ska designas och användas. *
- Vi inspererar från internet sen justera lite.
[x] Applikationen ska byggas med RN, Expo & TS. *
- Vi byggde appen med hjälp av react native, expo och typescript.
[x] Designen av appen ska utgå ifrån befintliga skisser, undantag kan ges men ska diskuteras med produktägare, godkännas och dokumenteras. *
- Vi demonstrerar appen för kunden så frågade vi kunden om det är okej att bygga vidare.
[x] Information ska kommuniceras till och från en server. (VG)
- Vi använder realtime firebase för vår database.

## Hushåll (7)
[x] Ett hushåll ska ha ett namn och en genererad (enkel) kod så andra kan gå med i hushållet, namnet ska gå att ändra. *
- När användare skapar ett hushåll så ange de ett namn och en hushållskod genereras. Koden sen skickar till användare som vill gå med i hushållet. Hushållsnamn kan ägaren sedan ändra i taskOverViewScreen genom klickar på penna brevid hushållsnamnet.
[x] Alla användare i ett hushåll ska kunna se vilka som tillhör ett hushåll.
- Vi visar alla användare och ägare i hushållets hemskärm.
[x] En ägare av ett hushåll ska kunna se förfrågningar om att gå med i hushållet.
- Ägaren kan se förfrågningar i pendingskärm.
[x] En ägare ska kunna acceptera eller neka förfrågningar.
- Ägare kan acceptera eller neka genom trycka på bocken.
[x] En ägare ska kunna göra andra till ägare.
- Ägare kan göra andra till admin genom att trycka på kungakronan.
[ ] En ägare ska kunna pausa en användare och under pausade perioder ska användare inte
tas med i statistiken.
[ ] Om en använder har pausats under en del av en period i statistiken ska graferna
normaliseras.

## Konto (5)
[x] En användare ska kunna registrera och logga in sig. *
- Använder oss utav firebase auth

[x] En användare ska kunna skapa ett nytt hushåll. *
- Med knapp på profilskärmen(Hemskärmen) "Skapa hushåll".

[x] En användare ska kunna gå med i ett hushåll genom att ange hushållets kod. *
- Vi använder oss av ID på hushåll som kod, fast nedkortad till 6 chars.

[x] När en användare har valt att gå med i ett hushåll behöver en ägare av hushållet först
godkänna användaren.
- Efter en ägare har godkänt ansökan, så kan man gå med hushållet och då får man välja namn och en av dom tillgängliga avatarerna.

[x] En användare ska kunna lämna ett hushåll.
- På profileoverviewscreen kan man klicka på en penna på sin användare, för att byta namn eller lämna hushåll.
- Som admin kan du även ändra andra användare, samt ta bort dom ifrån hushållet eller göra dom till admin(ägare).

## Profil (6)
[x] En användare ska kunna ange sitt namn. *
- När du skapar din profil anger du ett namn, kan även ändra detta i profileoverviewen i hushållet.

[x] En användare ska kunna välja en avatar (emoji-djur + färg) från en fördefinierad lista. *
- Vi har en array av ikoner + anknuten färg användare kan välja emellan. När du skapar din profil, så finns bara dom som är tillgängliga att välja på.

[x] Valda avatarer ska inte kunna väljas av andra användare i hushållet. *
- Listan av tillgängliga avatarer visar bara dom som ej är tagna ännu, när man skapar sin profil.

[x] Avataren ska användas i appen för att visa vad användaren har gjort. *
- När du markerar en syssla som gjord, så dyker din avatar upp på listan av sysslor.

[ ] En användare ska kunna ställa in appens utseende (mörkt, ljust, auto).

[x] Om en användare tillhör två eller fler hushåll ska denne kunna välja att byta mellan de
olika hushållen.
- På profilsidan kan du välja emellan alla hushåll du är medlem eller ägare av.

## Sysslor (6)
[x] En ägare ska kunna lägga till sysslor att göra i hemmet. *
- Create task finns i task overview som knapp när man är ägare, inte annars.

[x] En syssla ska ha ett namn, en beskrivning (text), hur ofta den ska göras (dagar), och en vikt som beskriver hur energikrävande den är. *
- Vår task "modell" har allt detta samt attribut för ljud/bild för senare bruk.

[ ] En användare ska kunna lägga till en ljudinspelning och en bild för att beskriva sysslan ytterligare.

[x] En ägare ska kunna redigera en syssla. *
- Genom taskoverview kan man klicka på sysslan för att ändra på den.

[x] En ägare ska kunna ta bort en syssla.
- Går att ta bort en sysslar genom att editera den, genom task list -> redigera och sedan klicka ta bort.

[ ] När en syssla tas bort ska användaren få en varning om att all statistik gällande sysslan
också kommer att tas bort och få valet att arkivera sysslan istället.

## Dagsvyn (3)
[x] Alla sysslor ska listas i en dagsvy och ge en översikt kring vad som behöver göras. *
- Vi visar försenade sysslor, vilka som ska göras idag, vilka som ska göras senare i veckan och vilka som kommer i framtiden.

[x] Utöver sysslans namn ska även vem/vilka som har gjort sysslan visas, hur många dagar
sedan sysslan gjordes senast samt om den är försenad. *
- Vi visar den som gjorde sysslan senast med dess avatar, samt hur många dagar kvar tills den behöver vara gjord igen.

[x] När en användare väljer en syssla ska beskrivningen av sysslan visas och det ska även
med ett enkelt tryck gå att markera sysslan som gjord. *
- Klickar man på en syssla får man beskrivningen, 'see more' som visar alla detaljer, såom frekvens vikt osv. Även en knapp för att markera som klar, då skapas en task history.

## Statistik (6)
[x] En användare ska kunna se fördelningen av gjorda sysslor mellan användarna i sitt
hushåll. *
- Man kan se vem som har gjort vilken syssla, samt totala "vikten" av gjorda sysslor i en sammanfattningsgraf.

[x] Varje statistikvy ska visa den totala fördelningen (inräknat vikterna för sysslorna) samt
fördelning av varje enskild syssla. *
- Vi visar totala fördelningen av samtliga sysslor multiplicerat med dess vikt, för att visa vem som är bäst.

[x] Det ska finnas en statistikvy över ”nuvarande vecka”. *
- Statistikvyn visar nuvarande vecka som default, finns knapp för att visa förra veckan, förra månaden och all time.

[x] Det ska finnas en statistikvy över ”förra vecka”.
- Statistikvyn visar nuvarande vecka som default, finns knapp för att visa förra veckan, förra månaden och all time.

[x] Det ska finnas en statistikvy över ”förra månaden”.
- Statistikvyn visar nuvarande vecka som default, finns knapp för att visa förra veckan, förra månaden och all time.

[x] Om det inte finns statistik för en av vyerna ska den vyn inte visas.
- Det renderas ej statistik om det inte finns för den valda rangen.

## Schemaläggning (3)
[ ] En ägare ska kunna tilldela och ta bort sysslor från användare i hushållet.
- To be implemented

[ ] Användare ska kunna se de tilldelade sysslorna i sitt gränssnitt.
- To be implemented

[ ] En ägare ska kunna skapa grupper av sysslor som automatiskt tilldelas användarna i
hushållet och roteras baserat på ett intervall i dagar.
- To be implemented


Inlämning

Krav för godkänt:
1. De nödvändiga kraven ifrån kravlistan ovan är uppfyllda
2. Git & GitHub har använts.
3. Projektmappen innehåller en README.md fil - (läs ovan för mer info)
4. Uppgiften lämnas in i tid!
5. Muntlig presentation är genomförd
Krav för väl godkänt:
1. Alla punkter för godkänt är uppfyllda
2. Ni har använt CI/CD under projektet.
3. Applikationen kommunicerar data till och från en backend tjänst (ni väljer) med hjälp
av Redux & redux-thunk.

