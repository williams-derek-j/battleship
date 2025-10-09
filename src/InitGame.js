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

        const playerCount = document.createElement('input')
        playerCount.id = 'playerCount'
        playerCount.classList.add('playerCount')
        playerCount.required = true
        playerCount.type = 'range'
        playerCount.value = '2'
        playerCount.min = '1'
        playerCount.max = '2'
        playerCount.oninput = () => { playerCount.previousElementSibling.textContent = playerCount.value }

        const pcCounter = document.createElement('span')
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

        const boardLength = document.createElement('input')
        boardLength.id = 'boardLength'
        boardLength.classList.add('boardLength')
        boardLength.required = true
        boardLength.type = 'range'
        boardLength.value = '8'
        boardLength.min = '2'
        boardLength.max = '12'
        boardLength.oninput = () => { boardLength.previousElementSibling.textContent = boardLength.value }

        const blCounter = document.createElement('span')
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

        const shipsPerPlayer = document.createElement('input')
        shipsPerPlayer.id = 'shipsPerPlayer'
        shipsPerPlayer.classList.add('shipsPerPlayer')
        shipsPerPlayer.required = true
        shipsPerPlayer.type = 'range'
        shipsPerPlayer.value = '4'
        shipsPerPlayer.min = '1'
        shipsPerPlayer.max = '8'
        shipsPerPlayer.oninput = () => { shipsPerPlayer.previousElementSibling.textContent = shipsPerPlayer.value }

        const sppCounter = document.createElement('span')
        sppCounter.textContent = shipsPerPlayer.value

        const shipLengths = document.createElement('div')
        shipLengths.classList.add('shipLengths')

        const ships = []
        for (let i = 1; i <= boardLength.max; i++) {
            ships.push(i)
        }

        ships.forEach((ship) => {
            const container = document.createElement('div')

            const check = document.createElement('input')
            check.type = 'checkbox'
            check.value = ship
            check.id = `check${ship}`

            const label = document.createElement('label')
            label.textContent = `${ship}:`
            label.htmlFor = `check${ship}`

            if (check.value >= 3 && check.value <= 6) {
                check.checked = true
            }

            check.addEventListener('click', () => {
                if (check.checked) {
                    check.setCustomValidity("")

                    if (Number(check.value) > Number(boardLength.value)) {
                        check.setCustomValidity("Cannot have ships longer than board length!")
                    }
                    check.reportValidity()
                } else {
                    check.setCustomValidity("")
                    check.reportValidity()
                }
            })

            const quantityContainer = document.createElement('div')
            quantityContainer.style.display = 'flex'
            quantityContainer.style.flexDirection = 'row'
            quantityContainer.style.justifyContent = 'space-between'

            const quantity = document.createElement('input')
            quantity.id = `quantity${ship}`
            quantity.classList.add('ship','quantity')
            quantity.type = 'range'
            quantity.value = '1'
            quantity.min = '1'
            quantity.max = shipsPerPlayer.max
            quantity.oninput = () => { quantity.previousElementSibling.textContent = quantity.value }

            const quantityCounter = document.createElement('span')
            quantityCounter.textContent = quantity.value

            quantityContainer.appendChild(quantityCounter)
            quantityContainer.appendChild(quantity)

            container.appendChild(label)
            container.appendChild(check)
            container.appendChild(quantityContainer)

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
                    console.log('rangeinputs', input)
                    if (!input.validity.valid) {
                        console.log('invalid sn', input)
                        input.reportValidity()

                        valid = false
                    } else {
                        if (!input.className.includes('ship quantity')) {
                            console.log('valid sn', input)
                            const settingName = input.className
                            settings[settingName] = Number(input.value)
                        }
                    }
                } else if (input.type === 'checkbox') {
                    if (!input.validity.valid) {
                        input.reportValidity()

                        valid = false

                        if (shipLengths.includes(input.value)) {
                            let i = 0
                            for (const ship of shipLengths) {
                                if (ship.value === input.value) {
                                    shipLengths.splice(i, 1)
                                }
                                i++
                            }
                        }
                    } else {
                        if (input.checked) {
                            const quantity = form.querySelector(`#quantity${input.value}`)
                            shipsPerPlayer.setCustomValidity("")
                            if (shipsPerPlayer.parentElement.classList.contains('invalid')) {
                                shipsPerPlayer.parentElement.classList.remove('invalid') // parentElement is its div input container
                            }

                            for (let i = 0; i < quantity.value; i++) {
                                shipLengths.push(Number(input.value))
                            }

                            if (shipLengths.length > Number(shipsPerPlayer.value)) {
                                shipsPerPlayer.setCustomValidity("Ships per player is less than selected number of ships!")
                                shipsPerPlayer.parentElement.classList.add('invalid') // parentElement is its div input container
                                valid = false
                            } else if (shipLengths.length < Number(shipsPerPlayer.value)) {
                                shipsPerPlayer.setCustomValidity("Ships per play is more than selected number of ships!")
                                shipsPerPlayer.parentElement.classList.add('invalid') // parentElement is its div input container
                                valid = false
                            } else {
                                valid = true // need this otherwise the ships pushed to shipLengths makes the shipLengths input invalid, need something to mark it valid once shipLengths === shipsPerPlayer, if it exceeds it'll get marked invalid again
                            }
                            shipsPerPlayer.reportValidity()
                        }
                    }
                }
            })
            settings['shipLengths'] = shipLengths
            console.log(settings['shipLengths'])

            if (valid) {
                console.log('****************************form valid')
                emitter.emit('settings submitted', settings);
            } else {
                console.log('****************************form invalid')
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
            if (boardLength.parentElement.classList.contains('invalid')) {
                boardLength.parentElement.classList.remove('invalid') // parentElement is its div container
            }

            const checks = shipLengths.querySelectorAll('input')
            const checked = []
            checks.forEach((check) => {
                if (check.checked) {
                    checked.push(Number(check.value))
                }
            })
            for (const ship of checked) {
                if (ship > event.target.value) {
                    boardLength.setCustomValidity("Length of board must be equal to or greater than longest ship!")

                    boardLength.parentElement.classList.add('invalid') // parentElement is its div input container
                    break
                }
            }

            boardLength.reportValidity();
        })

        shipsPerPlayer.addEventListener('change', (event) => { // will only need this as a last resort
            console.log('spp change', event)
            event.preventDefault()
            shipsPerPlayer.setCustomValidity("")
            if (shipsPerPlayer.parentElement.classList.contains('invalid')) {
                shipsPerPlayer.parentElement.classList.remove('invalid') // parentElement is its div input container
            }

            let totalShips = 0
            const quantities = []
            const checks = shipLengths.querySelectorAll('input')
            checks.forEach((check, index) => {
                if (check.checked) {
                    quantities.push(checks[index + 1].value)
                }
            })
            console.log('qs', quantities)
            for (const quantity of quantities) {
                totalShips += quantity
            }

            console.log('here', shipsPerPlayer, shipsPerPlayer.value, totalShips)
            if (Number(shipsPerPlayer.value) < totalShips) {
                shipsPerPlayer.setCustomValidity("Ships per player is less than selected number of ships!")
                shipsPerPlayer.parentElement.classList.add('invalid')
            } else if (Number(shipsPerPlayer.value) > totalShips) {
                shipsPerPlayer.setCustomValidity('Ships per player is more than selected number of ships!')
                shipsPerPlayer.parentElement.classList.add('invalid')
            }
            shipsPerPlayer.reportValidity()
        })

        container.appendChild(render)
    }
}