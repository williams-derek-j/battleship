export default class InitGame {
    constructor(container, emitter) {
        const render = document.createElement('div')
        render.id = 'gameSettings'

        const form = document.createElement('form')
        form.id = 'gameSettingsForm'

        const header = document.createElement('div')
        header.id = 'formHeader'

        const inputsContainer = document.createElement('div')
        inputsContainer.id = 'inputsContainer'
        inputsContainer.classList.add('setting')

        const statsContainer = document.createElement('div')
        statsContainer.id = 'statsContainer'
        statsContainer.classList.add('stat')

        const playerCount = document.createElement('input')
        playerCount.id = 'playerCount'
        playerCount.classList.add('setting','playerCount')
        playerCount.required = true
        playerCount.type = 'range'
        playerCount.value = '2'
        playerCount.min = '1'
        playerCount.max = '2'
        playerCount.oninput = () => { playerCount.previousElementSibling.textContent = playerCount.value }

        const pcContainer = document.createElement('div')
        pcContainer.id = 'pcContainer'
        pcContainer.classList.add('setting','playerCount')
        pcContainer.display = 'flex'
        pcContainer.flexDirection = 'column'

        const pcLabel = document.createElement('label')
        pcLabel.id = 'pcLabel'
        pcLabel.classList.add('setting','playerCount')
        pcLabel.htmlFor = 'playerCount'
        pcLabel.textContent = "# of Players:"

        const pcInputContainer = document.createElement('div')
        pcInputContainer.id = 'pcInputContainer'
        pcInputContainer.classList.add('setting','playerCount','rangeContainer')
        pcInputContainer.style.display = 'flex'
        pcInputContainer.style.flexDirection = 'row'
        pcInputContainer.style.justifyContent = 'space-between'

        const pcCounter = document.createElement('span')
        pcCounter.id = 'pcCounter'
        pcCounter.classList.add('setting','playerCount')
        pcCounter.textContent = playerCount.value

        const blContainer = document.createElement('div')
        blContainer.id = 'blContainer'
        blContainer.classList.add('setting','boardLength')
        blContainer.display = 'flex'
        blContainer.flexDirection = 'column'

        const blLabel = document.createElement('label')
        blLabel.id = 'blLabel'
        blLabel.classList.add('setting','boardLength')
        blLabel.htmlFor = 'boardLength'
        blLabel.textContent = "Board Length:"

        const blInputContainer = document.createElement('div')
        blInputContainer.id = 'blInputContainer'
        blInputContainer.classList.add('setting','boardLength','rangeContainer')
        blInputContainer.style.display = 'flex'
        blInputContainer.style.flexDirection = 'row'
        blInputContainer.style.justifyContent = 'space-between'

        let boardSize = 64
        const boardLength = document.createElement('input')
        boardLength.id = 'boardLength'
        boardLength.classList.add('setting','boardLength')
        boardLength.required = true
        boardLength.type = 'range'
        boardLength.value = '8'
        boardLength.min = '2'
        boardLength.max = '12'
        boardLength.oninput = () => { boardLength.previousElementSibling.textContent = boardLength.value }

        const blCounter = document.createElement('span')
        blCounter.id = 'blCounter'
        blCounter.classList.add('setting','boardLength')
        blCounter.textContent = boardLength.value

        const shipsCounter = document.createElement('span')
        shipsCounter.id = 'shipsCounter'
        shipsCounter.classList.add('stat','shipsCounter')
        shipsCounter.textContent = '4'

        const scContainer = document.createElement('div')
        scContainer.id = 'scContainer'
        scContainer.classList.add('stat','shipsCounter')
        scContainer.display = 'flex'
        scContainer.flexDirection = 'column'

        const scLabel = document.createElement('label')
        scLabel.id = 'scLabel'
        scLabel.classList.add('stat','shipsCounter')
        scLabel.htmlFor = 'shipsCounter'
        scLabel.textContent = "Ships per player: "

        const squareCounter = document.createElement('span')
        squareCounter.id = 'squareCounter'
        squareCounter.classList.add('stat','squareCounter')
        squareCounter.textContent = '18'

        const sqcContainer = document.createElement('div')
        sqcContainer.id = 'sqcContainer'
        sqcContainer.classList.add('stat','squareCounter')
        sqcContainer.display = 'flex'
        sqcContainer.flexDirection = 'column'

        const sqcLabel = document.createElement('label')
        sqcLabel.id = 'sqcLabel'
        sqcLabel.classList.add('stat','squareCounter')
        sqcLabel.htmlFor = 'squareCounter'
        sqcLabel.textContent = "Squares occupied: "

        const occupancyCounter = document.createElement('span')
        occupancyCounter.id = 'occupancyCounter'
        occupancyCounter.classList.add('stat','occupancyCounter')
        occupancyCounter.textContent = '28%'

        const ocContainer = document.createElement('div')
        ocContainer.id = 'ocContainer'
        ocContainer.classList.add('stat','occupancyCounter')
        ocContainer.display = 'flex'
        ocContainer.flexDirection = 'column'

        const ocLabel = document.createElement('label')
        ocLabel.id = 'ocLabel'
        ocLabel.classList.add('stat','occupancyCounter')
        ocLabel.htmlFor = 'occupancyCounter'
        ocLabel.textContent = "Percent occupied: "

        const shipsActive = [{ value: 3, quantity: 1 }, { value: 4, quantity: 1 }, { value: 5, quantity: 1 }, { value: 6, quantity: 1 }]
        const shipLengths = document.createElement('div')
        shipLengths.id = 'shipLengths'
        shipLengths.classList.add('setting')

        const lengths = []
        for (let i = 1; i <= boardLength.max; i++) {
            lengths.push(i)
        }

        lengths.forEach((length) => {
            const container = document.createElement('div')
            container.id = `c${length}Container`
            container.classList.add('setting','shipSelect',`check${length}`)

            const checkContainer = document.createElement('div')
            checkContainer.id = `c${length}CheckContainer`
            checkContainer.classList.add('setting','shipSelect','checkContainer',`check${length}`)

            const check = document.createElement('input')
            check.id = `check${length}`
            check.type = 'checkbox'
            check.value = length
            check.classList.add('setting','shipSelect',`check${length}`)

            const label = document.createElement('label')
            label.id = `c${length}Label`
            label.classList.add('setting','ship',`len${length}`,`check${length}`)
            label.textContent = `${length}:`
            label.htmlFor = `check${length}`

            if (check.value >= 3 && check.value <= 6) {
                check.checked = true
            }

            check.addEventListener('click', () => {
                const value = Number(check.value)

                if (check.checked) {
                    check.setCustomValidity("")

                    if (!shipsActive.some(ship => ship.value === value )) {
                        shipsActive.push({ value: value, quantity: Number(quantity.value) })
                    } else {
                        throw Error("Couldn't app ship to shipsActive! Already contained ship.")
                    }

                    if (sqcContainer.classList.contains('invalid')) { // squareCounter gets invalid class when it hits 0 squares occupied
                        sqcContainer.classList.remove('invalid')
                    }

                    if (value > Number(boardLength.value)) {
                        check.setCustomValidity("Cannot have ships longer than board length!")

                        check.checked = false
                    } else {
                        const squaresAdded = value * Number(quantity.value)

                        let totalSquares = 0
                        let totalShips = 0
                        shipsActive.forEach((ship) => {
                            totalShips += ship.quantity

                            const squares = ship.value * ship.quantity

                            totalSquares += squares
                        })
                        const percentOccupied = Math.round((totalSquares / boardSize) * 100) / 100

                        if (percentOccupied > .50001) {
                            ocContainer.classList.add('invalid')
                        }
                        occupancyCounter.textContent = `${(percentOccupied * 100).toFixed(0)}%`
                        shipsCounter.textContent = totalShips.toString()
                        squareCounter.textContent = (Number(squareCounter.textContent) + squaresAdded).toString()
                    }
                    check.reportValidity()
                } else { // uncheck
                    check.setCustomValidity("")
                    check.reportValidity()

                    let found
                    let foundIndex
                    shipsActive.forEach((ship, index) => {
                      if (ship.value === value) {
                          found = ship
                          foundIndex = index
                      }
                      index++
                    })

                    if (found === undefined) {
                        throw Error(`Unable to find and remove ship ${found} in shipsActive array!`)
                    }

                    shipsActive.splice(foundIndex, 1)

                    if (blContainer.classList.contains('invalid')) {
                        if (!shipsActive.some(ship => ship.value > boardLength)) {
                            blContainer.classList.remove('invalid')

                            boardLength.setCustomValidity("")
                            boardLength.reportValidity()
                        }
                    }

                    const squaresRemoved = value * (quantity.value)

                    let totalSquares = 0
                    let totalShips = 0
                    shipsActive.forEach((ship) => {
                        totalShips += ship.quantity

                        const squares = ship.value * ship.quantity

                        totalSquares += squares
                    })
                    const percentOccupied = Math.round((totalSquares / boardSize) * 100) / 100

                    if (percentOccupied < .50001) {
                        if (ocContainer.classList.contains('invalid')) {
                            ocContainer.classList.remove('invalid')
                        }
                    }
                    if (percentOccupied < .00001) {
                        if (!sqcContainer.classList.contains('invalid')) {
                            sqcContainer.classList.add('invalid')
                        }
                    }
                    occupancyCounter.textContent = `${(percentOccupied * 100).toFixed(0)}%`
                    shipsCounter.textContent = totalShips.toString()
                    squareCounter.textContent = (Number(squareCounter.textContent) - squaresRemoved).toString()
                }
            })

            const quantityContainer = document.createElement('div')
            quantityContainer.classList.add('rangeContainer')
            quantityContainer.style.display = 'flex'
            quantityContainer.style.flexDirection = 'row'
            quantityContainer.style.justifyContent = 'space-between'

            const quantity = document.createElement('input')
            quantity.id = `quantity${length}`
            quantity.classList.add('ship','quantity')
            quantity.type = 'range'
            quantity.value = '1'
            quantity.min = '1'
            quantity.max = '8'
            quantity.oninput = () => {
                quantity.previousElementSibling.textContent = quantity.value
            }
            quantity.addEventListener('change', (event) => {
                if (check.checked) {
                    const ship = shipsActive.find(ship => ship.value === Number(check.value))
                    ship.quantity = Number(event.target.value)

                    let totalSquares = 0
                    let totalShips = 0
                    shipsActive.forEach((ship) => {
                        totalShips += ship.quantity

                        const squares = ship.value * ship.quantity

                        totalSquares += squares
                    })

                    const percentOccupied = Math.round((totalSquares / boardSize) * 100) / 100

                    if (percentOccupied > .50001) {
                        ocContainer.classList.add('invalid')
                    } else {
                        if (ocContainer.classList.contains('invalid')) {
                            ocContainer.classList.remove('invalid')
                        }
                    }
                    occupancyCounter.textContent = `${(percentOccupied * 100).toFixed(0)}%`
                    shipsCounter.textContent = totalShips.toString()
                    squareCounter.textContent = totalSquares.toString()
                }
            })
            const quantityCounter = document.createElement('span')
            quantityCounter.id = `c${length}QuantityCounter`
            quantityCounter.textContent = `${ quantity.value }`

            quantityContainer.appendChild(quantityCounter)
            quantityContainer.appendChild(quantity)

            checkContainer.appendChild(label)
            checkContainer.appendChild(check)

            container.appendChild(checkContainer)
            container.appendChild(quantityContainer)

            shipLengths.appendChild(container)
        })

        const submit = document.createElement('button')
        submit.id = 'gameSettingsFormSubmit'
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
                        if (!input.className.includes('ship quantity')) {
                            const settingName = input.id
                            settings[settingName] = Number(input.value)
                        }
                    }
                } else if (input.type === 'checkbox') {
                    if (input.checked) {
                        const quantity = form.querySelector(`#quantity${input.value}`)

                        for (let i = 0; i < quantity.value; i++) {
                            shipLengths.push(Number(input.value))
                        }
                    }
                }
            })
            let totalSquares = 0
            shipLengths.forEach(ship => {
                totalSquares += ship
            })

            if (totalSquares > boardSize / 2) {
                valid = false

                if (!ocContainer.classList.contains('invalid')) {
                    ocContainer.classList.add('invalid')
                }
            } else if (totalSquares === 0) {
                valid = false

                if (!sqcContainer.classList.contains('invalid')) {
                    sqcContainer.classList.add('invalid')
                }
            } else {
                if (ocContainer.classList.contains('invalid')) {
                    ocContainer.classList.remove('invalid')
                }
                if (sqcContainer.classList.contains('invalid')) {
                    sqcContainer.classList.remove('invalid')
                }
            }

            settings['shipLengths'] = shipLengths

            if (valid) {
                console.log('****************************form valid')
                emitter.emit('settings submitted', settings);
            } else {
                console.log('****************************form invalid')
            }
        })

        boardLength.addEventListener('change', (event) => {
            event.preventDefault(); // dunno if necessary

            boardLength.setCustomValidity("")
            if (blContainer.classList.contains('invalid')) {
                blContainer.classList.remove('invalid')
            }
            boardSize = event.target.value ** 2

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

                    blContainer.classList.add('invalid')
                    break
                }
            }

            let totalSquares = 0
            shipsActive.forEach((ship) => {
                const squares = ship.value * ship.quantity

                totalSquares += squares
            })

            const percentOccupied = Math.round((totalSquares / boardSize) * 100) / 100

            if (percentOccupied > .50001) {
                ocContainer.classList.add('invalid')
            } else {
                if (ocContainer.classList.contains('invalid')) {
                    ocContainer.classList.remove('invalid')
                }
            }
            occupancyCounter.textContent = `${(percentOccupied * 100).toFixed(0)}%`

            boardLength.reportValidity();
        })

        form.appendChild(submit)

        pcContainer.appendChild(pcLabel)
        pcInputContainer.appendChild(pcCounter)
        pcInputContainer.appendChild(playerCount)
        pcContainer.appendChild(pcInputContainer)
        inputsContainer.appendChild(pcContainer)

        blContainer.appendChild(blLabel)
        blInputContainer.appendChild(blCounter)
        blInputContainer.appendChild(boardLength)
        blContainer.appendChild(blInputContainer)
        inputsContainer.appendChild(blContainer)

        scContainer.appendChild(scLabel)
        scContainer.appendChild(shipsCounter)
        statsContainer.appendChild(scContainer)

        sqcContainer.appendChild(sqcLabel)
        sqcContainer.appendChild(squareCounter)
        statsContainer.appendChild(sqcContainer)

        ocContainer.appendChild(ocLabel)
        ocContainer.appendChild(occupancyCounter)
        statsContainer.appendChild(ocContainer)

        header.appendChild(inputsContainer)
        header.appendChild(statsContainer)

        form.appendChild(header)
        form.appendChild(shipLengths)

        render.appendChild(form)

        container.appendChild(render)
    }
}