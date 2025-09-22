import EventEmitter from "node:events";

export default class Ship {
    constructor(length) {
        this.length = length

        this.pos = []

        this._health = length
        this.sunk = false

        this.vertical = true
        this.reversed = false

        this.events = new EventEmitter()

        this._render = null
    }

    set render(render) {
        if (render !== undefined) {
            this._render = render
        } else {
            const render = document.createElement("div")
            render.classList.add('ship')
            render.classList.add(`${this.length}`)
            render.classList.add(`${this.vertical}`)

            if (this.pos.length === 0) {
                render.addEventListener('dragstart', (event) => {
                    if (this.pos.length === 0) {
                        render.addEventListener('onkeydown', (event) => { // rotate ship while dragging
                            if (event.code === 'KeyR') {
                                render.classList.toggle('true')
                                this.vertical = !this.vertical;

                                if (this.vertical !== true) { // force rotation 90 degrees -- this gets called every other time R is pressed
                                    this.reversed = !this.reversed
                                }
                            }
                        })
                        event.dataTransfer.clearData('text')
                        event.dataTransfer.setData('text', JSON.stringify({ length: this.length, vertical: this.vertical, reversed: this.reversed }))
                    }
                })
            }
            this._render = render
            return render
        }
    }

    set health(health) {
        this._health = health

        if (this._health === 0) {
            this.events.emit('Sunk', this)

            this.events.removeAllListeners('Sunk')
        }
    }

    get health() {
        return this._health
    }
}