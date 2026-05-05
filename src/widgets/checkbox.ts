import { IdleUpWidgetState, PressedWidgetState } from "../core/ui";
import { Window, Widget, RoleType, EventArgs } from "../core/ui";
import { Rect, Text } from "../core/ui";

class CheckBox extends Widget {
    private _box: Rect;
    private _check: Text;
    private _labelText: Text;
    private _eventRect: Rect;

    private _label: string = "Check Box";
    private _checked: boolean = false;
    private _fontSize: number = 16;

    private _changeHandler: ((checked: boolean) => void) | null = null;

    private defaultWidth: number = 180;
    private defaultHeight: number = 30;
    private boxSize: number = 22;

    constructor(parent: Window) {
        super(parent);

        this.width = this.defaultWidth;
        this.height = this.defaultHeight;
        this.role = RoleType.button;

        this.render();
        this.setState(new IdleUpWidgetState());
        this.selectable = false;
        this.update();
    }

    set label(value: string) {
        this._label = value;
        this.update();
    }

    get label(): string {
        return this._label;
    }

    set checked(value: boolean) {
        this._checked = value;
        this.update();
    }

    get checked(): boolean {
        return this._checked;
    }

    onChange(callback: (checked: boolean) => void): void {
        this._changeHandler = callback;
    }

    render(): void {
        this._group = (this.parent as Window).window.group();

        this._box = this._group.rect(this.boxSize, this.boxSize);
        this._box.fill("#ffffff");
        this._box.stroke({ color: "#1e1b4b", width: 2 });
        this._box.radius(5);

        this._check = this._group.text("✓");
        this._check.font({
            size: 20,
            family: "Arial",
            weight: "bold"
        });
        this._check.fill("#4f46e5");
        this._check.move(4, -2);

        this._labelText = this._group.text(this._label);
        this._labelText.font({
            size: this._fontSize,
            family: "Arial"
        });
        this._labelText.fill("#111827");
        this._labelText.move(32, 2);

        this.outerSvg = this._group;

        this._eventRect = this._group.rect(this.width, this.height).opacity(0).attr("id", 0);
        this.registerEvent(this._eventRect);
    }

    override update(): void {
        if (this._box != null) {
            this._box.size(this.boxSize, this.boxSize);

            if (this._checked) {
                this._box.fill("#eef2ff");
                this._box.stroke({ color: "#4f46e5", width: 2 });
            } else {
                this._box.fill("#ffffff");
                this._box.stroke({ color: "#1e1b4b", width: 2 });
            }
        }

        if (this._check != null) {
            if (this._checked) {
                this._check.show();
            } else {
                this._check.hide();
            }
        }

        if (this._labelText != null) {
            this._labelText.text(this._label);
            this._labelText.font("size", this._fontSize);
        }

        if (this._eventRect != null) {
            this._eventRect.size(this.width, this.height);
        }

        super.update();
    }

    pressReleaseState(): void {
        if (this.previousState instanceof PressedWidgetState) {
            this._checked = !this._checked;
            this.update();

            this.raise(new EventArgs(this));

            if (this._changeHandler) {
                this._changeHandler(this._checked);
            }
        }
    }

    idleupState(): void {
        if (!this._checked) {
            this._box.fill("#ffffff");
            this._box.stroke({ color: "#1e1b4b", width: 2 });
        } else {
            this._box.fill("#eef2ff");
            this._box.stroke({ color: "#4f46e5", width: 2 });
        }
    }

    idledownState(): void {
        this._box.fill("#e0e7ff");
        this._box.stroke({ color: "#4338ca", width: 2 });
    }

    pressedState(): void {
        this._box.fill("#c7d2fe");
        this._box.stroke({ color: "#312e81", width: 2 });
    }

    hoverState(): void {
        this._box.fill("#eef2ff");
        this._box.stroke({ color: "#6366f1", width: 2 });
    }

    hoverPressedState(): void {
        this._box.fill("#c7d2fe");
        this._box.stroke({ color: "#312e81", width: 2 });
    }

    pressedoutState(): void {
        this._box.fill("#e0e7ff");
        this._box.stroke({ color: "#6366f1", width: 2 });
    }

    moveState(): void {}

    keyupState(keyEvent?: KeyboardEvent): void {
        if (keyEvent && (keyEvent.key === "Enter" || keyEvent.key === " ")) {
            this._checked = !this._checked;
            this.update();

            if (this._changeHandler) {
                this._changeHandler(this._checked);
            }
        }
    }
}

export { CheckBox };