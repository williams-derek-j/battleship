import EventEmitter from "./events";

export default class Ship {
    constructor(length) {
        this.length = length

        this.pos = []

        this._health = length
        this.sunk = false

        this.vertical = false
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
                    render.setAttribute('position', 'absolute')

                    event.dataTransfer.clearData('text')
                    event.dataTransfer.setData('text', JSON.stringify({ length: this.length, vertical: this.vertical, reversed: this.reversed }))

                    // render.removeEventListener('dragstart', placeRender)
                })
            }
            this._render = render
        }
    }

    get render() {
        // if (this._render === null) {
        //     this.render = undefined // create render
        // }
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