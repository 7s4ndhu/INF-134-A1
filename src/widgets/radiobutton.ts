import { IdleUpWidgetState, PressedWidgetState } from "../core/ui";
import { Window, Widget, RoleType, EventArgs } from "../core/ui";
import { Circle, Text, Rect } from "../core/ui";

class RadioButton extends Widget {
    private _buttons: Circle[] = [];
    private _dots: Circle[] = [];
    private _labels: Text[] = [];
    private _eventRects: Rect[] = [];

    private _options: string[];
    private _selectedIndex: number = 0;
    private _activeIndex: number = 0;
    private _fontSize: number = 16;

    private _changeHandler: ((index: number, label: string) => void) | null = null;

    private buttonRadius: number = 10;
    private spacing: number = 34;
    private defaultWidth: number = 200;

    constructor(parent: Window, options: string[]) {
        super(parent);

        if (options.length < 2) {
            options = ["Option 1", "Option 2"];
        }

        this._options = options;
        this.width = this.defaultWidth;
        this.height = this._options.length * this.spacing;

        this.role = RoleType.group;

        this.render();
        this.setState(new IdleUpWidgetState());
        this.selectable = false;
        this.update();
    }

    set labels(values: string[]) {
        if (values.length >= 2) {
            this._options = values;
            this.update();
        }
    }

    get labels(): string[] {
        return this._options;
    }

    set selectedIndex(index: number) {
        if (index >= 0 && index < this._options.length) {
            this.selectIndex(index);
        }
    }

    get selectedIndex(): number {
        return this._selectedIndex;
    }

    get selectedLabel(): string {
        return this._options[this._selectedIndex];
    }

    onChange(callback: (index: number, label: string) => void): void {
        this._changeHandler = callback;
    }

    private selectIndex(index: number): void {
        if (index < 0 || index >= this._options.length) {
            return;
        }

        this._selectedIndex = index;
        this.update();

        this.raise(new EventArgs(this));

        if (this._changeHandler) {
            this._changeHandler(this._selectedIndex, this._options[this._selectedIndex]);
        }

        console.log("Radio selected:", this._selectedIndex, this._options[this._selectedIndex]);
    }

    render(): void {
        this._group = (this.parent as Window).window.group();
        this.outerSvg = this._group;

        for (let i = 0; i < this._options.length; i++) {
            let y = i * this.spacing + this.buttonRadius + 2;

            let outer = this._group.circle(this.buttonRadius * 2);
            outer.move(0, y - this.buttonRadius);
            outer.fill("#ffffff");
            outer.stroke({ color: "#1e1b4b", width: 2 });

            let dot = this._group.circle(10);
            dot.move(5, y - 5);
            dot.fill("#4f46e5");

            let label = this._group.text(this._options[i]);
            label.font({
                size: this._fontSize,
                family: "Arial"
            });
            label.fill("#111827");
            label.move(32, y - 11);

            let eventRect = this._group.rect(this.width, this.spacing);
            eventRect.move(0, i * this.spacing);
            eventRect.fill("#ffffff");
            eventRect.opacity(0.01);
            eventRect.attr("id", "radio-" + i);

            eventRect.mouseover(() => {
                this._activeIndex = i;
                this.hoverState();
            });

            eventRect.mouseout(() => {
                this.idleupState();
            });

            eventRect.mousedown(() => {
                this._activeIndex = i;
                this.selectIndex(i);
                this.pressedState();
            });

            eventRect.mouseup(() => {
                this._activeIndex = i;
                this.selectIndex(i);
                this.hoverState();
            });

            eventRect.click(() => {
                this._activeIndex = i;
                this.selectIndex(i);
            });

            this.registerEvent(eventRect);

            this._buttons.push(outer);
            this._dots.push(dot);
            this._labels.push(label);
            this._eventRects.push(eventRect);
        }
    }

    override update(): void {
        for (let i = 0; i < this._options.length; i++) {
            if (this._labels[i] != null) {
                this._labels[i].text(this._options[i]);
            }

            if (this._buttons[i] != null) {
                this._buttons[i].fill("#ffffff");

                if (i === this._selectedIndex) {
                    this._buttons[i].stroke({ color: "#4f46e5", width: 2 });
                } else {
                    this._buttons[i].stroke({ color: "#1e1b4b", width: 2 });
                }
            }

            if (this._dots[i] != null) {
                if (i === this._selectedIndex) {
                    this._dots[i].opacity(1);
                    this._dots[i].front();
                } else {
                    this._dots[i].opacity(0);
                }
            }
        }

        // keep invisible click boxes on top
        for (let i = 0; i < this._eventRects.length; i++) {
            this._eventRects[i].front();
        }

        super.update();
    }

    pressReleaseState(): void {
        if (this.previousState instanceof PressedWidgetState) {
            this.selectIndex(this._activeIndex);
        }
    }

    idleupState(): void {
        this.update();
    }

    idledownState(): void {
        if (this._buttons[this._activeIndex]) {
            this._buttons[this._activeIndex].fill("#e0e7ff");
        }
    }

    pressedState(): void {
        if (this._buttons[this._activeIndex]) {
            this._buttons[this._activeIndex].fill("#c7d2fe");
        }
    }

    hoverState(): void {
        this.update();

        if (this._buttons[this._activeIndex]) {
            this._buttons[this._activeIndex].fill("#eef2ff");
            this._buttons[this._activeIndex].stroke({ color: "#6366f1", width: 2 });
        }
    }

    hoverPressedState(): void {
        if (this._buttons[this._activeIndex]) {
            this._buttons[this._activeIndex].fill("#c7d2fe");
        }
    }

    pressedoutState(): void {
        this.update();
    }

    moveState(): void {}

    keyupState(keyEvent?: KeyboardEvent): void {
        if (keyEvent && keyEvent.key === "ArrowDown") {
            let next = (this._selectedIndex + 1) % this._options.length;
            this.selectIndex(next);
        }

        if (keyEvent && keyEvent.key === "ArrowUp") {
            let previous = (this._selectedIndex - 1 + this._options.length) % this._options.length;
            this.selectIndex(previous);
        }
    }
}

export { RadioButton };