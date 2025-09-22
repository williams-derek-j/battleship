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
            if (this.vertical) {
                render.classList.add(`vertical`)
            }
            if (this.reversed) {
                render.classList.add(`reversed`)
            }

            if (this.pos.length === 0) {
                render.addEventListener('dragstart', (event) => {
                    if (this.pos.length === 0) {
                        render.addEventListener('onkeydown', (event) => { // rotate ship while dragging
                            if (event.code === 'KeyR') {
                                render.classList.toggle('vertical')
                                this.vertical = !this.vertical;

                                if (this.vertical !== true) { // force rotation 90 degrees -- this gets called every other time R is pressed
                                    render.classList.toggle('reversed') // order is v (-90), hr (-180), vr (-270), h (0)
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
        }
    }

    get render() {
        if (this._render === null) {
            this.render = undefined // create render
        }
        return this._render
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