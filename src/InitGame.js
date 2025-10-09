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

        let boardSize = 64
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

        const shipsCounterContainer = document.createElement('div')
        shipsCounterContainer.id = 'scContainer'
        shipsCounterContainer.display = 'flex'
        shipsCounterContainer.flexDirection = 'column'

        const shipsCounterLabel = document.createElement('label')
        shipsCounterLabel.htmlFor = 'shipsCounter'
        shipsCounterLabel.textContent = "Ships per player: "

        const shipsCounter = document.createElement('span')
        shipsCounter.id = 'shipsCounter'
        shipsCounter.textContent = '4'

        const squareCounterContainer = document.createElement('div')
        squareCounterContainer.id = 'sqcContainer'
        squareCounterContainer.display = 'flex'
        squareCounterContainer.flexDirection = 'column'

        const squareCounterLabel = document.createElement('label')
        squareCounterLabel.htmlFor = 'squareCounter'
        squareCounterLabel.textContent = "Squares occupied: "

        const squareCounter = document.createElement('span')
        squareCounter.id = 'squareCounter'
        squareCounter.textContent = '18'

        const occupancyCounterContainer = document.createElement('div')
        occupancyCounterContainer.id = 'ocContainer'
        occupancyCounterContainer.display = 'flex'
        occupancyCounterContainer.flexDirection = 'column'

        const occupancyCounterLabel = document.createElement('label')
        occupancyCounterLabel.htmlFor = 'occupancyCounter'
        occupancyCounterLabel.textContent = "Percent occupied: "

        const occupancyCounter = document.createElement('span')
        occupancyCounter.id = 'occupancyCounter'
        occupancyCounter.textContent = '28%'

        const shipsActive = [{ value: 3, quantity: 1 }, { value: 4, quantity: 1 }, { value: 5, quantity: 1 }, { value: 6, quantity: 1 }]
        const shipLengths = document.createElement('div')
        shipLengths.classList.add('shipLengths')

        const lengths = []
        for (let i = 1; i <= boardLength.max; i++) {
            lengths.push(i)
        }

        lengths.forEach((length) => {
            const container = document.createElement('div')

            const check = document.createElement('input')
            check.type = 'checkbox'
            check.value = length
            check.id = `check${length}`
            check.classList.add('ship','check')

            const label = document.createElement('label')
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
                    }

                    if (value > Number(boardLength.value)) {
                        check.setCustomValidity("Cannot have ships longer than board length!")

                        check.checked = false
                    } else {
                        const squaresAdded = value * Number(quantity.value)

                        squareCounter.textContent = (Number(squareCounter.textContent) + squaresAdded).toString()

                        let totalSquares = 0
                        let totalShips = 0
                        shipsActive.forEach((ship) => {
                            totalShips += ship.quantity

                            const squares = ship.value * ship.quantity

                            totalSquares += squares
                        })
                        const percentOccupied = Math.round((totalSquares / boardSize) * 100) / 100

                        if (percentOccupied > .50001) {
                            occupancyCounterContainer.classList.add('invalid')
                        }
                        occupancyCounter.textContent = `${(percentOccupied * 100).toFixed(0)}%`
                        shipsCounter.textContent = totalShips.toString()
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
                    } else {
                        shipsActive.splice(foundIndex, 1)
                    }

                    const squaresRemoved = value * (quantity.value)

                    squareCounter.textContent = (Number(squareCounter.textContent) - squaresRemoved).toString()

                    let totalSquares = 0
                    let totalShips = 0
                    shipsActive.forEach((ship) => {
                        totalShips += ship.quantity

                        const squares = ship.value * ship.quantity

                        totalSquares += squares
                    })
                    const percentOccupied = Math.round((totalSquares / boardSize) * 100) / 100

                    if (percentOccupied < .50) {
                        if (occupancyCounterContainer.classList.contains('invalid')) {
                            occupancyCounterContainer.classList.remove('invalid')
                        }
                    }
                    occupancyCounter.textContent = `${(percentOccupied * 100).toFixed(0)}%`
                    shipsCounter.textContent = totalShips.toString()
                }
            })

            const quantityContainer = document.createElement('div')
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
            quantity.addEventListener('change', (event) => {
                quantityCounter.textContent = `#: ${quantity.value}`

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
                        occupancyCounterContainer.classList.add('invalid')
                    } else {
                        if (occupancyCounterContainer.classList.contains('invalid')) {
                            occupancyCounterContainer.classList.remove('invalid')
                        }
                    }
                    occupancyCounter.textContent = `${(percentOccupied * 100).toFixed(0)}%`
                    shipsCounter.textContent = totalShips.toString()
                    squareCounter.textContent = totalSquares.toString()
                }
            })
            const quantityCounter = document.createElement('span')
            quantityCounter.textContent = `#: ${quantity.value}`

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
                    if (input.checked) {
                        const quantity = form.querySelector(`#quantity${input.value}`)

                        for (let i = 0; i < quantity.value; i++) {
                            shipLengths.push(Number(input.value))
                        }
                    }
                }

                let totalSquares = 0
                shipLengths.forEach(ship => {
                    totalSquares += ship
                })

                if (totalSquares > boardSize / 2) {
                    valid = false

                    if (!occupancyCounterContainer.classList.contains('invalid')) {
                        occupancyCounterContainer.classList.add('invalid')
                    }
                } else {
                    if (occupancyCounterContainer.classList.contains('invalid')) {
                        occupancyCounterContainer.classList.remove('invalid')
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

        form.appendChild(submit)

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

        shipsCounterContainer.appendChild(shipsCounterLabel)
        shipsCounterContainer.appendChild(shipsCounter)
        form.appendChild(shipsCounterContainer)

        squareCounterContainer.appendChild(squareCounterLabel)
        squareCounterContainer.appendChild(squareCounter)
        form.appendChild(squareCounterContainer)

        occupancyCounterContainer.appendChild(occupancyCounterLabel)
        occupancyCounterContainer.appendChild(occupancyCounter)
        form.appendChild(occupancyCounterContainer)

        form.appendChild(shipLengths)

        render.appendChild(form)

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
                occupancyCounterContainer.classList.add('invalid')
            } else {
                if (occupancyCounterContainer.classList.contains('invalid')) {
                    occupancyCounterContainer.classList.remove('invalid')
                }
            }
            occupancyCounter.textContent = `${(percentOccupied * 100).toFixed(0)}%`

            boardLength.reportValidity();
        })

        container.appendChild(render)
    }
}