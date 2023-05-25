import React, { useState, useEffect } from "react"
import moment from "moment"

const CountdownTimer = () => {
    const [countdown, setCountdown] = useState("")

    useEffect(() => {
        const intervalId = setInterval(() => {
            const now = moment.utc()
            const nextTuesday = moment.utc().isoWeekday(2).startOf("day")
            const nextWednesday = moment.utc().isoWeekday(3).startOf("day")

            if (now.isAfter(nextTuesday)) {
                nextTuesday.add(1, "week")
            }

            if (now.isAfter(nextWednesday)) {
                nextWednesday.add(1, "week")
            }

            const closest = nextTuesday < nextWednesday ? nextTuesday : nextWednesday

            const duration = moment.duration(closest.diff(now))
            const days = Math.floor(duration.asDays())
            const hours = duration.hours()
            const minutes = duration.minutes()
            const seconds = duration.seconds()

            let countdownText = `${days}d ${hours}h ${minutes}m ${seconds}s`

            if (closest === nextTuesday) {
                countdownText = `The winner will be decided in ${days} days ${hours} hours ${minutes} minutes and ${seconds} seconds`
            } else {
                countdownText = `Deposit time will be over in ${hours} hours ${minutes} minutes and ${seconds} seconds`
            }

            setCountdown(countdownText)
        }, 1000)

        return () => {
            clearInterval(intervalId)
        }
    }, [])

    return <>{countdown}</>
}

export default CountdownTimer
