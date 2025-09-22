import EventEmitter from "node:events";

export default class Ship {
    constructor(length) {
        this.length = length

        this.pos = []

        this._health = length
        this.sunk = false

        this.vertical = true

        this.events = new EventEmitter()
    }

    render() {
        const render = document.createElement("div")
        render.classList.add('ship')
        render.classList.add(`${this.length}`)
        render.classList.add(`${this.vertical}`)

        render.addEventListener('dragstart', (event) => {
            if (this.pos.length === 0) {
                render.addEventListener('onkeydown', (event) => {
                    if (event.code === 'KeyR') {
                        render.classList.toggle('true')
                        this.vertical = !this.vertical;
                    }
                })
                event.dataTransfer.clearData('text')
                event.dataTransfer.setData('text', JSON.stringify({ length: this.length, vertical: this.vertical }))
            }
        })
        return render
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