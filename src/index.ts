import {Window} from "./core/ui"
import {Button} from "./widgets/button"
import {Heading} from "./widgets/heading"
import {CheckBox} from "./widgets/checkbox"
import {RadioButton} from "./widgets/radiobutton"
import {ProgressBar} from "./widgets/progressbar"

let w = new Window(window.innerHeight - 10, '100%');

let lbl1 = new Heading(w);
lbl1.text = "Button Demo";
lbl1.tabindex = 1;
lbl1.fontSize = 16;
lbl1.move(10, 20);

let btn = new Button(w);
btn.tabindex = 2;
btn.fontSize = 14;
btn.move(12, 50);
btn.label = "Click Here";
btn.size = { width: 140, height: 40 };

let count = 0;
btn.onClick(() => {
    count++;
    lbl1.text = `Button clicked ${count} time${count === 1 ? "" : "s"}`;
});

let cb = new CheckBox(w);
cb.label = "Enable option";
cb.move(20, 120);

cb.onChange((checked: boolean) => {
    console.log("Checkbox changed:", checked);
});

let radio = new RadioButton(w, ["Small", "Medium", "Large"]);
radio.move(20, 180);

radio.onChange((index: number, label: string) => {
    console.log("Radio selected:", index, label);
});

let progress = new ProgressBar(w);
progress.barWidth = 260;
progress.incrementValue = 10;
progress.move(20, 310);

progress.onIncrement((value: number) => {
    console.log("Progress incremented:", value);
});

progress.onStateChange((state: string) => {
    console.log("Progress state changed:", state);
});

