# 2048 Game

> В 2048 размествате плочки с числа и ги обединявате 
> като се събират само плочки с еднакви числа (2+2, 8+8, 64+64 и т.н.). 
> Краят на играта идва с плочката с число 2048 върху нея.

[Играй](http://2048.csyntax.net)

## Build
* Using VisualStudio Code
    * use `Ctrl + Shift + B`
* Using Terminal
    * use `tsc` command

## Running on Docker
* `docker build -t 2048 .`
* `docker run -p 80:80 -it 2048`