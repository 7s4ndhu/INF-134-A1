import { IdleUpWidgetState, PressedWidgetState } from "../core/ui";
import { Window, Widget, RoleType, EventArgs } from "../core/ui";
import { Rect, Text, Box } from "../core/ui";

class ProgressBar extends Widget {
    private _track: Rect;
    private _fill: Rect;
    private _label: Text;
    private _eventRect: Rect;

    private _value: number = 0;
    private _incrementValue: number = 10;
    private _barWidth: number = 250;
    private _fontSize: number = 14;

    private _incrementHandler: ((value: number) => void) | null = null;
    private _stateChangeHandler: ((state: string) => void) | null = null;

    private defaultHeight: number = 32;

    constructor(parent: Window) {
        super(parent);

        this.width = this._barWidth;
        this.height = this.defaultHeight;
        this.role = RoleType.none;

        this.render();
        this.setState(new IdleUpWidgetState());
        this.selectable = false;
        this.update();
    }

    set barWidth(value: number) {
        this._barWidth = value;
        this.width = value;
        this.update();
    }

    get barWidth(): number {
        return this._barWidth;
    }

    set incrementValue(value: number) {
        this._incrementValue = value;
    }

    get incrementValue(): number {
        return this._incrementValue;
    }

    get value(): number {
        return this._value;
    }

    onIncrement(callback: (value: number) => void): void {
        this._incrementHandler = callback;
    }

    onStateChange(callback: (state: string) => void): void {
        this._stateChangeHandler = callback;
    }

    increment(amount?: number): void {
        let step = amount !== undefined ? amount : this._incrementValue;

        this._value += step;

        if (this._value > 100) {
            this._value = 100;
        }

        if (this._value < 0) {
            this._value = 0;
        }

        this.update();

        this.raise(new EventArgs(this));

        if (this._incrementHandler) {
            this._incrementHandler(this._value);
        }
    }

    reset(): void {
        this._value = 0;
        this.update();

        if (this._incrementHandler) {
            this._incrementHandler(this._value);
        }
    }

    private notifyStateChange(stateName: string): void {
        if (this._stateChangeHandler) {
            this._stateChangeHandler(stateName);
        }
    }

    private positionLabel(): void {
        let box: Box = this._label.bbox();

        let x = (this._barWidth / 2) - (box.width / 2);
        let y = 7;

        this._label.move(x, y);
}

    render(): void {
        this._group = (this.parent as Window).window.group();

        this._track = this._group.rect(this._barWidth, this.height);
        this._track.fill("#eef2ff");
        this._track.stroke({ color: "#1e1b4b", width: 2 });
        this._track.radius(10);

        this._fill = this._group.rect(0, this.height);
        this._fill.fill("#4f46e5");
        this._fill.radius(10);

        this._label = this._group.text("0%");
        this._label.font({
            size: this._fontSize,
            family: "Arial",
            weight: "bold"
        });
        this._label.fill("#ffffff");

        this.outerSvg = this._group;

        this._eventRect = this._group.rect(this._barWidth, this.height).opacity(0).attr("id", 0);
        this.registerEvent(this._eventRect);

        this.positionLabel();
    }

    override update(): void {
        if (this._track != null) {
            this._track.size(this._barWidth, this.height);
        }

        if (this._fill != null) {
            let fillWidth = (this._value / 100) * this._barWidth;
            this._fill.size(fillWidth, this.height);
        }

        if (this._label != null) {
            this._label.text(`${this._value}%`);
            this.positionLabel();
            this._label.front();
}

        if (this._eventRect != null) {
            this._eventRect.size(this._barWidth, this.height);
        }

        super.update();
    }

    idleupState(): void {
        this._track.fill("#eef2ff");
        this.notifyStateChange("idle");
    }

    idledownState(): void {
        this._track.fill("#e0e7ff");
        this.notifyStateChange("idle down");
    }

    pressedState(): void {
        this._track.fill("#c7d2fe");
        this.notifyStateChange("pressed");
    }

    pressReleaseState(): void {
        if (this.previousState instanceof PressedWidgetState) {
            this.increment();
        }
    }

    hoverState(): void {
        this._track.fill("#f5f3ff");
        this.notifyStateChange("hover");
    }

    hoverPressedState(): void {
        this._track.fill("#c7d2fe");
        this.notifyStateChange("hover pressed");
    }

    pressedoutState(): void {
        this._track.fill("#e0e7ff");
        this.notifyStateChange("pressed out");
    }

    moveState(): void {}

    keyupState(keyEvent?: KeyboardEvent): void {
        if (keyEvent && (keyEvent.key === "Enter" || keyEvent.key === " ")) {
            this.increment();
        }
    }
}

export { ProgressBar };