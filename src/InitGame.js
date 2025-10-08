export default class InitGame {
    constructor(container, emitter) {
        const render = document.createElement('div')
        render.classList.add('gameSettings')

        const form = document.createElement('form')

        const pcContainer = document.createElement('div')
        pcContainer.id = 'pcContainer'
        pcContainer.display = 'flex'
        pcContainer.flexDirection = 'column'

        const pcLabel = document.createElement('label')
        pcLabel.htmlFor = 'playerCount'
        pcLabel.textContent = "# of Players:"

        const pcInputContainer = document.createElement('div')
        pcInputContainer.id = 'pcInputContainer'
        pcInputContainer.style.display = 'flex'
        pcInputContainer.style.flexDirection = 'row'
        pcInputContainer.style.justifyContent = 'space-between'

        const pcCounter = document.createElement('span')

        const playerCount = document.createElement('input')
        playerCount.id = 'playerCount'
        playerCount.classList.add('playerCount')
        playerCount.required = true
        playerCount.type = 'range'
        playerCount.value = '2'
        playerCount.min = '1'
        playerCount.max = '2'
        playerCount.oninput = () => {playerCount.previousElementSibling.textContent = playerCount.value}

        pcCounter.textContent = playerCount.value

        const blContainer = document.createElement('div')
        blContainer.id = 'blContainer'
        blContainer.display = 'flex'
        blContainer.flexDirection = 'column'

        const blLabel = document.createElement('label')
        blLabel.htmlFor = 'boardLength'
        blLabel.textContent = "Board Length:"

        const blInputContainer = document.createElement('div')
        blInputContainer.id = 'blInputContainer'
        blInputContainer.style.display = 'flex'
        blInputContainer.style.flexDirection = 'row'
        blInputContainer.style.justifyContent = 'space-between'

        const blCounter = document.createElement('span')

        const boardLength = document.createElement('input')
        boardLength.id = 'boardLength'
        boardLength.classList.add('boardLength')
        boardLength.required = true
        boardLength.type = 'range'
        boardLength.value = '8'
        boardLength.min = '2'
        boardLength.max = '12'
        boardLength.oninput = () => {boardLength.previousElementSibling.textContent = boardLength.value}

        blCounter.textContent = boardLength.value

        const sppContainer = document.createElement('div')
        sppContainer.id = 'sppContainer'
        sppContainer.display = 'flex'
        sppContainer.flexDirection = 'column'

        const sppLabel = document.createElement('label')
        sppLabel.htmlFor = 'shipsPerPlayer'
        sppLabel.textContent = "Ships per player:"

        const sppInputContainer = document.createElement('div')
        sppInputContainer.id = 'sppInputContainer'
        sppInputContainer.style.display = 'flex'
        sppInputContainer.style.flexDirection = 'row'
        sppInputContainer.style.justifyContent = 'space-between'

        const sppCounter = document.createElement('span')

        const shipsPerPlayer = document.createElement('input')
        shipsPerPlayer.id = 'shipsPerPlayer'
        shipsPerPlayer.classList.add('shipsPerPlayer')
        shipsPerPlayer.required = true
        shipsPerPlayer.type = 'range'
        shipsPerPlayer.value = '4'
        shipsPerPlayer.min = '1'
        shipsPerPlayer.max = '8'
        shipsPerPlayer.oninput = () => {shipsPerPlayer.previousElementSibling.textContent = shipsPerPlayer.value}

        sppCounter.textContent = shipsPerPlayer.value

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

            if (check.value >= 3 && check.value <= 6) {
                check.checked = true
            }

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
                        settings[settingName] = Number(input.value)
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

        pcContainer.appendChild(pcLabel)
        pcInputContainer.appendChild(pcCounter)
        pcInputContainer.appendChild(playerCount)
        pcContainer.appendChild(pcInputContainer)
        form.appendChild(pcContainer)

        blContainer.appendChild(blLabel)
        blInputContainer.appendChild(blCounter)
        blInputContainer.appendChild(boardLength)
        blContainer.appendChild(blInputContainer)
        form.appendChild(blContainer)

        sppContainer.appendChild(sppLabel)
        sppInputContainer.appendChild(sppCounter)
        sppInputContainer.appendChild(shipsPerPlayer)
        sppContainer.appendChild(sppInputContainer)
        form.appendChild(sppContainer)

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