export default class InitGame {
    constructor(container, emitter) {
        const render = document.createElement('div')
        render.classList.add('gameSettings')

        const form = document.createElement('form')

        const playerCount = document.createElement('input')
        playerCount.classList.add('playerCount')
        playerCount.required = true
        playerCount.type = 'range'
        playerCount.value = '2'
        playerCount.min = '1'
        playerCount.max = '2'

        const boardLength = document.createElement('input')
        boardLength.classList.add('boardLength')
        boardLength.required = true
        boardLength.type = 'range'
        boardLength.value = '8'
        boardLength.min = '2'
        boardLength.max = '12'

        const shipsPerPlayer = document.createElement('input')
        shipsPerPlayer.classList.add('shipsPerPlayer')
        shipsPerPlayer.required = true
        shipsPerPlayer.type = 'range'
        shipsPerPlayer.value = '4'
        shipsPerPlayer.min = '1'
        shipsPerPlayer.max = '8'

        const shipLengths = document.createElement('div')
        shipLengths.classList.add('shipLengths')

        const ships = []
        for (let i = 1; i <= boardLength.max; i++) {
            ships.push(i)
        }

        ships.forEach((ship) => {
            const container = document.createElement('div')

            const label = document.createElement('label')
            label.textContent = `${ship}:`

            const check = document.createElement('input')
            check.type = 'checkbox'
            check.value = ship
            check.checked = true

            container.appendChild(label)
            container.appendChild(check)

            shipLengths.appendChild(container)
        })

        const submit = document.createElement('button')
        submit.textContent = 'Submit'
        submit.addEventListener('click', (event) => {
            event.preventDefault()

            let settings = {}
            let valid = true

            const shipLengths = []

            const inputs = form.querySelectorAll('input')
            inputs.forEach((input) => {
                if (input.type === 'range') {
                    if (!input.validity.valid) {
                        input.reportValidity()

                        valid = false
                    } else {
                        const settingName = input.className
                        settings[settingName] = input.value
                    }
                } else {
                    shipLengths.push(Number(input.value))
                }
            })
            settings['shipLengths'] = shipLengths

            if (valid) {
                emitter.emit('settings submitted', settings);
            }
        })

        form.appendChild(playerCount)
        form.appendChild(boardLength)
        form.appendChild(shipsPerPlayer)
        form.appendChild(shipLengths)
        form.appendChild(submit)

        render.appendChild(form)

        boardLength.addEventListener('change', (event) => {
            event.preventDefault(); // dunno if necessary
            boardLength.setCustomValidity("")

            const checks = shipLengths.querySelectorAll('input')
            const checked = []
            checks.forEach((check) => {
                if (check.checked) {
                    checked.push(Number(check.value))
                }
            })
            for (const ship of checked) {
                if (ship > event.target.value) {
                    boardLength.setCustomValidity('Length of board must be equal to or greater than longest ship!')
                    break
                }
            }

            boardLength.reportValidity();
        })

        // shipsPerPlayer.addEventListener('change', (event) => { // will only need this as a last resort
        //     event.preventDefault()
        //     shipsPerPlayer.setCustomValidity("")
        //
        //     const checks = shipLengths.querySelectorAll('input')
        //     const checked = []
        //     checks.forEach((check) => {
        //         if (check.checked) {
        //             checked.push(Number(check.value))
        //         }
        //     })
        //
        //     if (checked.length > event.target.value) {
        //         shipsPerPlayer.setCustomValidity('Ships per player is less than the number of ship lengths checked!')
        //     }
        // })

        container.appendChild(render)
    }
}