#include <ESP8266WiFi.h>     
//Både ArduinoJson och Wifimanager måste installeras som bibliotek, de finns med i bibliotekskatalogen, tänk att ArduinoJSon versionen som ska väljas är 5.13 och inte senaste.     
#include <ArduinoJson.h> // V 5.13 inte 6! https://arduinojson.org/?utm_source=meta&utm_medium=library.properties
//needed for library
#include <DNSServer.h>
#include <ESP8266WebServer.h>
#include <WiFiManager.h>         //https://github.com/tzapu/WiFiManager
#define D7 13 // SPI Bus MOSI
#define D5 14

void setup() {
      pinMode(13, OUTPUT); //Declare GPIO13 as output
 
    // put your setup code here, to run once:
    Serial.begin(115200);
  //Från Wifimanagers hemsida.
    //WiFiManager
    //Local intialization. Once its business is done, there is no need to keep it around
    WiFiManager wifiManager;
    //reset saved settings
    //wifiManager.resetSettings();
    
    //set custom ip for portal
    //wifiManager.setAPStaticIPConfig(IPAddress(10,0,1,1), IPAddress(10,0,1,1), IPAddress(255,255,255,0));

    //fetches ssid and pass from eeprom and tries to connect
    //if it does not connect it starts an access point with the specified name
    //here  "AutoConnectAP"
    //and goes into a blocking loop awaiting configuration
    wifiManager.autoConnect("Hugo");
    //or use this for auto generated name ESP + ChipID
    //wifiManager.autoConnect();

    //if you get here you have connected to the WiFi
    Serial.println("connected...yeey :)");

}

 String Namn="Bla"; //Lampans namn
 int Styrka= 0; //Styrkan
 bool LampExist=false; //Finns lampan redan eller är den ny?
 bool GottenValues = false; //Har vi hämtat några värden redan från databasen?
 int Value = 0;
 int On = 0;
 int warm = 0;

String GetfromDB(String host){
String url= "/grupp4_light/"+Namn; //Urlen jag använder för att posta mina värden
  // Detta skickar värdena till servern.
   String Output ="GET "+ url + " HTTP/1.1\r\n" + //Säger att det är typen post, kan vara patch, get,delete beroende på vad man vill göra., samt urlen vi ska till.
                 "Host: " + host+ "\r\n" + //Berättar vilken host det är vi ansluter till
                 "\r\nConnection: close\r\n\r\n"; //skickar vår buffer som  body
 return Output;
}

String SendtoDB(String host){
  String type ="POST ";
  if(GottenValues==true)
  {
  String url= "/grupp4_light/"; //Urlen jag använder för att posta mina värden
   
  StaticJsonBuffer<300> jsonBuffer; //Skapar en buffer, det vill säga så mycket minne som vårt blivande jsonobjekt får använda.
  JsonObject& root = jsonBuffer.createObject(); //Skapar ett jsonobjekt som vi kallar root
  root["Namn"] = Namn; //Skapar parameterna name och ger den värdet Vykort
  root["Mode"] = On;
  root["Styrka"] = Styrka;// Samma som ovan
  root["warm"] = warm;
  String buffer;  //Skapar en string som vi kallar buffer
  root.printTo(buffer); //Lägger över och konverterar vårt jsonobjekt till en string och sparar det i buffer variabeln.
  if(LampExist==true)
  {
  type ="PATCH ";
      Serial.println("Uppdaterar värdet!");
  }
//här någonstans ska jag anvädna POST eller PATCH beroende på om värdet finns!!!!
  // Detta skickar värdena till servern.
   String Output =type+url + " HTTP/1.1\r\n" + //Säger att det är typen post, kan vara patch, get,delete beroende på vad man vill göra., samt urlen vi ska till.
                 "Host: " + host+ "\r\n" + //Berättar vilken host det är vi ansluter till
                 "Content-Type: application/json\r\n" + //Säger att det är Json format vi skickar (dock konverterat till en string för att kunna skickas.
                 "Content-Length: " + buffer.length() + "\r\n" + //Berättar hur stort packet vi ska skicka.
                 "\r\n" + // Detta är en extra radbrytning för att berätta att det är här bodyn startar.
                 buffer + "\n"; //skickar vår buffer som  body
 
 return Output;
  }
  else
  return "";
}

void ConnecttoDB(String input){

   const int httpPort = 3001; //porten vi ska till
  const char* host = "iot.abbindustrigymnasium.se";//Adressen vi ska ansluta till. 7Laddaremygglustbil "http://iot.abbindustrigymnasium.se"
    
     Serial.print("connecting to ");
 Serial.println(host); //Skriver ut i terminalen för att veta vart vi ska skicka värdena.
  
  // Use WiFiClient class to create TCP connections
  WiFiClient client;
  if (!client.connect(host, httpPort)) { //Försöker ansluta
    Serial.println("connection failed");
    return;
  }
  else  //Om vi kan ansluta så ska lampa lysa
  {
    //digitalWrite(13, HIGH);
    }
if(input =="GET")
client.print(GetfromDB(host));
else
client.print(SendtoDB(host));

  unsigned long timeout = millis();
  while (client.available() == 0) {
    if (millis() - timeout > 10000) {
      Serial.println(">>> Client Timeout !");
      client.stop();
      return;
    }
  }

String json = ""; //De delarna vi vill ha ut av meddelandet sparar vi i stringen json
boolean httpBody = false; //bool för att säa att vi har kommit ner till bodydelen
// tittar om vi har anslutit till clienten
while (client.available()) {
  String line = client.readStringUntil('\r'); //Läser varje rad tills det är slut på rader
  if (!httpBody && line.charAt(1) == '{') { //Om vi hittar { så vet vi att vi har nått bodyn
    httpBody = true; //boolen blir true för att vi ska veta för nästa rad att vi redan är i bodyn
  }
  if (httpBody) { //Om bodyn är sann lägg till raden i json variabeln
    json += line;
  }
}
//Skriver ut bodyns data
    Serial.println("Got data:");
    Serial.println(json);
  if(input =="GET") //Om det är Get så kör vi metoden UpdateValues
    UpdateValues(json);

  Serial.println();
  Serial.println("closing connection");
}

void UpdateValues(String json){
      //Vi skapar ett Jsonobjekt där vi klistrar in värdena från bodyn
      StaticJsonBuffer<400> jsonBuffer;
    JsonObject& root = jsonBuffer.parseObject(json);
    //Vi skapar sedan lokala strings där vi lägger över värdena en i taget
    String dataL = root["Namn"];
         if(dataL!="none")
         {
    bool datah = root["Mode"];
    int datas = root["Styrka"];
    //Därefter skriver vi över de lokala värdena till våra globala värden för lampan
     Namn = dataL; 
     On =datah;
     Styrka = datas;

       LampExist=true;
     Serial.println(Styrka);
     Serial.println(On);
     Serial.println(warm);
         }
         else
         {
          String Mess =root["message"];
         Serial.print(Mess);
         }
  GottenValues = true;
}

void UpdatingLamp(){
  if(On >= 1)
    if(warm == 3)
      analogWrite(13, Styrka);
    else if(warm == 2){
      analogWrite(13, Styrka);
      analogWrite(14, Styrka);
    }
    else if(warm == 1)
      analogWrite(14, Styrka);
    }
  else
    analogWrite(13, LOW);
    analogWrite(14, LOW);
}

void loop() {
 ConnecttoDB("GET"); 
  UpdatingLamp();  
 //ConnecttoDB("POST");
 //delay(10000);
}
   //analog write, 0 -1023

 
// digitalWrite(13, LOW);
