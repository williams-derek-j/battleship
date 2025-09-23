import EventEmitter from "./events";

export default class Ship {
    constructor(length) {
        this.length = length

        this._pos = []

        this._health = length
        this.sunk = false

        this.vertical = false
        this.reversed = false

        this.events = new EventEmitter()

        this._render = null
    }

    set pos(pos) {
        this._pos = pos

        const parent = this.render.parentNode
        for (let child of parent.children) {
            if (child === this.render) {
                parent.removeChild(this.render)
            }
        }
        this.render = null
    }

    get pos() {
        return this._pos
    }

    set render(renderX) {
        if (renderX !== undefined) {
            this._render = renderX
        } else {
            const renderX = document.createElement("div")
            renderX.innerText = ""
            for (let i = 0; i < this.length; i++) {
                renderX.innerText += '>'
            }
            renderX.classList.add('ship')
            renderX.classList.add(`len${this.length}`)
            if (this.vertical) {
                renderX.classList.add(`vertical`)
            }
            if (this.reversed) {
                renderX.classList.add(`reversed`)
            }

            if (this.pos.length === 0) {
                renderX.addEventListener('dragstart', (event) => {
                    event.dataTransfer.clearData('text')
                    event.dataTransfer.setData('text', JSON.stringify({ length: this.length, vertical: this.vertical, reversed: this.reversed }))

                    // render.removeEventListener('dragstart', placeRender)
                })
            }
            this._render = renderX
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
            this.events.off('Sunk', this.scuttle)
            this.events.emit('Sunk', this)
        }
    }

    get health() {
        return this._health
    }
}