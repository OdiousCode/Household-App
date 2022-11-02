# Household-App

[Github repo](https://github.com/OdiousCode/Household-App)

## Projektmedlemmar

[Görgen Andersson](https://github.com/OdiousCode/)

[Erik Jakobsson](https://github.com/Serover)

[Gentrit Hoti](https://github.com/gentrithotii)

[Anna Nguyen](https://github.com/Annangggg)

[Hampus Andersson](https://github.com/HampusAndersson01)



# Hur du kör projektet

# Avgränsningar

## Uppgiftsbeskrivning ##

I den här inlämningen ska ni i grupp om 4-5 skapa en nativ app med med hjälp av React
Native (RN), Expo och Typescript. Applikationen ni har fått i uppdrag att bygga heter
Hushållet. Nedan följer information om applikationen inklusive en kravlista över det som
ska göras.
Syfte: Göra det lättare att samsas kring och bli påmind om sysslor i hemmet.
Målgrupp: Familjer, sambos, släktingar.
Produktägare: David Jensen.
Avatarer: � � � � � � � �
Läs noga igenom hela uppgiftsbeskrivningen innan ni börjar.

Kravlista
*: Dessa krav måste göras (20st).
Antal krav: 40.
G: 20 (50%).
VG: 32 (80%).
Kravlista (4)
En logga, splashscreen och appikon ska designas och användas. *
Applikationen ska byggas med RN, Expo & TS. *
Designen av appen ska utgå ifrån befintliga skisser, undantag kan ges men ska diskuteras
med produktägare, godkännas och dokumenteras. *
Information ska kommuniceras till och från en server. (VG)
Hushåll (7)
Ett hushåll ska ha ett namn och en genererad (enkel) kod så andra kan gå med i hushållet,
namnet ska gå att ändra. *
Alla användare i ett hushåll ska kunna se vilka som tillhör ett hushåll.
En ägare av ett hushåll ska kunna se förfrågningar om att gå med i hushållet.
En ägare ska kunna acceptera eller neka förfrågningar.
En ägare ska kunna göra andra till ägare.
En ägare ska kunna pausa en användare och under pausade perioder ska användare inte
tas med i statistiken.
Om en använder har pausats under en del av en period i statistiken ska graferna
normaliseras.

# Delmoment

## Konto (5)
En användare ska kunna registrera och logga in sig. *
- Anväder oss utav firebase auth

En användare ska kunna skapa ett nytt hushåll. *
- Med knapp på profilskärmen(Hemskärmen) "Skapa hushåll".

En användare ska kunna gå med i ett hushåll genom att ange hushållets kod. *
- Vi använder oss av ID på hushåll som kod, fast nedkortad till 6 chars.

När en användare har valt att gå med i ett hushåll behöver en ägare av hushållet först
godkänna användaren.
- Efter en ägare har godkänt ansökan, så kan man gå med hushållet och då får man välja namn och en av dom tillgängliga avatarerna.

En användare ska kunna lämna ett hushåll.
- På profileoverviewscreen kan man klicka på en penna på sin användare, för att byta namn eller lämna hushåll.
- Som admin kan du även ändra andra användare, samt ta bort dom ifrån hushållet eller göra dom till admin(ägare).

## Profil (6)
En användare ska kunna ange sitt namn. *
- När du skapar din profil anger du ett namn, kan även ändra detta i profileoverviewen i hushållet.

En användare ska kunna välja en avatar (emoji-djur + färg) från en fördefinierad lista. *
- Vi har en array av ikoner + anknuten färg användare kan välja emellan. När du skapar din profil, så finns bara dom som är tillgängliga att välja på.

Valda avatarer ska inte kunna väljas av andra användare i hushållet. *
- Listan av tillgängliga avatarer visar bara dom som ej är tagna ännu, när man skapar sin profil.

Avataren ska användas i appen för att visa vad användaren har gjort. *
- När du markerar en syssla som gjord, så dyker din avatar upp på listan av sysslor.

En användare ska kunna ställa in appens utseende (mörkt, ljust, auto).
- To be implemented

Om en användare tillhör två eller fler hushåll ska denne kunna välja att byta mellan de
olika hushållen.
- På profilsidan kan du välja emellan alla hushåll du är medlem eller ägare av.

## Sysslor (6)
En ägare ska kunna lägga till sysslor att göra i hemmet. *
- Create task finns i task overview som knapp när man är ägare, inte annars.

En syssla ska ha ett namn, en beskrivning (text), hur ofta den ska göras (dagar), och en
vikt som beskriver hur energikrävande den är. *
- Vår task "modell" har allt detta samt attribut för ljud/bild för senare bruk.

En användare ska kunna lägga till en ljudinspelning och en bild för att beskriva sysslan
ytterligare.
- To be implemented

En ägare ska kunna redigera en syssla. *
- Genom taskoverview kan man klicka på sysslan för att ändra på den.

En ägare ska kunna ta bort en syssla.
- Går att ta bort en sysslar genom att editera den, genom task list -> redigera och sedan klicka ta bort.

När en syssla tas bort ska användaren få en varning om att all statistik gällande sysslan
också kommer att tas bort och få valet att arkivera sysslan istället.
- To be implemented

## Dagsvyn (3)
Alla sysslor ska listas i en dagsvy och ge en översikt kring vad som behöver göras. *
- To be implemented, just nu visar vi alla tasks oavsett

Utöver sysslans namn ska även vem/vilka som har gjort sysslan visas, hur många dagar
sedan sysslan gjordes senast samt om den är försenad. *
- Vi visar den som gjorde sysslan senast med dess avatar, samt hur många dagar kvar tills den behöver vara gjord igen.

När en användare väljer en syssla ska beskrivningen av sysslan visas och det ska även
med ett enkelt tryck gå att markera sysslan som gjord. *
- Klickar man på en syssla får man beskrivningen, 'see more' som visar alla detaljer, såom frekvens vikt osv. Även en knapp för att markera som klar, då skapas en task history.

## Statistik (6)
En användare ska kunna se fördelningen av gjorda sysslor mellan användarna i sitt
hushåll. *
- Man kan se vem som har gjort vilken syssla, samt totala "vikten" av gjorda sysslor i en sammanfattningsgraf.

Varje statistikvy ska visa den totala fördelningen (inräknat vikterna för sysslorna) samt
fördelning av varje enskild syssla. *
- Vi visar totala fördelningen av samtliga sysslor multiplicerat med dess vikt, för att visa vem som är bäst.

Det ska finnas en statistikvy över ”nuvarande vecka”. *
- Statistikvyn visar nuvarande vecka som default, finns knapp för att visa förra veckan, förra månaden och all time.

Det ska finnas en statistikvy över ”förra vecka”.
- Statistikvyn visar nuvarande vecka som default, finns knapp för att visa förra veckan, förra månaden och all time.

Det ska finnas en statistikvy över ”förra månaden”.
- Statistikvyn visar nuvarande vecka som default, finns knapp för att visa förra veckan, förra månaden och all time.

Om det inte finns statistik för en av vyerna ska den vyn inte visas.
- Det renderas ej om statistik inte finns för den valda rangen.

## Schemaläggning (3)
En ägare ska kunna tilldela och ta bort sysslor från användare i hushållet.
- To be implemented

Användare ska kunna se de tilldelade sysslorna i sitt gränssnitt.
- To be implemented

En ägare ska kunna skapa grupper av sysslor som automatiskt tilldelas användarna i
hushållet och roteras baserat på ett intervall i dagar.
- To be implemented


Inlämning
För att bli godkänd på den här uppgiften MÅSTE ni använda GIT och GitHub.
Inlämningen sker som vanligt via läroplattformen. I din projektmapp ska det finnas
(utöver all kod) en README.md fil. Den ska innehålla en titel, beskrivning av projektet,
info om hur projektet byggs och körs samt vilka krav som är uppfyllda. Samt en .git mapp
så jag kan hitta till erat publika repo.
Presentation
Presentationen är uppdelad i tre moment. Det första momentet är en pitch på cirka 2-3
minuter där ni ska försöka sälja in era lösningar och designval. Den andra delen är ett
demo av applikationen. Slutligen ska ni reflektera kring projektet. Varje grupp har ca 20
minuter på sig.
Opponering & Individuell reflektion
I slutet av kursen ska ni genomföra en opponering på varandras arbeten och i samband
med det även lämna in en individuell reflektion. Ni kommer få ut mer information om
hur det kommer att gå till längre fram.
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

Do you have any questions or need something explained in English? - Please feel free to
ask me during a lecture. Good luck!
