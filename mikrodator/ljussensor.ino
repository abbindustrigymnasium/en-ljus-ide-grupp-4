#define D7 13

int AI_LightSens = 0; 

int LightValue = 0;

void setup() {
  Serial.begin(9600);
  pinMode(AI_LightSens, INPUT);
  pinMode(13, OUTPUT);
}


void loop() {
  LightValue = analogRead(AI_LightSens);
  Serial.println(LightValue);
  delay(500);
  if(LightValue > 10)
    digitalWrite(13, HIGH);
  else
    digitalWrite(13, LOW);
}
