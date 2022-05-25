const Obniz = require("obniz");

let obnizIdList = [
"9895-9381",
"5915-2228"
]
let client_name = ["荻原一純", "阿部恵理子"]
let lights = []
let turn = -1
let result = []

//obnizに表示する顔文字クラス
class Emotion{
  constructor() {
    //obnizがASCIIしか対応してないため絵文字を出力できなかった。    
    this.emotion = ["bad", "soso", "good"]
    this.state = 1
  }
  
  //現在の顔文字を返却
  getState(){
    return this.emotion[this.state];
  };
  
  //スティックを右に倒した時の顔文字を返却
  getRight(){
    this.state = (this.state + 1) % 3;
    return this.emotion[this.state]
  };
  
  //スティックを左に倒した時の顔文字を返却
  getLeft(){
    this.state = (this.state + 2) % 3;
    return this.emotion[this.state]
  }
}

let tmp = 0;
for(let obnizId of obnizIdList){
  let obniz = new Obniz(obnizId);

  obniz.onconnect = async function () {
    //obnizの初期化処理
    let client_number = tmp++;    
    let light = obniz.wired("Keyestudio_TrafficLight", {gnd:0, green:1, yellow:2, red:3});
    lights.push(light);
    let button = obniz.wired("Keyestudio_Button", {signal:9, vcc:10, gnd:11});
    const emotion = new Emotion();
    let press_count = 0;

    
    obniz.display.clear();
    obniz.display.print(emotion.getState());
    
    //顔文字の切り替え処理
    obniz.switch.onchange = function (state) {
      if (state === "right") {
        obniz.display.clear();
        obniz.display.print(emotion.getRight());
      }else if(state === "left") {
        obniz.display.clear();
        obniz.display.print(emotion.getLeft());
      }
    };
  
    //ボタンの受付処理
    button.onchange = function(pressed){
      if(pressed == true && client_number == turn){
        console.debug("name: " + client_name[client_number] + " pressed:" + emotion.getState() + " count:" + press_count);
        press_count++;
        if(press_count >= 10){
          console.debug(emotion.getState())
          turn++;

          //別の端末が用意出来たらコメントアウトを外す
          // lights[++turn].green.blink();
          obniz.close()
        }
      }
    };
  }

}

//最初の人のランプを点滅させてリレーを開始する
setTimeout(()=>{
  turn=0;
  lights[turn].green.blink();
},3000)

