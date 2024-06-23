export function fillDaily(data)  {
  const result = []

	const today = new Date()

  if (data.every(item => new Date(item.date).setHours(0, 0, 0, 0) < today.setHours(0, 0, 0, 0))) {
		data.push({ date: today.toISOString(), formattedDate: today.toLocaleString('en-US', { weekday: 'short' }), value: 0 })
  }

  const dates = data.map(item => new Date(item.date))

  let currentDate = new Date(dates[dates.length - 1])

	const datesAreEqual = (date1, date2) => {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate()
	}

  for (let i = dates.length - 1; i >= 0; i--) {
    while (!datesAreEqual(currentDate, dates[i])) {
      result.unshift({ date: currentDate, formattedDate: currentDate.toLocaleString('en-US', { weekday: 'short' }), value: 0 })

      currentDate.setDate(currentDate.getDate() - 1)

      if (result.length >= 7) return formatResult(result, 'daily')
    }

    result.unshift({ date: dates[i], formattedDate: new Date(data[i].date).toLocaleString('en-US', { weekday: 'short' }), value: data[i].value })

    currentDate.setDate(currentDate.getDate() - 1)

    if (result.length >= 7) return formatResult(result, 'daily')
  }

  if (result.length < 7) {
    const firstDate = new Date(result[0].date)

    firstDate.setDate(firstDate.getDate() - 1)

    result.unshift({ date: firstDate, formattedDate: firstDate.toLocaleString('en-US', { weekday: 'short' }), value: 0 })
  }

  return formatResult(result, 'daily')
}

export function fillMonthly(data) {
  const result = []

	const today = new Date()
	if (data.every(item => (item.year < today.getFullYear() || (item.year === today.getFullYear() && item.month < today.getMonth() + 1)))){
		data.push({ month: today.getMonth() + 1, year: today.getFullYear(), value: 0 })
	}
	
  const months = data.map(item => ({ month: item.month, year: item.year }))

  let currentMonth = months[months.length - 1].month
  let currentYear = months[months.length - 1].year

  for (let i = months.length - 1; i >= 0; i--) {
    while (currentMonth !== months[i].month || currentYear !== months[i].year) {
      result.unshift({ month: currentMonth, year: currentYear, value: 0 })

      if (currentMonth === 1) {
        currentMonth = 12
        currentYear--
      } else {
        currentMonth--
      }

      if (result.length >= 12) return formatResult(result, 'monthly')
    }

    result.unshift({ ...data[i], date: new Date(data[i].year, data[i].month - 1).toLocaleString('en-US', { month: 'short' }) })

    if (currentMonth === 1) {
      currentMonth = 12
      currentYear--
    } else {
      currentMonth--
    }

    if (result.length >= 12) return formatResult(result, 'monthly')
  }

  if (result.length < 12) {
    const firstMonth = result[0].month
    const firstYear = result[0].year

    if (firstMonth === 1) {
      result.unshift({ month: 12, year: firstYear - 1, value: 0 })
    } else {
      result.unshift({ month: firstMonth - 1, year: firstYear, value: 0 })
    }
  }

  return formatResult(result, 'monthly')
}

export function fillYearly(data) {
  const result = []
	
	const today = new Date()
  if (data.every(item => item.year < today.getFullYear())) {
    data.push({ year: today.getFullYear(), value: 0 })
  }
	
  const years = data.map(item => item.year)

  let currentYear = years[years.length - 1]

  for (let i = years.length - 1; i >= 0; i--) {
    while (currentYear !== years[i]) {
      result.unshift({ year: currentYear, value: 0 })

      currentYear--

      if (result.length >= 5) return formatResult(result, 'yearly')
    }

    result.unshift({ ...data[i], date: new Date(data[i].year, 0).toLocaleString('en-US', { year: 'numeric' }) })

    currentYear--

    if (result.length >= 5) return formatResult(result, 'yearly')
  }

  if (result.length < 5) {
    const firstYear = result[0].year

    result.unshift({ year: firstYear - 1, value: 0 })
  }

  return formatResult(result, 'yearly')
}

const formatResult = (result, type) => {
  if (type === 'daily') {
    return {
			points: result.map(item => item.value),
      xAxis: result.map(item => item.formattedDate),
    }
  } else if (type === 'monthly') {
		return {
			points: result.map(item => item.value),
			xAxis: result.map(item => new Date(item.year, item.month - 1).toLocaleString('en-US', { month: 'short' })),
		}
  } else if (type === 'yearly') {
    return {
			points: result.map(item => item.value),
      xAxis: result.map(item => item.year),
    }
  }
}