import { IdleUpWidgetState, PressedWidgetState } from "../core/ui";
import { Window, Widget, RoleType, EventArgs } from "../core/ui";
import { Rect, Text, Box } from "../core/ui";

class Button extends Widget {
    private _rect: Rect;
    private _text: Text;
    private _eventRect: Rect;
    private _input: string;
    private _fontSize: number;
    private _text_y: number;
    private _text_x: number;
    private _clickHandler: (() => void) | null = null;

    private defaultText: string = "Button";
    private defaultFontSize: number = 18;
    private defaultWidth: number = 120;
    private defaultHeight: number = 40;

    constructor(parent: Window) {
        super(parent);

        this.height = this.defaultHeight;
        this.width = this.defaultWidth;
        this._input = this.defaultText;
        this._fontSize = this.defaultFontSize;

        this.role = RoleType.button;

        this.render();
        this.setState(new IdleUpWidgetState());
        this.selectable = false;
        this.update();
    }

    set label(value: string) {
        this._input = value;
        this.update();
    }

    get label(): string {
        return this._input;
    }

    set size(value: { width: number; height: number }) {
        this.width = value.width;
        this.height = value.height;
        this.update();
    }

    get size(): { width: number; height: number } {
        return { width: this.width, height: this.height };
    }

    set fontSize(size: number) {
        this._fontSize = size;
        this.update();
    }

    get fontSize(): number {
        return this._fontSize;
    }

    private positionText() {
        let box: Box = this._text.bbox();
        this._text_x = (+this._rect.x() + (+this._rect.width() / 2) - (box.width / 2));
        this._text_y = (+this._rect.y() + (+this._rect.height() / 2) - (box.height / 2));

        if (this._text_x >= 0) this._text.x(this._text_x);
        if (this._text_y >= 0) this._text.y(this._text_y);
    }

    render(): void {
        this._group = (this.parent as Window).window.group();

        this._rect = this._group.rect(this.width, this.height);
        this._rect.stroke({ color: "#1e1b4b", width: 2 });
        this._rect.fill("#4f46e5");
        this._rect.radius(10);

        this._text = this._group.text(this._input);
        this._text.font({
            size: this._fontSize,
            family: "Arial",
            weight: "bold"
        });
        this._text.fill("white");

        this.outerSvg = this._group;

        this._eventRect = this._group.rect(this.width, this.height).opacity(0).attr("id", 0);
        this.registerEvent(this._eventRect);

        this.positionText();
    }

    override update(): void {
        if (this._rect != null) {
            this._rect.size(this.width, this.height);
        }

        if (this._eventRect != null) {
            this._eventRect.size(this.width, this.height);
        }

        if (this._text != null) {
            this._text.font("size", this._fontSize);
            this._text.text(this._input);
            this._text.fill("white");
            this.positionText();
        }

        super.update();
    }

    pressReleaseState(): void {
        if (this.previousState instanceof PressedWidgetState) {
            this.raise(new EventArgs(this));
            if (this._clickHandler) {
                this._clickHandler();
            }
        }
    }

    onClick(callback: () => void): void {
        this._clickHandler = callback;
    }

    idleupState(): void {
        this._rect.fill("#4f46e5");
        this._rect.stroke({ color: "#1e1b4b", width: 2 });
        this._text.fill("white");
    }

    idledownState(): void {
        this._rect.fill("#4338ca");
        this._rect.stroke({ color: "#1e1b4b", width: 2 });
        this._text.fill("white");
    }

    pressedState(): void {
        this._rect.fill("#312e81");
        this._rect.stroke({ color: "#172554", width: 2 });
        this._text.fill("white");
        this._group.dmove(1, 1); // slight push down effect
    }

    hoverState(): void {
        this._rect.fill("#6366f1");
        this._rect.stroke({ color: "#312e81", width: 2 });
        this._text.fill("white");
        this._rect.fill("#6366f1");
    }

    hoverPressedState(): void {
        this._rect.fill("#3730a3");
        this._rect.stroke({ color: "#172554", width: 2 });
        this._text.fill("white");
        
    }

    pressedoutState(): void {
        this._rect.fill("#7c83ff");
        this._rect.stroke({ color: "#312e81", width: 2 });
        this._text.fill("white");
    }

    moveState(): void {}

    keyupState(keyEvent?: KeyboardEvent): void {
        if (keyEvent && (keyEvent.key === "Enter" || keyEvent.key === " ")) {
            if (this._clickHandler) {
                this._clickHandler();
            }
        }
    }
}

export { Button };