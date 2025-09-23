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
                render.addEventListener('onmousedown', (event) => {
                    document.addEventListener('onkeydown', (event) => { // rotate ship while dragging
                        console.log('keydown', event)
                        if (event.code === 'KeyR') {
                            render.classList.toggle('vertical')
                            this.vertical = !this.vertical;

                            if (this.vertical !== true) { // force rotation 90 degrees -- this gets called every other time R is pressed
                                render.classList.toggle('reversed') // order is v (-90), hr (-180), vr (-270), h (0)
                                this.reversed = !this.reversed
                            }
                        }
                    })
                })
                render.addEventListener('onmouseup', (event) => {
                    document.removEventListener
                })
                render.addEventListener('dragstart', (event) => {
                    render.setAttribute('position', 'absolute')

                    console.log('dragstar', event, render)
                    console.log('dragstar2', event, render)
                    event.dataTransfer.clearData('text')
                    event.dataTransfer.setData('text', JSON.stringify({ length: this.length, vertical: this.vertical, reversed: this.reversed }))
                    console.log('b4',event.dataTransfer.getData('text'))

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